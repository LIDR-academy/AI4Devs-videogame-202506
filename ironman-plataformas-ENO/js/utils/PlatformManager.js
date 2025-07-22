/**
 * PlatformManager.js - Sistema de Plataformas Temáticas
 * Iron Man vs Ultron - Fase 3: Plataformas estilo Rayman Legends
 */

class PlatformManager {
    constructor(scene) {
        this.scene = scene;
        this.platforms = [];
        this.decorativeElements = [];
        
        // Tipos de plataformas
        this.platformTypes = {
            BASIC: 'basic',
            TECH: 'tech',
            NATURE: 'nature',
            FLOATING: 'floating',
            MOVING: 'moving'
        };
        
        console.log('🏗️ PlatformManager creado');
    }
    
    create() {
        console.log('🔨 Creando plataformas temáticas...');
        
        // Crear texturas de plataformas
        this.createPlatformTextures();
        
        console.log('✅ Plataformas temáticas creadas');
    }
    
    createPlatformTextures() {
        const graphics = this.scene.add.graphics();
        
        // Plataforma básica mejorada
        graphics.clear();
        this.createBasicPlatform(graphics);
        graphics.generateTexture('platform-basic-themed', 200, 32);
        
        // Plataforma tecnológica (estilo Iron Man)
        graphics.clear();
        this.createTechPlatform(graphics);
        graphics.generateTexture('platform-tech', 200, 32);
        
        // Plataforma natural (estilo Rayman)
        graphics.clear();
        this.createNaturePlatform(graphics);
        graphics.generateTexture('platform-nature', 200, 32);
        
        // Plataforma flotante con energía
        graphics.clear();
        this.createFloatingPlatform(graphics);
        graphics.generateTexture('platform-floating', 200, 32);
        
        console.log('✅ Texturas de plataformas creadas');
    }
    
    createBasicPlatform(graphics) {
        // Plataforma con textura de piedra mejorada
        const width = 200;
        const height = 32;
        
        // Base principal
        graphics.fillStyle(0x8B7355);
        graphics.fillRect(0, 0, width, height);
        
        // Borde superior más claro
        graphics.fillStyle(0xA08B6B);
        graphics.fillRect(0, 0, width, 8);
        
        // Sombra inferior
        graphics.fillStyle(0x5D4E37);
        graphics.fillRect(0, height - 4, width, 4);
        
        // Detalles de textura
        graphics.fillStyle(0x696969, 0.3);
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = 8 + Math.random() * (height - 12);
            graphics.fillRect(x, y, 2, 2);
        }
        
