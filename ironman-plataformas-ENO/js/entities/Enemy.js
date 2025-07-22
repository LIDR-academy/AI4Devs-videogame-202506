/**
 * Enemy.js - Clase de Enemigos Ultron
 * Iron Man vs Ultron - Fase 4: Sistema de Enemigos con IA
 */

class Enemy extends Phaser.Physics.Arcade.Sprite {
    static nextId = 1;
    
    constructor(scene, x, y) {
        super(scene, x, y);
        
        // Configuración básica
        this.enemyId = Enemy.nextId++;
        this.isAlive = true;
        this.health = 3;
        this.maxHealth = 3;
        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
        
        // Configuración de movimiento
        this.speed = 50;
        this.jumpForce = -300;
        this.direction = 1; // 1 = derecha, -1 = izquierda
        
        // Configuración de IA simplificada
        this.aiState = 'PATROL';
        this.patrolTimer = 0;
        this.patrolDuration = 2000; // 2 segundos por dirección
        
        // Sprites y animaciones
        this.currentAnimation = 'idle';
        this.sprites = {};
        this.createSprites();
        this.setupAnimations();
        
        // Configurar física DESPUÉS de crear sprites
        this.setupPhysics();
        
        console.log(`🤖 Ultron #${this.enemyId} creado en (${x}, ${y})`);
    }
    
    setupPhysics() {
        // Asegurar que el sprite esté en la escena antes de configurar física
        if (this.scene) {
            this.scene.add.existing(this);
            this.scene.physics.add.existing(this);
        }
        
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setGravityY(800);
        this.setSize(32, 40);
        this.setOffset(16, 12);
    }
    
    createSprites() {
        // Crear texturas para Ultron
        this.createUltronSprites();
    }
    
    createUltronSprites() {
        // Sprite idle
        const idleGraphics = this.scene.add.graphics();
        this.drawUltronIdle(idleGraphics);
        idleGraphics.generateTexture('ultron-idle', 64, 52);
        idleGraphics.destroy();
        this.sprites.idle = 'ultron-idle';
        
        // Sprite walk
        const walkGraphics = this.scene.add.graphics();
        this.drawUltronWalk(walkGraphics);
        walkGraphics.generateTexture('ultron-walk', 64, 52);
        walkGraphics.destroy();
        this.sprites.walk = 'ultron-walk';
        
        // Sprite damaged
        const damagedGraphics = this.scene.add.graphics();
        this.drawUltronDamaged(damagedGraphics);
        damagedGraphics.generateTexture('ultron-damaged', 64, 52);
        damagedGraphics.destroy();
        this.sprites.damaged = 'ultron-damaged';
        
        // Establecer sprite inicial
        this.setTexture('ultron-idle');
        this.setDisplaySize(64, 52);
    }
    
    drawUltronIdle(graphics) {
        // Fondo transparente
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 64, 52);
        
        // Cuerpo principal - metálico plateado (rectángulo en lugar de elipse)
        graphics.fillStyle(0xC0C0C0);
        graphics.fillRect(18, 25, 28, 20);
        
        // Cabeza - forma angular característica de Ultron
        graphics.fillStyle(0xA9A9A9);
        graphics.fillRect(24, 15, 16, 14);
        
        // Ojos rojos brillantes
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(26, 17, 4, 4);
        graphics.fillRect(34, 17, 4, 4);
        graphics.fillStyle(0xFF6666);
        graphics.fillRect(27, 18, 2, 2);
        graphics.fillRect(35, 18, 2, 2);
        
        // Boca/rejilla característica
        graphics.lineStyle(1, 0x800000);
        graphics.lineBetween(26, 25, 38, 25);
        graphics.lineBetween(28, 27, 36, 27);
        
        // Brazos
        graphics.fillStyle(0xB0B0B0);
        graphics.fillRect(14, 22, 8, 16);
        graphics.fillRect(42, 22, 8, 16);
        
        // Manos/garras
        graphics.fillStyle(0x909090);
        graphics.fillRect(14, 35, 6, 8);
        graphics.fillRect(44, 35, 6, 8);
        
        // Piernas
        graphics.fillStyle(0xA9A9A9);
        graphics.fillRect(26, 45, 6, 12);
        graphics.fillRect(32, 45, 6, 12);
        
