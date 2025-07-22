/**
 * PowerUp.js - Sistema de Power-ups para Iron Man
 * Fase 5: Mejoras Avanzadas
 */

class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y);
        
        this.type = type;
        this.duration = 10000; // 10 segundos por defecto
        this.isActive = false;
        this.activeTimer = 0;
        
        // Configurar según el tipo
        this.setupPowerUp();
        
        // Añadir a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar física
        this.setBounce(0.8);
        this.setCollideWorldBounds(true);
        this.setVelocityX(Phaser.Math.Between(-30, 30));
        this.setVelocityY(Phaser.Math.Between(-50, -20));
        
        // Animación flotante
        this.createFloatingAnimation();
        
        console.log(`⚡ Power-up ${this.type} creado en (${x}, ${y})`);
    }
    
    setupPowerUp() {
        const graphics = this.scene.add.graphics();
        
        switch (this.type) {
            case 'shield':
                this.createShieldSprite(graphics);
                this.duration = 15000; // 15 segundos
                break;
            case 'speed':
                this.createSpeedSprite(graphics);
                this.duration = 8000; // 8 segundos
                break;
            case 'damage':
                this.createDamageSprite(graphics);
                this.duration = 12000; // 12 segundos
                break;
            case 'jetpack':
                this.createJetpackSprite(graphics);
                this.duration = 10000; // 10 segundos
                break;
            default:
                this.createShieldSprite(graphics);
        }
        
        graphics.destroy();
    }
    
    createShieldSprite(graphics) {
        // Escudo azul brillante
        graphics.fillStyle(0x00BFFF);
        graphics.fillCircle(16, 16, 16);
        graphics.fillStyle(0x87CEEB);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(16, 16, 8);
        graphics.generateTexture('powerup-shield', 32, 32);
        this.setTexture('powerup-shield');
    }
    
    createSpeedSprite(graphics) {
        // Boost de velocidad naranja
        graphics.fillStyle(0xFF8C00);
        graphics.fillRect(4, 4, 24, 24);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(8, 8, 16, 16);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(12, 12, 8, 8);
        graphics.generateTexture('powerup-speed', 32, 32);
        this.setTexture('powerup-speed');
    }
    
    createDamageSprite(graphics) {
        // Daño extra rojo
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(4, 4, 24, 24);
        graphics.fillStyle(0xFF4444);
        graphics.fillRect(8, 8, 16, 16);
        graphics.fillStyle(0xFFFF00);
        graphics.fillRect(12, 12, 8, 8);
        graphics.generateTexture('powerup-damage', 32, 32);
        this.setTexture('powerup-damage');
    }
    
    createJetpackSprite(graphics) {
        // Jet pack verde
        graphics.fillStyle(0x32CD32);
        graphics.fillRect(4, 4, 24, 24);
        graphics.fillStyle(0x90EE90);
        graphics.fillRect(8, 8, 16, 16);
        graphics.fillStyle(0x00FF00);
        graphics.fillRect(12, 12, 8, 8);
        graphics.generateTexture('powerup-jetpack', 32, 32);
        this.setTexture('powerup-jetpack');
    }
    
    createFloatingAnimation() {
        try {
            if (!this.scene || !this.scene.tweens) {
                console.warn('⚠️ Scene o tweens no disponibles para animación flotante');
                return;
            }
            
        // Animación de flotación
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Animación de rotación
        this.scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 3000,
            ease: 'Linear',
            repeat: -1
        });
        } catch (error) {
            console.warn('⚠️ Error al crear animación flotante:', error);
        }
    }
    
    applyEffect(player) {
        if (this.isActive) return false;
        
        this.isActive = true;
        this.activeTimer = this.duration;
        
        switch (this.type) {
            case 'shield':
                this.applyShieldEffect(player);
                break;
            case 'speed':
                this.applySpeedEffect(player);
                break;
            case 'damage':
                this.applyDamageEffect(player);
                break;
            case 'jetpack':
                this.applyJetpackEffect(player);
                break;
        }
        
        console.log(`⚡ Power-up ${this.type} activado para ${this.duration/1000} segundos`);
        return true;
    }
    
    applyShieldEffect(player) {
        // Escudo temporal - inmunidad a daño
        player.isInvulnerable = true;
        player.sprite.setTint(0x00BFFF);
        
        // Efecto visual de escudo
        this.createShieldVisual(player);
    }
    
    applySpeedEffect(player) {
        // Velocidad aumentada
        const originalSpeed = player.speed;
        player.speed = originalSpeed * 1.5;
        player.sprite.setTint(0xFF8C00);
        
        // Restaurar velocidad después del efecto
        this.scene.time.delayedCall(this.duration, () => {
            try {
                if (player && player.sprite && player.sprite.active) {
            player.speed = originalSpeed;
            player.sprite.clearTint();
                }
            } catch (error) {
                console.warn('⚠️ Error al restaurar velocidad del jugador:', error);
            }
        });
    }
    
    applyDamageEffect(player) {
        // Daño extra en disparos
        player.damageMultiplier = 2;
        player.sprite.setTint(0xFF0000);
        
        // Restaurar daño después del efecto
        this.scene.time.delayedCall(this.duration, () => {
            try {
                if (player && player.sprite && player.sprite.active) {
            player.damageMultiplier = 1;
            player.sprite.clearTint();
                }
            } catch (error) {
                console.warn('⚠️ Error al restaurar daño del jugador:', error);
            }
        });
    }
    
    applyJetpackEffect(player) {
        // Jet pack - vuelo temporal
        player.canFly = true;
        player.sprite.setTint(0x32CD32);
        
        // Restaurar después del efecto
        this.scene.time.delayedCall(this.duration, () => {
            try {
                if (player && player.sprite && player.sprite.active) {
            player.canFly = false;
            player.sprite.clearTint();
                }
            } catch (error) {
                console.warn('⚠️ Error al restaurar jetpack del jugador:', error);
            }
        });
    }
    
    createShieldVisual(player) {
        // Crear efecto visual de escudo
        const shield = this.scene.add.graphics();
        shield.lineStyle(3, 0x00BFFF, 0.8);
        shield.strokeCircle(player.sprite.x, player.sprite.y, 40);
        
        // Animación del escudo
        this.scene.tweens.add({
            targets: shield,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Seguir al jugador
        this.scene.tweens.add({
            targets: shield,
            x: player.sprite.x,
            y: player.sprite.y,
            duration: 100,
            repeat: -1
        });
        
        // Destruir escudo después del efecto
        this.scene.time.delayedCall(this.duration, () => {
            try {
                if (shield && shield.active) {
            shield.destroy();
                }
                if (player && player.sprite && player.sprite.active) {
            player.isInvulnerable = false;
            player.sprite.clearTint();
                }
            } catch (error) {
                console.warn('⚠️ Error al destruir escudo visual:', error);
            }
        });
    }
    
    update(time, delta) {
        if (this.isActive) {
            this.activeTimer -= delta;
            if (this.activeTimer <= 0) {
                this.isActive = false;
                console.log(`⚡ Power-up ${this.type} expirado`);
            }
        }
    }
    
    destroy() {
        // Limpiar animaciones antes de destruir
        try {
            if (this.scene && this.scene.tweens) {
        this.scene.tweens.killTweensOf(this);
            }
        } catch (error) {
            console.warn('⚠️ Error al limpiar tweens del PowerUp:', error);
        }
        
        try {
        super.destroy();
        } catch (error) {
            console.warn('⚠️ Error al destruir PowerUp:', error);
        }
    }
}

console.log('📝 PowerUp.js cargado - Fase 5: Sistema de Power-ups'); 