        // Bordes laterales con relieve
        graphics.fillStyle(0x708090);
        graphics.fillRect(0, 4, 3, height - 8);
        graphics.fillRect(width - 3, 4, 3, height - 8);
    }
    
    createTechPlatform(graphics) {
        // Plataforma tecnológica estilo Iron Man
        const width = 200;
        const height = 32;
        
        // Base metálica
        graphics.fillStyle(0x4682B4);
        graphics.fillRect(0, 0, width, height);
        
        // Líneas de circuito
        graphics.lineStyle(2, 0x00FFFF, 0.8);
        graphics.beginPath();
        graphics.moveTo(10, height/2);
        graphics.lineTo(width - 10, height/2);
        graphics.strokePath();
        
        // Puntos de conexión
        graphics.fillStyle(0x00FFFF);
        for (let i = 0; i < 5; i++) {
            const x = 20 + i * 40;
            graphics.fillCircle(x, height/2, 3);
        }
        
        // Bordes metálicos
        graphics.fillStyle(0x708090);
        graphics.fillRect(0, 0, width, 4);
        graphics.fillRect(0, height - 4, width, 4);
        
        // Detalles luminosos
        graphics.fillStyle(0x87CEEB, 0.5);
        graphics.fillRect(5, 6, width - 10, 4);
        graphics.fillRect(5, height - 10, width - 10, 4);
    }
    
    createNaturePlatform(graphics) {
        // Plataforma natural estilo Rayman Legends
        const width = 200;
        const height = 32;
        
        // Base de madera
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, width, height);
        
        // Vetas de madera
        graphics.lineStyle(1, 0x654321, 0.6);
        for (let i = 0; i < 8; i++) {
            const y = 4 + i * 3;
            graphics.beginPath();
            graphics.moveTo(0, y);
            graphics.lineTo(width, y + Math.sin(i) * 2);
            graphics.strokePath();
        }
        
        // Musgo en los bordes
        graphics.fillStyle(0x9ACD32, 0.7);
        for (let i = 0; i < width; i += 20) {
            const mossWidth = 8 + Math.random() * 8;
            graphics.fillRect(i, 0, mossWidth, 6);
            graphics.fillRect(i, height - 4, mossWidth, 4);
        }
        
        // Pequeñas flores
        graphics.fillStyle(0xFF69B4);
        for (let i = 0; i < 3; i++) {
            const x = 30 + i * 60;
            graphics.fillCircle(x, 3, 2);
        }
    }
    
    createFloatingPlatform(graphics) {
        // Plataforma flotante con energía
        const width = 200;
        const height = 32;
        
        // Base cristalina
        graphics.fillStyle(0x9370DB);
        graphics.fillRect(10, 6, width - 20, height - 12);
        
        // Efectos de energía en los bordes
        graphics.fillStyle(0xDDA0DD, 0.8);
        graphics.fillRect(0, height/2 - 4, width, 8);
        
        // Cristales en los extremos
        graphics.fillStyle(0x8A2BE2);
        // Cristal izquierdo
        graphics.beginPath();
        graphics.moveTo(0, height/2);
        graphics.lineTo(15, 6);
        graphics.lineTo(15, height - 6);
        graphics.closePath();
        graphics.fillPath();
        
        // Cristal derecho
        graphics.beginPath();
        graphics.moveTo(width, height/2);
        graphics.lineTo(width - 15, 6);
        graphics.lineTo(width - 15, height - 6);
        graphics.closePath();
        graphics.fillPath();
        
        // Puntos de luz
        graphics.fillStyle(0xFFFFFF, 0.9);
        for (let i = 0; i < 6; i++) {
            const x = 25 + i * 30;
            graphics.fillCircle(x, height/2, 2);
        }
    }
    
    // Crear plataforma con tipo específico
    createPlatform(x, y, width, type = this.platformTypes.BASIC) {
        let textureKey = 'platform-basic-themed';
        
        switch(type) {
            case this.platformTypes.TECH:
                textureKey = 'platform-tech';
                break;
            case this.platformTypes.NATURE:
                textureKey = 'platform-nature';
                break;
            case this.platformTypes.FLOATING:
                textureKey = 'platform-floating';
                break;
            default:
                textureKey = 'platform-basic-themed';
        }
        
        // Crear múltiples secciones para plataformas largas
        const sectionWidth = 200;
        const sections = Math.ceil(width / sectionWidth);
        
        const platformGroup = this.scene.physics.add.staticGroup();
        
        for (let i = 0; i < sections; i++) {
            const sectionX = x + i * sectionWidth;
            const actualWidth = Math.min(sectionWidth, width - i * sectionWidth);
            
            const platform = this.scene.add.image(sectionX + actualWidth/2, y, textureKey);
            platform.setDisplaySize(actualWidth, 32);
            platform.setOrigin(0.5, 0);
            
            // Añadir física
            this.scene.physics.add.existing(platform, true);
            platform.body.setSize(actualWidth, 32);
            
            platformGroup.add(platform);
            this.platforms.push(platform);
            
            // Efectos especiales según el tipo
            this.addPlatformEffects(platform, type);
        }
        
        return platformGroup;
    }
    
    addPlatformEffects(platform, type) {
        switch(type) {
            case this.platformTypes.TECH:
                this.addTechEffects(platform);
                break;
            case this.platformTypes.FLOATING:
                this.addFloatingEffects(platform);
                break;
            case this.platformTypes.NATURE:
                this.addNatureEffects(platform);
                break;
        }
    }
    
    addTechEffects(platform) {
        // Pulso de energía
        this.scene.tweens.add({
            targets: platform,
            alpha: 0.8,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    addFloatingEffects(platform) {
        // Movimiento de flotación
        this.scene.tweens.add({
            targets: platform,
            y: platform.y - 5,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Brillo intermitente
        this.scene.tweens.add({
            targets: platform,
            alpha: 0.9,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: 500
        });
    }
    
    addNatureEffects(platform) {
        // Crear algunas hojas que caen ocasionalmente
        this.scene.time.delayedCall(Math.random() * 5000, () => {
            this.createFallingLeaf(platform);
            this.addNatureEffects(platform); // Repetir
        });
    }
    
    createFallingLeaf(platform) {
        const leaf = this.scene.add.graphics();
        leaf.fillStyle(0x228B22, 0.8);
        leaf.fillEllipse(0, 0, 6, 4);
        
        leaf.setPosition(
            platform.x + (Math.random() - 0.5) * platform.displayWidth,
            platform.y - 10
        );
        
        // Animación de caída
        this.scene.tweens.add({
            targets: leaf,
            y: platform.y + 200,
            x: leaf.x + (Math.random() - 0.5) * 50,
            rotation: Math.PI * 2,
            alpha: 0,
            duration: 3000,
            ease: 'Sine.easeIn',
            onComplete: () => leaf.destroy()
        });
    }
    
    // Método para crear plataformas decorativas
    createDecorativePlatform(x, y, type) {
        switch(type) {
            case 'vine':
                this.createVinePlatform(null, x, y);
                break;
            case 'crystal':
                this.createCrystalPlatform(null, x, y);
                break;
            case 'tech-panel':
                this.createTechPanel(null, x, y);
                break;
        }
    }
    
    createVinePlatform(group, x, y) {
        // Crear enredadera decorativa
        const vine = this.scene.add.graphics();
        vine.lineStyle(4, 0x228B22);
        vine.beginPath();
        vine.moveTo(x, y);
        vine.quadraticCurveTo(x + 50, y - 30, x + 100, y);
        vine.strokePath();
        
        // Los graphics se añaden directamente a la escena, no al grupo
        this.decorativeElements.push(vine);
    }
    
    createCrystalPlatform(group, x, y) {
        // Crear cristales decorativos
        for (let i = 0; i < 3; i++) {
            const crystal = this.scene.add.graphics();
            crystal.fillStyle(0x9370DB, 0.8);
            crystal.fillRect(0, 0, 8, 20);
            crystal.setPosition(x + i * 30, y - 20);
            crystal.setRotation(Math.random() * 0.4 - 0.2);
            
            // Brillo
            this.scene.tweens.add({
                targets: crystal,
                alpha: 0.5,
                duration: 1000 + Math.random() * 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            
            this.decorativeElements.push(crystal);
        }
    }
    
    createTechPanel(group, x, y) {
        // Panel tecnológico decorativo
        const panel = this.scene.add.graphics();
        panel.fillStyle(0x4682B4);
        panel.fillRect(x, y - 40, 60, 30);
        
        // Luces indicadoras
        panel.fillStyle(0x00FF00);
        panel.fillCircle(x + 10, y - 25, 3);
        panel.fillStyle(0xFF0000);
        panel.fillCircle(x + 30, y - 25, 3);
        panel.fillStyle(0x0000FF);
        panel.fillCircle(x + 50, y - 25, 3);
        
        this.decorativeElements.push(panel);
    }
    
    update() {
        // Actualizar efectos de plataformas si es necesario
    }
    
    destroy() {
        this.platforms.forEach(platform => {
            if (platform && platform.destroy) {
                platform.destroy();
            }
        });
        
        this.decorativeElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        this.platforms = [];
        this.decorativeElements = [];
    }
}

console.log('📝 PlatformManager.js cargado - Fase 3'); 