        // Detalles tecnológicos
        graphics.fillStyle(0x0080FF);
        graphics.fillRect(30, 32, 4, 2);
        graphics.fillRect(29, 38, 6, 1);
    }
    
    drawUltronWalk(graphics) {
        // Similar al idle pero con posición ligeramente diferente
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 64, 52);
        
        // Cuerpo principal
        graphics.fillStyle(0xC0C0C0);
        graphics.fillRect(18, 24, 28, 20);
        
        // Cabeza inclinada ligeramente
        graphics.fillStyle(0xA9A9A9);
        graphics.fillRect(25, 14, 16, 14);
        
        // Ojos rojos
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(27, 16, 4, 4);
        graphics.fillRect(35, 16, 4, 4);
        graphics.fillStyle(0xFF6666);
        graphics.fillRect(28, 17, 2, 2);
        graphics.fillRect(36, 17, 2, 2);
        
        // Boca
        graphics.lineStyle(1, 0x800000);
        graphics.lineBetween(27, 24, 39, 24);
        graphics.lineBetween(29, 26, 37, 26);
        
        // Brazos en movimiento
        graphics.fillStyle(0xB0B0B0);
        graphics.fillRect(13, 21, 8, 16);
        graphics.fillRect(43, 23, 8, 16);
        
        // Manos
        graphics.fillStyle(0x909090);
        graphics.fillRect(13, 34, 6, 8);
        graphics.fillRect(45, 36, 6, 8);
        
        // Piernas en posición de caminar
        graphics.fillStyle(0xA9A9A9);
        graphics.fillRect(25, 44, 6, 12);
        graphics.fillRect(33, 46, 6, 12);
        
        // Detalles
        graphics.fillStyle(0x0080FF);
        graphics.fillRect(30, 31, 4, 2);
        graphics.fillRect(29, 37, 6, 1);
    }
    
    drawUltronDamaged(graphics) {
        // Ultron dañado con efectos
        graphics.fillStyle(0x000000, 0);
        graphics.fillRect(0, 0, 64, 52);
        
        // Cuerpo principal con daños
        graphics.fillStyle(0xA0A0A0);
        graphics.fillRect(18, 25, 28, 20);
        
        // Grietas en el cuerpo
        graphics.lineStyle(2, 0x404040);
        graphics.lineBetween(25, 30, 35, 40);
        graphics.lineBetween(30, 28, 38, 35);
        
        // Cabeza dañada
        graphics.fillStyle(0x808080);
        graphics.fillRect(24, 15, 16, 14);
        
        // Un ojo roto, otro funcionando
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(26, 17, 4, 4);
        graphics.fillStyle(0x404040);
        graphics.fillRect(34, 17, 4, 4);
        graphics.fillStyle(0xFF6666);
        graphics.fillRect(27, 18, 2, 2);
        
        // Boca con daños
        graphics.lineStyle(1, 0x600000);
        graphics.lineBetween(26, 25, 38, 25);
        graphics.lineBetween(28, 27, 32, 27);
        
        // Brazos
        graphics.fillStyle(0x909090);
        graphics.fillRect(14, 22, 8, 16);
        graphics.fillRect(42, 22, 8, 16);
        
        // Manos
        graphics.fillStyle(0x707070);
        graphics.fillRect(14, 35, 6, 8);
        graphics.fillRect(44, 35, 6, 8);
        
        // Piernas
        graphics.fillStyle(0x808080);
        graphics.fillRect(26, 45, 6, 12);
        graphics.fillRect(32, 45, 6, 12);
        
        // Chispas de daño
        graphics.fillStyle(0xFFFF00);
        graphics.fillRect(22, 32, 2, 2);
        graphics.fillRect(42, 38, 2, 2);
        graphics.fillRect(35, 28, 2, 2);
    }
    
    setupAnimations() {
        this.animationTimer = 0;
        this.animationDuration = 500;
    }
    
    update(time, delta) {
        if (!this.isAlive) return;
        
        // Actualizar animación
        this.updateAnimation();
        
        // Actualizar IA simplificada (solo patrulla)
        this.updateAI(time, delta);
        
        // Actualizar invulnerabilidad
        if (this.isInvulnerable) {
            this.invulnerabilityTimer -= delta;
            if (this.invulnerabilityTimer <= 0) {
                this.isInvulnerable = false;
                this.setTint(0xffffff);
            }
        }
    }
    
    updateAI(time, delta) {
        // IA simplificada: solo patrulla
        this.patrolBehavior();
    }
    
    patrolBehavior() {
        this.currentAnimation = 'walk';
        
        // Determinar si está en una plataforma (altura < 350)
        const isOnPlatform = this.y < 350;
        
        if (isOnPlatform) {
            // Enemigo en plataforma - movimiento muy limitado
            const platformWidth = 80; // Ancho reducido para movimiento más seguro
            const startX = this.x - (platformWidth / 2);
            const endX = this.x + (platformWidth / 2);
            
            // Cambiar dirección si llega al borde de la plataforma (más conservador)
            if (this.x <= startX + 30 || this.x >= endX - 30) {
                this.direction *= -1;
            }
            
            // Mover muy lento en plataformas
            this.setVelocityX(this.speed * 0.3 * this.direction);
        } else {
            // Enemigo en suelo - movimiento normal
            this.setVelocityX(this.speed * this.direction);
            
            // Cambiar dirección cada cierto tiempo
            this.patrolTimer += this.scene.game.loop.delta;
            if (this.patrolTimer >= this.patrolDuration) {
                this.direction *= -1;
                this.patrolTimer = 0;
            }
        }
        
        this.setFlipX(this.direction < 0);
        
        // Saltar solo si hay obstáculo y está en el suelo
        if (!isOnPlatform && (this.body.blocked.left || this.body.blocked.right)) {
            this.direction *= -1;
            if (this.body.blocked.down) {
                this.jump();
            }
        }
    }
    
    jump() {
        if (this.body.blocked.down) {
            this.setVelocityY(this.jumpForce);
        }
    }
    
    updateAnimation() {
        // Cambiar sprite según la animación actual
        if (this.sprites[this.currentAnimation]) {
            this.setTexture(this.sprites[this.currentAnimation]);
        }
    }
    
    takeDamage(damage = 1) {
        if (this.isInvulnerable || !this.isAlive) {
            console.log(`🛡️ Ultron #${this.enemyId} es invulnerable o está muerto`);
            return false;
        }
        
        this.health -= damage;
        this.isInvulnerable = true;
        this.invulnerabilityTimer = 300; // Invulnerabilidad reducida
        
        // Efecto visual de daño
        this.setTint(0xFF6666);
        this.currentAnimation = 'damaged';
        
        // Pequeño empuje hacia arriba
        this.setVelocityY(-150);
        
        let enemyKilled = false;
        if (this.health <= 0) {
            this.die();
            enemyKilled = true;
        }
        
        console.log(`🤖 Ultron #${this.enemyId} recibe ${damage} daño. Salud: ${this.health}/${this.maxHealth}`);
        return enemyKilled;
    }
    
    die() {
        this.isAlive = false;
        this.setVelocity(0, -200);
        
        // Remover del grupo de enemigos inmediatamente
        if (this.scene.enemies && this.scene.enemies.contains(this)) {
            this.scene.enemies.remove(this);
        }
        
        // Efecto de muerte
        this.createDeathEffect();
        
        console.log(`💀 Ultron #${this.enemyId} destruido`);
        
        // Destruir después de la animación
        this.scene.time.delayedCall(1000, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }
    
    createDeathEffect() {
        // Efectos de explosión/muerte usando graphics
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xFF0000);
        explosion.fillCircle(this.x, this.y, 20);
        explosion.fillStyle(0xFF6600);
        explosion.fillCircle(this.x, this.y, 15);
        explosion.fillStyle(0xFFFF00);
        explosion.fillCircle(this.x, this.y, 10);
        
        // Destruir explosión después
        this.scene.time.delayedCall(500, () => {
            if (explosion) {
                explosion.destroy();
            }
        });
    }
    
    destroy() {
        super.destroy();
    }
}

console.log('📝 Enemy.js cargado - Fase 4: Enemigos Ultron Simplificados');