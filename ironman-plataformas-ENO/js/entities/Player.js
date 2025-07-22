/**
 * Player.js - Clase del Jugador (Iron Man)
 * Iron Man vs Ultron - Fase 2: Implementación completa
 */

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        
        // Propiedades del jugador
        this.health = 100;
        this.maxHealth = 100;
        this.lives = 3; // Sistema de vidas
        this.maxLives = 3;
        this.speed = 250;
        this.jumpPower = 650;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
        this.invulnerable = false;
        this.invulnerabilityTime = 2000; // 2 segundos
        
        // Sistema de daño continuo
        this.damageOverTime = false;
        this.damageOverTimeTimer = 0;
        this.damageOverTimeInterval = 700; // Daño cada 700ms (punto medio)
        this.damageOverTimeAmount = 4; // 4 puntos de daño por tick (punto medio)
        this.lastDamageTime = 0; // Control de cooldown para daño continuo
        
        // Sistema de disparos
        this.canShoot = true;
        this.shootCooldown = 300; // ms entre disparos
        this.lasers = null;
        this.damageMultiplier = 1; // Para power-ups de daño
        
        // Estados
        this.isGrounded = false;
        this.isMoving = false;
        this.isShooting = false;
        this.facingRight = true;
        
        // Power-ups
        this.canFly = false; // Para jet pack
        this.activePowerUps = []; // Lista de power-ups activos
        
        // Crear el jugador
        this.create();
    }
    
    create() {
        console.log('🤖 Creando Iron Man...');
        
        // Crear sprites de Iron Man
        this.createSprites();
        
        // Crear el sprite principal
        this.sprite = this.scene.physics.add.sprite(this.startX, this.startY, 'ironman-idle');
        
        // Configurar físicas
        this.setupPhysics();
        
        // Crear animaciones
        this.createAnimations();
        
        // Crear grupo de láser
        this.createLaserSystem();
        
        // Configurar eventos
        this.setupEvents();
        
        console.log('✅ Iron Man creado exitosamente');
    }
    
    createSprites() {
        // Crear sprites procedurales de Iron Man usando métodos básicos
        const graphics = this.scene.add.graphics();
        
        // Sprite Iron Man - Idle (rojo y dorado)
        graphics.clear();
        // Fondo transparente
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 32, 48);
        // Cuerpo principal (rojo)
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(4, 8, 24, 36);
        // Detalles dorados
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(10, 14, 12, 6); // Reactor arc
        graphics.fillRect(6, 24, 20, 3); // Líneas del pecho
        graphics.fillRect(6, 30, 20, 3);
        // Casco
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(8, 2, 16, 14);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(12, 6, 8, 6); // Visor
        graphics.generateTexture('ironman-idle', 32, 48);
        
        // Sprite Iron Man - Caminando
        graphics.clear();
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 32, 48);
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(6, 8, 24, 36);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(12, 14, 12, 6);
        graphics.fillRect(8, 24, 20, 3);
        graphics.fillRect(8, 30, 20, 3);
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(10, 2, 16, 14);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(14, 6, 8, 6);
        graphics.generateTexture('ironman-walk', 32, 48);
        
        // Sprite Iron Man - Saltando
        graphics.clear();
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 32, 48);
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(4, 8, 24, 36);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(10, 14, 12, 6);
        graphics.fillRect(6, 24, 20, 3);
        graphics.fillRect(6, 30, 20, 3);
        // Brazos extendidos
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(0, 18, 6, 10);
        graphics.fillRect(26, 18, 6, 10);
        // Casco
        graphics.fillRect(8, 2, 16, 14);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(12, 6, 8, 6);
        graphics.generateTexture('ironman-jump', 32, 48);
        
        // Sprite Iron Man - Disparando
        graphics.clear();
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 44, 48);
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(4, 8, 24, 36);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(10, 14, 12, 6);
        graphics.fillRect(6, 24, 20, 3);
        graphics.fillRect(6, 30, 20, 3);
        // Brazo disparando extendido
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(28, 16, 10, 6);
        graphics.fillStyle(0x00FFFF); // Efecto láser
        graphics.fillCircle(40, 19, 2);
        // Casco
        graphics.fillStyle(0xDC143C);
        graphics.fillRect(8, 2, 16, 14);
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(12, 6, 8, 6);
        graphics.generateTexture('ironman-shoot', 44, 48);
        
        // Proyectil láser
        graphics.clear();
        graphics.fillStyle(0x00FFFF);
        graphics.fillRect(0, 0, 16, 4);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(2, 1, 12, 2);
        graphics.generateTexture('laser-bolt', 16, 4);
        
        // Efectos de jet
        graphics.clear();
        graphics.fillStyle(0xFF4500);
        graphics.fillCircle(4, 4, 4);
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(4, 4, 2);
        graphics.generateTexture('jet-flame', 8, 8);
        
        console.log('✅ Sprites de Iron Man creados (versión simplificada)');
    }
    
    setupPhysics() {
        // Configurar propiedades físicas
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDragX(600); // Fricción para movimiento más suave
        
        // Hitbox más pequeño para no afectar la visualización del sprite
        this.sprite.body.setSize(20, 35); // Hitbox más pequeño
        this.sprite.body.setOffset(6, 13); // Offset para centrar en la parte inferior
        
        // Configurar la cámara para seguir al jugador
        this.scene.cameras.main.startFollow(this.sprite, true, 0.08, 0.08);
        this.scene.cameras.main.setDeadzone(50, 50);
    }
    
    createAnimations() {
        // Animación idle
        this.scene.anims.create({
            key: 'ironman-idle-anim',
            frames: [{ key: 'ironman-idle', frame: 0 }],
            frameRate: 1
        });
        
        // Animación caminar
        this.scene.anims.create({
            key: 'ironman-walk-anim',
            frames: [
                { key: 'ironman-walk', frame: 0 },
                { key: 'ironman-idle', frame: 0 }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // Animación saltar
        this.scene.anims.create({
            key: 'ironman-jump-anim',
            frames: [{ key: 'ironman-jump', frame: 0 }],
            frameRate: 1
        });
        
        // Animación disparar
        this.scene.anims.create({
            key: 'ironman-shoot-anim',
            frames: [{ key: 'ironman-shoot', frame: 0 }],
            frameRate: 1
        });
        
        // Iniciar con animación idle
        this.sprite.anims.play('ironman-idle-anim');
    }
    
    createLaserSystem() {
        // Crear grupo de proyectiles láser sin runChildUpdate para evitar conflictos
        this.lasers = this.scene.physics.add.group({
            defaultKey: 'laser-bolt',
            maxSize: 15,
            runChildUpdate: false // Desactivar para manejar manualmente
        });
    }
    
    setupEvents() {
        // Evento cuando el jugador toca el suelo
        this.sprite.body.onWorldBounds = true;
        
        // Resetear doble salto cuando toca el suelo
        this.sprite.body.world.on('worldbounds', (event, body) => {
            if (body.gameObject === this.sprite && event.down) {
                this.hasDoubleJumped = false;
                this.isGrounded = true;
            }
        });
    }
    
    update() {
        // Actualizar estado del suelo
        this.isGrounded = this.sprite.body.touching.down || this.sprite.body.blocked.down;
        
        if (this.isGrounded) {
            this.hasDoubleJumped = false;
        }
        
        // Actualizar movimiento
        this.updateMovement();
        
        // Actualizar animaciones
        this.updateAnimations();
        
        // Limpiar proyectiles fuera de pantalla
        this.cleanupLasers();
    }
    
    updateMovement() {
        const cursors = this.scene.cursors;
        const wasd = this.scene.wasdKeys;
        const spaceKey = this.scene.spaceKey;
        
        // Movimiento horizontal
        this.isMoving = false;
        
        if (cursors.left.isDown || wasd.A.isDown) {
            this.sprite.setVelocityX(-this.speed);
            this.facingRight = false;
            this.isMoving = true;
        } else if (cursors.right.isDown || wasd.D.isDown) {
            this.sprite.setVelocityX(this.speed);
            this.facingRight = true;
            this.isMoving = true;
        } else {
            this.sprite.setVelocityX(0);
        }
        
        // Salto y Jet Pack
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || 
            Phaser.Input.Keyboard.JustDown(wasd.W) || 
            Phaser.Input.Keyboard.JustDown(spaceKey)) {
            this.jump();
        }
        
        // Jet Pack - vuelo continuo mientras se mantiene la tecla
        if (this.canFly && (cursors.up.isDown || wasd.W.isDown || spaceKey.isDown)) {
            this.sprite.setVelocityY(-200); // Vuelo hacia arriba
            this.createJetEffect(); // Efecto visual continuo
        }
        
        // Disparar - usar justDown para evitar disparos automáticos
        if (Phaser.Input.Keyboard.JustDown(this.scene.shootKey)) {
            this.shoot();
        }
        
        // El disparo con mouse se maneja en GameScene.js con eventos
        
        // Actualizar orientación del sprite
        this.sprite.setFlipX(!this.facingRight);
    }
    
    updateAnimations() {
        if (this.isShooting) {
            this.sprite.anims.play('ironman-shoot-anim', true);
            return;
        }
        
        if (!this.isGrounded) {
            this.sprite.anims.play('ironman-jump-anim', true);
        } else if (this.isMoving) {
            this.sprite.anims.play('ironman-walk-anim', true);
        } else {
            this.sprite.anims.play('ironman-idle-anim', true);
        }
    }
    
    jump() {
        if (this.isGrounded) {
            // Salto normal
            this.sprite.setVelocityY(-this.jumpPower);
            console.log('�� Iron Man salta');
            
            // Sonido de jet para salto
            if (this.scene.audioManager) {
                this.scene.audioManager.playJetSound();
            }
        } else if (this.canDoubleJump && !this.hasDoubleJumped) {
            // Doble salto
            this.sprite.setVelocityY(-this.jumpPower * 0.8);
            this.hasDoubleJumped = true;
            console.log('🚀 Iron Man doble salto');
            
            // Sonido de jet para doble salto
            if (this.scene.audioManager) {
                this.scene.audioManager.playJetSound();
            }
            
            // Efecto visual de jets (placeholder)
            this.createJetEffect();
        }
    }
    
    shoot() {
        if (!this.canShoot) return;
        
        this.canShoot = false;
        this.isShooting = true;
        
        // Crear proyectil láser
        const laser = this.lasers.get();
        
        if (laser) {
            // Posición más precisa del brazo de Iron Man
            const offsetX = this.facingRight ? 28 : -12;
            const offsetY = -5; // A la altura del brazo centrado
            
            laser.setActive(true);
            laser.setVisible(true);
            laser.setPosition(
                this.sprite.x + offsetX,
                this.sprite.y + offsetY
            );
            
            // Configurar velocidad del láser
            const laserSpeed = 800;
            laser.setVelocityX(this.facingRight ? laserSpeed : -laserSpeed);
            laser.setVelocityY(0);
            laser.setGravityY(0); // Sin gravedad para que vaya recto
            
            // Configurar rotación
            laser.setRotation(this.facingRight ? 0 : Math.PI);
            
            // Aplicar multiplicador de daño si está activo
            if (this.damageMultiplier > 1) {
                laser.setScale(1.5); // Láser más grande
                laser.setTint(0xFF0000); // Color rojo para daño extra
                laser.setData('damage', 2); // Daño doble
            } else {
                laser.setScale(1);
                laser.clearTint();
                laser.setData('damage', 1);
            }
            
            console.log(`💥 Iron Man dispara láser (daño: ${laser.getData('damage')})`);
            
            // Efecto sonoro del disparo usando AudioManager
            if (this.scene.audioManager) {
                this.scene.audioManager.playLaserSound();
            }
            
            // Efecto visual del disparo
            this.createShootEffect();
        }
        
        // Cooldown de disparo
        this.scene.time.delayedCall(this.shootCooldown, () => {
            this.canShoot = true;
            this.isShooting = false;
        });
    }
    
    createJetEffect() {
        // Efecto visual de los jets para el doble salto
        const jetLeft = this.scene.add.sprite(this.sprite.x - 8, this.sprite.y + 20, 'jet-flame');
        const jetRight = this.scene.add.sprite(this.sprite.x + 8, this.sprite.y + 20, 'jet-flame');
        
        // Animación de desvanecimiento
        this.scene.tweens.add({
            targets: [jetLeft, jetRight],
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            y: '+=20',
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                jetLeft.destroy();
                jetRight.destroy();
            }
        });
    }
    
    createShootSound() {
        // Crear sonido procedural de láser usando Web Audio API
        if (this.scene.sound && this.scene.sound.context) {
            const context = this.scene.sound.context;
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            // Configurar sonido de láser
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
            
            oscillator.type = 'sawtooth';
            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.1);
        } else {
            // Fallback sin sonido si no está disponible
            console.log('🔊 *Sonido láser Iron Man*');
        }
    }
    
    createShootEffect() {
        // Efecto visual del disparo
        const muzzleFlash = this.scene.add.sprite(
            this.sprite.x + (this.facingRight ? 26 : -10),
            this.sprite.y - 5,
            'jet-flame'
        );
        
        muzzleFlash.setTint(0x00FFFF);
        muzzleFlash.setScale(0.8);
        
        this.scene.tweens.add({
            targets: muzzleFlash,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 150,
            ease: 'Power2',
            onComplete: () => muzzleFlash.destroy()
        });
    }
    
    cleanupLasers() {
        // Limpiar proyectiles fuera de los límites del mundo
        this.lasers.children.entries.forEach(laser => {
            if (laser && laser.active && (
                laser.x < -50 || 
                laser.x > this.scene.physics.world.bounds.width + 50 ||
                laser.y < -50 || 
                laser.y > this.scene.physics.world.bounds.height + 50
            )) {
                laser.destroy(); // Destruir completamente en lugar de desactivar
            }
        });
    }
    
    takeDamage(amount = 50) {
        if (this.invulnerable) return false;
        
        // Daño fijo de 50 puntos por toque
        this.health -= amount;
        this.health = Math.max(0, this.health);
        
        console.log(`💥 Iron Man recibe daño (${amount}). Vida restante: ${this.health}`);
        
        // Sonido de daño
        if (this.scene.audioManager) {
            this.scene.audioManager.playDamageSound();
        }
        
        // Efecto visual de daño
        this.sprite.setTint(0xFF0000);
        this.scene.time.delayedCall(200, () => {
            this.sprite.clearTint();
        });
        
        // Hacer invulnerable temporalmente después de recibir daño
        this.invulnerable = true;
        this.scene.time.delayedCall(this.invulnerabilityTime, () => {
            this.invulnerable = false;
        });
        
        // Verificar si murió
        if (this.health <= 0) {
            // En lugar de morir directamente, perder una vida
            return true; // Indicar que debe perder una vida
        }
        
        return false;
    }
    
    loseLife() {
        this.lives--;
        console.log(`💔 Iron Man pierde una vida! Vidas restantes: ${this.lives}/${this.maxLives}`);
        
        // Sistema de daño simplificado - no requiere reset
        
        if (this.lives <= 0) {
            // No quedan vidas, Game Over
            this.die();
            return true;
        } else {
            // Regenerar salud para la siguiente vida
            this.health = this.maxHealth;
            console.log(`💚 Iron Man se regenera. Salud: ${this.health}/${this.maxHealth}`);
            
            // Efecto visual de regeneración
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.8,
                duration: 200,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    this.sprite.alpha = 1;
                }
            });
            
            return false;
        }
    }
    
    heal(amount = 10) {
        this.health += amount;
        this.health = Math.min(this.maxHealth, this.health);
        console.log(`💚 Iron Man se cura ${amount} puntos. Salud: ${this.health}/${this.maxHealth}`);
    }
    
    die() {
        console.log('💀 Iron Man ha sido derrotado');
        
        // Actualizar tiempo final de juego
        GameUtils.updateGameTime();
        
        // Efecto de muerte
        this.scene.tweens.add({
            targets: this.sprite,
            rotation: Math.PI * 2,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Cambiar a escena de game over
                this.scene.scene.start('GameOverScene', {
                    score: gameState.score,
                    level: gameState.currentLevel,
                    victory: false
                });
            }
        });
        
        // Desactivar controles
        this.sprite.setVelocity(0, 0);
        this.sprite.body.enable = false;
    }
    
    // Getters para acceso desde otras clases
    getSprite() {
        return this.sprite;
    }
    
    getLasers() {
        return this.lasers;
    }
    
    getHealth() {
        return this.health;
    }
    
    getMaxHealth() {
        return this.maxHealth;
    }
    
    getLives() {
        return this.lives;
    }
    
    getMaxLives() {
        return this.maxLives;
    }
    
    isAlive() {
        return this.lives > 0;
    }
    
    // Resetear daño continuo cuando se aleja del enemigo
    resetDamageOverTime() {
        // Método mantenido por compatibilidad, pero ya no necesario con sistema simplificado
        console.log('🛡️ Sistema de daño simplificado - no requiere reset');
    }
}

console.log('📝 Player.js - Clase Iron Man implementada completamente - Fase 2'); 