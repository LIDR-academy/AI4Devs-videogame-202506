/**
 * BackgroundManager.js - Sistema de Fondos Multicapa
 * Iron Man vs Ultron - Fase 3: Estilo Rayman Legends
 */

class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.layers = [];
        this.decorativeElements = [];
        
        // Configuración de capas de paralaje
        this.parallaxLayers = [
            { name: 'sky', scrollFactor: 0.1, depth: -100 },
            { name: 'mountains-far', scrollFactor: 0.2, depth: -90 },
            { name: 'mountains-mid', scrollFactor: 0.4, depth: -80 },
            { name: 'clouds', scrollFactor: 0.3, depth: -70 },
            { name: 'trees-back', scrollFactor: 0.6, depth: -60 },
            { name: 'trees-front', scrollFactor: 0.8, depth: -50 }
        ];
        
        console.log('🎨 BackgroundManager creado');
    }
    
    create() {
        console.log('🌄 Creando mundo estilo Rayman Legends...');
        
        // Crear texturas procedurales para el fondo
        this.createBackgroundTextures();
        
        // Crear capas de fondo
        this.createSkyLayer();
        this.createMountainLayers();
        this.createCloudLayer();
        this.createTreeLayers();
        this.createAtmosphericElements();
        
        console.log('✅ Mundo Rayman Legends creado');
    }
    
    createBackgroundTextures() {
        const graphics = this.scene.add.graphics();
        
        // Textura del cielo con degradado usando graphics en lugar de canvas
        graphics.clear();
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98D8E8, 0xF0E68C, 1);
        graphics.fillRect(0, 0, 1024, 576);
        graphics.generateTexture('sky-gradient', 1024, 576);
        
        // Montañas lejanas
        graphics.clear();
        graphics.fillStyle(0x483D8B, 0.6); // Violeta oscuro semi-transparente
        this.createMountainSilhouette(graphics, 0, 350, 1024, 226, 0.3);
        graphics.generateTexture('mountains-far', 1024, 576);
        
        // Montañas medias
        graphics.clear();
        graphics.fillStyle(0x6A5ACD, 0.8); // Violeta medio
        this.createMountainSilhouette(graphics, 0, 400, 1024, 176, 0.5);
        graphics.generateTexture('mountains-mid', 1024, 576);
        
        // Árboles de fondo
        graphics.clear();
        graphics.fillStyle(0x228B22, 0.7); // Verde bosque
        this.createTreeSilhouettes(graphics, true);
        graphics.generateTexture('trees-back', 1024, 576);
        
        // Árboles de frente
        graphics.clear();
        graphics.fillStyle(0x32CD32, 0.9); // Verde brillante
        this.createTreeSilhouettes(graphics, false);
        graphics.generateTexture('trees-front', 1024, 576);
        
        // Nubes estilo Rayman
        graphics.clear();
        graphics.fillStyle(0xFFFFFF, 0.8);
        this.createStylizedClouds(graphics);
        graphics.generateTexture('stylized-clouds', 1024, 576);
        
        console.log('✅ Texturas de fondo creadas');
    }
    
    createMountainSilhouette(graphics, x, y, width, height, variance) {
        graphics.beginPath();
        graphics.moveTo(x, y + height);
        
        // Crear silueta de montañas con variación
        const points = 20;
        for (let i = 0; i <= points; i++) {
            const px = x + (width / points) * i;
            const baseHeight = y + Math.sin(i * 0.3) * height * variance;
            const randomVariation = (Math.random() - 0.5) * height * variance;
            const py = baseHeight + randomVariation;
            
            if (i === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        }
        
        graphics.lineTo(x + width, y + height);
        graphics.lineTo(x, y + height);
        graphics.closePath();
        graphics.fillPath();
    }
    
    createTreeSilhouettes(graphics, isBackground) {
        const treeCount = isBackground ? 8 : 12;
        const baseY = isBackground ? 420 : 450;
        const maxHeight = isBackground ? 120 : 150;
        
        for (let i = 0; i < treeCount; i++) {
            const x = (1024 / treeCount) * i + Math.random() * 50;
            const height = maxHeight * (0.6 + Math.random() * 0.4);
            const width = 20 + Math.random() * 15;
            
            // Tronco
            graphics.fillRect(x - width/4, baseY - height/3, width/2, height/3);
            
            // Copa del árbol (forma orgánica)
            graphics.fillCircle(x, baseY - height + 30, width * 0.8);
            graphics.fillCircle(x - width * 0.3, baseY - height + 20, width * 0.6);
            graphics.fillCircle(x + width * 0.3, baseY - height + 25, width * 0.5);
        }
    }
    
    createStylizedClouds(graphics) {
        const cloudPositions = [
            { x: 100, y: 80, scale: 1.2 },
            { x: 300, y: 120, scale: 0.8 },
            { x: 500, y: 60, scale: 1.0 },
            { x: 700, y: 100, scale: 1.1 },
            { x: 900, y: 70, scale: 0.9 }
        ];
        
        cloudPositions.forEach(cloud => {
            this.drawStylizedCloud(graphics, cloud.x, cloud.y, cloud.scale);
        });
    }
    
    drawStylizedCloud(graphics, x, y, scale) {
        // Nube estilo cartoon/Rayman
        const baseSize = 30 * scale;
        
        // Círculos que forman la nube
        graphics.fillCircle(x, y, baseSize);
        graphics.fillCircle(x - baseSize * 0.7, y, baseSize * 0.8);
        graphics.fillCircle(x + baseSize * 0.7, y, baseSize * 0.8);
        graphics.fillCircle(x - baseSize * 0.3, y - baseSize * 0.5, baseSize * 0.6);
        graphics.fillCircle(x + baseSize * 0.3, y - baseSize * 0.5, baseSize * 0.6);
        graphics.fillCircle(x, y - baseSize * 0.7, baseSize * 0.7);
    }
    
    createSkyLayer() {
        const sky = this.scene.add.image(512, 288, 'sky-gradient');
        sky.setScrollFactor(0.1);
        sky.setDepth(-100);
        this.layers.push(sky);
    }
    
    createMountainLayers() {
        // Montañas lejanas
        for (let i = 0; i < 3; i++) {
            const mountains = this.scene.add.image(512 + i * 1024, 288, 'mountains-far');
            mountains.setScrollFactor(0.2);
            mountains.setDepth(-90);
            this.layers.push(mountains);
        }
        
        // Montañas medias
        for (let i = 0; i < 3; i++) {
            const mountains = this.scene.add.image(512 + i * 1024, 288, 'mountains-mid');
            mountains.setScrollFactor(0.4);
            mountains.setDepth(-80);
            this.layers.push(mountains);
        }
    }
    
    createCloudLayer() {
        // Nubes que se mueven lentamente
        for (let i = 0; i < 4; i++) {
            const clouds = this.scene.add.image(512 + i * 1024, 288, 'stylized-clouds');
            clouds.setScrollFactor(0.3);
            clouds.setDepth(-70);
            clouds.setAlpha(0.9);
            this.layers.push(clouds);
            
            // Animación suave de movimiento de nubes
            this.scene.tweens.add({
                targets: clouds,
                x: clouds.x + 50,
                duration: 20000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createTreeLayers() {
        // Árboles de fondo
        for (let i = 0; i < 4; i++) {
            const trees = this.scene.add.image(512 + i * 1024, 288, 'trees-back');
            trees.setScrollFactor(0.6);
            trees.setDepth(-60);
            trees.setAlpha(0.8);
            this.layers.push(trees);
        }
        
        // Árboles de frente
        for (let i = 0; i < 4; i++) {
            const trees = this.scene.add.image(512 + i * 1024, 288, 'trees-front');
            trees.setScrollFactor(0.8);
            trees.setDepth(-50);
            this.layers.push(trees);
        }
    }
    
    createAtmosphericElements() {
        // Partículas flotantes estilo Rayman
        this.createFloatingParticles();
        
        // Efectos de luz
        this.createLightEffects();
    }
    
    createFloatingParticles() {
        // Partículas mágicas flotando en el ambiente
        for (let i = 0; i < 15; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(0xFFD700, 0.6);
            particle.fillCircle(0, 0, 2 + Math.random() * 3);
            
            const x = Math.random() * 2048;
            const y = 100 + Math.random() * 300;
            particle.setPosition(x, y);
            particle.setScrollFactor(0.5);
            particle.setDepth(-40);
            
            // Animación de flotación
            this.scene.tweens.add({
                targets: particle,
                y: y - 30,
                alpha: 0.3,
                duration: 3000 + Math.random() * 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 2000
            });
            
            this.decorativeElements.push(particle);
        }
    }
    
    createLightEffects() {
        // Rayos de sol suaves
        const sunRays = this.scene.add.graphics();
        sunRays.lineStyle(20, 0xFFFF99, 0.1);
        
        for (let i = 0; i < 5; i++) {
            const startX = 200 + i * 300;
            const startY = 0;
            const endX = startX + 100;
            const endY = 400;
            
            sunRays.lineBetween(startX, startY, endX, endY);
        }
        
        sunRays.setScrollFactor(0.2);
        sunRays.setDepth(-85);
        this.layers.push(sunRays);
        
        // Animación suave de los rayos
        this.scene.tweens.add({
            targets: sunRays,
            alpha: 0.05,
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    update() {
        // Actualizar elementos animados si es necesario
        // (Las animaciones ya están configuradas con tweens)
    }
    
    // Métodos para cambiar la atmosfera según el nivel
    setTimeOfDay(timeOfDay) {
        // Para futuras fases: cambiar colores según la hora
        switch(timeOfDay) {
            case 'dawn':
                // Colores del amanecer
                break;
            case 'day':
                // Colores del día
                break;
            case 'sunset':
                // Colores del atardecer
                break;
            case 'night':
                // Colores de la noche
                break;
        }
    }
    
    destroy() {
        this.layers.forEach(layer => {
            if (layer && layer.destroy) {
                layer.destroy();
            }
        });
        
        this.decorativeElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        this.layers = [];
        this.decorativeElements = [];
    }
}

console.log('📝 BackgroundManager.js cargado - Fase 3'); 