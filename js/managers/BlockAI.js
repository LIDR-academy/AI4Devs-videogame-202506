class BlockAI {
    constructor() {
        this.reorganizationThreshold = 0.6;
        this.lastReorganization = 0;
        this.reorganizationCooldown = 5000; // 5 seconds
    }
    
    analyzeBlockData() {
        const analysis = {
            totalBlocks: gameState.blockData.size,
            dangerousBlocks: 0,
            averageDanger: 0,
            hotSpots: []
        };
        
        let totalDanger = 0;
        const dangerousBlocks = [];
        
        gameState.blockData.forEach((data, id) => {
            totalDanger += data.dangerLevel;
            
            if (data.dangerLevel >= this.reorganizationThreshold) {
                analysis.dangerousBlocks++;
                dangerousBlocks.push(data);
            }
        });
        
        analysis.averageDanger = analysis.totalBlocks > 0 ? totalDanger / analysis.totalBlocks : 0;
        analysis.dangerousBlocks = dangerousBlocks;
        
        console.log('Block AI Analysis:', analysis);
        return analysis;
    }
    
    shouldReorganize() {
        const currentTime = Date.now();
        if (currentTime - this.lastReorganization < this.reorganizationCooldown) {
            return false;
        }
        
        const analysis = this.analyzeBlockData();
        return analysis.dangerousBlocks > 0 && analysis.averageDanger > 0.3;
    }
    
    reorganizeBlocks(scene) {
        if (!this.shouldReorganize()) {
            return false;
        }
        
        console.log('BlockAI: Starting block reorganization...');
        
        const analysis = this.analyzeBlockData();
        const blocksToMove = [];
        
        // Find blocks that need to move
        scene.blocks.forEach(block => {
            const blockData = gameState.blockData.get(block.id);
            if (blockData && blockData.dangerLevel >= this.reorganizationThreshold) {
                blocksToMove.push(block);
            }
        });
        
        // Calculate safe positions (corners and edges)
        const safePositions = this.calculateSafePositions(scene);
        
        // Move dangerous blocks to safe positions
        blocksToMove.forEach((block, index) => {
            if (index < safePositions.length) {
                const targetPosition = safePositions[index];
                this.moveBlockToPosition(scene, block, targetPosition);
            }
        });
        
        this.lastReorganization = Date.now();
        return true;
    }
    
    calculateSafePositions(scene) {
        const gameWidth = scene.game.config.width;
        const gameHeight = scene.game.config.height;
        const margin = 50;
        const blockWidth = 75;
        const blockHeight = 25;
        
        const safePositions = [
            // Corners
            { x: margin + blockWidth / 2, y: margin + blockHeight / 2 },
            { x: gameWidth - margin - blockWidth / 2, y: margin + blockHeight / 2 },
            { x: margin + blockWidth / 2, y: 200 },
            { x: gameWidth - margin - blockWidth / 2, y: 200 },
            
            // Edges
            { x: gameWidth / 4, y: margin + blockHeight / 2 },
            { x: (gameWidth * 3) / 4, y: margin + blockHeight / 2 },
            { x: margin + blockWidth / 2, y: 150 },
            { x: gameWidth - margin - blockWidth / 2, y: 150 }
        ];
        
        // Filter out positions occupied by existing blocks
        const occupiedPositions = scene.blocks.map(block => block.getPosition());
        
        return safePositions.filter(pos => {
            return !occupiedPositions.some(occupied => 
                Math.abs(occupied.x - pos.x) < blockWidth && 
                Math.abs(occupied.y - pos.y) < blockHeight
            );
        });
    }
    
    moveBlockToPosition(scene, block, targetPosition) {
        console.log(`Moving block ${block.id} to safe position:`, targetPosition);
        
        // Animate block movement
        scene.tweens.add({
            targets: block.getSprite(),
            x: targetPosition.x,
            y: targetPosition.y,
            duration: 1000,
            ease: 'Power2',
            onStart: () => {
                // Visual effect to show movement
                block.getSprite().setStrokeStyle(4, 0xffff00);
            },
            onComplete: () => {
                // Reset visual effect
                block.getSprite().setStrokeStyle(2, 0xffffff);
                
                // Update block data
                const blockData = gameState.blockData.get(block.id);
                if (blockData) {
                    blockData.dangerLevel = Math.max(0, blockData.dangerLevel - 0.3);
                }
            }
        });
        
        // Create movement trail effect
        const trail = scene.add.graphics();
        trail.lineStyle(2, 0xffff00, 0.5);
        trail.beginPath();
        trail.moveTo(block.getSprite().x, block.getSprite().y);
        trail.lineTo(targetPosition.x, targetPosition.y);
        trail.strokePath();
        
        // Fade out trail
        scene.tweens.add({
            targets: trail,
            alpha: 0,
            duration: 1500,
            onComplete: () => trail.destroy()
        });
    }
    
    updateBlockDangerLevels() {
        const currentTime = Date.now();
        
        gameState.blockData.forEach((data, id) => {
            // Decrease danger over time if not hit recently
            if (currentTime - data.lastHitTime > 10000) { // 10 seconds
                data.dangerLevel = Math.max(0, data.dangerLevel - 0.05);
            }
            
            // Increase danger based on nearby impacts
            const nearbyHits = this.countNearbyHits(data);
            data.dangerLevel = Math.min(1.0, data.dangerLevel + (nearbyHits * 0.1));
        });
    }
    
    countNearbyHits(blockData) {
        let nearbyHits = 0;
        const maxDistance = 100;
        
        gameState.blockData.forEach((otherData, otherId) => {
            if (otherId !== blockData.id) {
                const distance = Math.sqrt(
                    Math.pow(blockData.positionHits.x - otherData.positionHits.x, 2) +
                    Math.pow(blockData.positionHits.y - otherData.positionHits.y, 2)
                );
                
                if (distance < maxDistance && otherData.hitCount > 0) {
                    nearbyHits += otherData.hitCount;
                }
            }
        });
        
        return nearbyHits;
    }
    
    triggerLevelTransition(scene) {
        console.log('BlockAI: Level transition triggered');
        
        // Major reorganization for level change
        if (scene.blocks.length > 0) {
            this.reorganizeBlocks(scene);
            
            // Some blocks might become revenge blocks
            const blocksToUpgrade = Math.min(
                Math.floor(scene.blocks.length * 0.3), // 30% of blocks
                gameState.level * 2 // Max based on level
            );
            
            for (let i = 0; i < blocksToUpgrade; i++) {
                const randomBlock = scene.blocks[Math.floor(Math.random() * scene.blocks.length)];
                if (randomBlock && randomBlock.type === 'normal') {
                    randomBlock.becomeRevengeBlock();
                }
            }
        }
    }
}

// Create global instance
const blockAI = new BlockAI();