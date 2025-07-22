export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tileSize = 32;
        this.width = 25;
        this.height = 18;
        this.murphyStart = { x: 1, y: 3 };
        this.gravityInterval = 200; // gravedad lenta
        this.moveInterval = 80;     // movimiento de Murphy más rápido
        this.moveCooldown = 0;
    }

    create() {
        // Inicializa el nivel y los contadores
        this.level = this.generateRandomLevel(this.width, this.height);

        this.tileGraphics = [];
        this.infotronsTotal = 0;
        this.infotronsCollected = 0;

        // Encuentra posición inicial del jugador y cuenta infotrons
        let playerPos = { ...this.murphyStart };
        for (let y = 0; y < this.level.length; y++) {
            if (!this.tileGraphics[y]) this.tileGraphics[y] = [];
            for (let x = 0; x < this.level[y].length; x++) {
                if (this.level[y][x] === 3) this.infotronsTotal++;
                this.tileGraphics[y][x] = this.drawTile(x, y, this.level[y][x]);
            }
        }
        window.updateInfotronHUD(this.infotronsCollected, this.infotronsTotal);

        // Crear jugador (Murphy)
        this.player = this.add.graphics();
        this.playerPos = { ...playerPos };
        this.redrawPlayer();

        // Ahora sí, aplica la gravedad completa
        this.applyFullGravity();

        // Gravedad animada
        this.isAnimatingGravity = false;
        this.gravityTimer = 0;

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.moveCooldown = 0;

        // Música de fondo
        // Antes de crear la música de fondo, destruye cualquier instancia previa
        const oldBgm = this.sound.get && this.sound.get('bgm');
        if (oldBgm) {
            oldBgm.stop();
            oldBgm.destroy();
        }
        this.sound.add('bgm', { loop: true, volume: 0.2 }).play();

        // Inicializa todas las banderas de estado
        this.murphyJustBecameSupport = false;
        this.justAteSupport = false;
        this.justArrivedFromAbove = false;
        this.justLeftSupport = null;
    }

    update(time, delta) {
        // 1. Procesa la gravedad primero
        this.gravityTimer += delta;
        let gravedadEnEsteFrame = false;
        if (this.gravityTimer >= this.gravityInterval) {
            this.gravityTimer = 0;
            let resultado = this.applyGravityStep();
            gravedadEnEsteFrame = true;
            if (resultado === false) return; // Aplastamiento
        }

        // Verifica aplastamiento antes de procesar input de Murphy
        if (this.celdasPeligrosas && Array.isArray(this.celdasPeligrosas)) {
            for (const celda of this.celdasPeligrosas) {
                if (
                    celda.x === 1 && celda.y >= 1 && celda.y <= this.height - 2 && // Solo para la bomba original de (1,1)
                    this.playerPos &&
                    this.playerPos.x === celda.x &&
                    this.playerPos.y === celda.y
                ) {
                    this.explodeAt(this.playerPos.x, this.playerPos.y);
                    this.add.text(
                        this.sys.game.config.width/2, 
                        this.sys.game.config.height/2 - 20, 
                        'BUM!!!', 
                        { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                    ).setOrigin(0.5);
                    this.add.text(
                        this.sys.game.config.width/2, 
                        this.sys.game.config.height/2 + 30, 
                        'Game Over', 
                        { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                    ).setOrigin(0.5);
                    this.scene.pause();
                    this.celdasPeligrosas = [];
                    return;
                }
            }
        }
        // Limpia las celdas peligrosas para este ciclo
        this.celdasPeligrosas = [];

        // Guarda la posición anterior de Murphy antes de procesar el input
        if (!this.murphyPrevPos) {
            this.murphyPrevPos = { x: this.playerPos.x, y: this.playerPos.y };
        } else {
            this.murphyPrevPos.x = this.playerPos.x;
            this.murphyPrevPos.y = this.playerPos.y;
        }

        // Ahora procesa el input de Murphy
        if (this.moveCooldown > 0) {
            this.moveCooldown -= delta;
            return;
        }

        let dx = 0, dy = 0;
        if (this.cursors.left.isDown) dx = -1;
        else if (this.cursors.right.isDown) dx = 1;
        else if (this.cursors.up.isDown) dy = -1;
        else if (this.cursors.down.isDown) dy = 1;

        // Comer a distancia (barra espaciadora + dirección)
        if (this.spaceKey.isDown && (dx !== 0 || dy !== 0)) {
            const targetX = this.playerPos.x + dx;
            const targetY = this.playerPos.y + dy;
            const tileType = this.level[targetY][targetX];
            if (tileType === 3) { // Infotron
                this.infotronsCollected++;
                window.updateInfotronHUD(this.infotronsCollected, this.infotronsTotal);
                this.level[targetY][targetX] = 0;
                this.redrawTile(targetX, targetY, 0);
                this.moveCooldown = this.moveInterval;
                return;
            } else if (tileType === 6) { // Circuito verde
                this.level[targetY][targetX] = 0;
                this.redrawTile(targetX, targetY, 0);
                this.moveCooldown = this.moveInterval;
                // Marca que Murphy acaba de comer soporte
                if (targetX === this.playerPos.x && targetY === this.playerPos.y - 1) {
                    this.justAteSupport = true;
                }
                return;
            }
        }

        if (dx !== 0 || dy !== 0) {
            // Guarda la posición anterior de Murphy justo antes de moverlo
            if (!this.murphyPrevPos) {
                this.murphyPrevPos = { x: this.playerPos.x, y: this.playerPos.y };
            } else {
                this.murphyPrevPos.x = this.playerPos.x;
                this.murphyPrevPos.y = this.playerPos.y;
            }

            // Calcula la nueva posición
            const newX = this.playerPos.x + dx;
            const newY = this.playerPos.y + dy;
            const tileType = this.level[newY][newX];

            // Si es pared, no se puede pasar
            if (tileType === 1) return;

            // Si Murphy se mueve hacia abajo justo debajo de la bomba original, marca justArrivedFromAbove
            if (
                dx === 0 && dy === 1 &&
                newX === 1 &&
                this.level[newY - 1][newX] === 7 // bomba
            ) {
                this.justArrivedFromAbove = true;
            }

            // Si es bomba (Zonk)
            if (tileType === 7) {
                if (dx !== 0 && dy === 0) {
                    const pushX = newX + dx;
                    const pushY = newY;
                    if (this.level[pushY][pushX] === 0) {
                        this.level[pushY][pushX] = 7;
                        this.redrawTile(pushX, pushY, 7);
                        this.level[newY][newX] = 0;
                        this.redrawTile(newX, newY, 0);

                        this.playerPos.x = newX;
                        this.playerPos.y = newY;
                        this.redrawPlayer();
                        this.moveCooldown = this.moveInterval;
                        this.startGravityAnimation();
                    }
                }
                return;
            }

            // Si es salida, solo permite si se han recolectado todos los Infotrons
            if (tileType === 5) {
                if (this.infotronsCollected === this.infotronsTotal) {
                    this.add.text(
                        this.sys.game.config.width/2, 
                        this.sys.game.config.height/2, 
                        '¡Nivel completado!', 
                        { font: '32px Arial', fill: '#0f0' }
                    ).setOrigin(0.5);
                    this.scene.pause();
                    this.moveCooldown = this.moveInterval;
                    return;
                }
            }

            // Si es Infotron, actualiza los contadores y el HUD
            if (tileType === 3) {
                this.infotronsCollected++;
                window.updateInfotronHUD(this.infotronsCollected, this.infotronsTotal);
                this.level[newY][newX] = 0;
                this.redrawTile(newX, newY, 0);
                // Agrega aquí:
                if (this.sound && this.sound.play) {
                    try { this.sound.play('collect', { volume: 1 }); } catch (e) {}
                }
            }

            // Si es circuito verde, bórralo
            if (tileType === 6) {
                this.level[newY][newX] = 0;
                this.redrawTile(newX, newY, 0);
            }

            // Actualiza la posición de Murphy
            this.playerPos.x = newX;
            this.playerPos.y = newY;
            this.redrawPlayer();
            this.moveCooldown = this.moveInterval;

            // Antes de mover a Murphy, si va a quedar justo debajo de la bomba original, marca la bandera
            const aboveTile = this.level[newY - 1]?.[newX];
            if (
                newY > 0 &&
                [3, 7].includes(aboveTile) // bomba o disco
            ) {
                this.murphyJustBecameSupport = true;
            } else {
                this.murphyJustBecameSupport = false;
            }

            // Ejecuta la gravedad inmediatamente después de mover a Murphy
            // this.applyGravityStep(); // Eliminado según la lógica esperada
        }
    }

    startGravityAnimation() {
        this.isAnimatingGravity = true;
        this.gravityTimer = 0;
    }

    // Gravedad animada: caída, rodar y aplastamiento robusto
    applyGravityStep() {
        let moved = false;
        // Verifica si Murphy está en una celda peligrosa antes de mover bombas
        if (this.celdasPeligrosas && Array.isArray(this.celdasPeligrosas)) {
            for (const celda of this.celdasPeligrosas) {
                if (
                    celda.x === 1 && celda.y >= 1 && celda.y <= this.height - 2 && // Solo para la bomba original de (1,1)
                    this.playerPos &&
                    this.playerPos.x === celda.x &&
                    this.playerPos.y === celda.y
                ) {
                    this.explodeAt(this.playerPos.x, this.playerPos.y);
                    this.add.text(
                        this.sys.game.config.width/2, 
                        this.sys.game.config.height/2 - 20, 
                        'BUM!!!', 
                        { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                    ).setOrigin(0.5);
                    this.add.text(
                        this.sys.game.config.width/2, 
                        this.sys.game.config.height/2 + 30, 
                        'Game Over', 
                        { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                    ).setOrigin(0.5);
                    this.scene.pause();
                    this.celdasPeligrosas = [];
                    return false;
                }
            }
        }
        // Limpia las celdas peligrosas para este ciclo
        this.celdasPeligrosas = [];

        // Guarda la posición anterior de Murphy antes de cada ciclo de gravedad
        if (!this.murphyPrevPos) {
            this.murphyPrevPos = { x: this.playerPos.x, y: this.playerPos.y };
        } else {
            this.murphyPrevPos.x = this.playerPos.x;
            this.murphyPrevPos.y = this.playerPos.y;
        }

        for (let y = this.height - 2; y >= 1; y--) {
            for (let x = 1; x < this.width - 1; x++) {
                // Elimina la restricción esBombaOriginal: aplica a todas las bombas y discos
                const tile = this.level[y][x];
                if ([3, 7].includes(tile)) {
                    const below = this.level[y + 1][x];
                    // Bitácora para todas las bombas/discos
                    if (below === 0 || (this.playerPos && this.playerPos.x === x && this.playerPos.y === y + 1)) {
                        if (this.playerPos && this.playerPos.x === x && this.playerPos.y === y + 1) {
                            // Excepción: si Murphy acaba de llegar a ser soporte, NO lo aplasta
                            if (this.murphyJustBecameSupport) {
                                continue;
                            }
                            // En cualquier otro caso, aplasta
                            this.explodeAt(this.playerPos.x, this.playerPos.y);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 - 20, 
                                'BUM!!!', 
                                { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                            ).setOrigin(0.5);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 + 30, 
                                'Game Over', 
                                { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                            ).setOrigin(0.5);
                            this.scene.pause();
                            this.justAteSupport = false;
                            this.justArrivedFromAbove = false;
                            this.justLeftSupport = null;
                            this.murphyJustBecameSupport = false;
                            return false;
                        }
                        // Si no, la bomba/disco cae normalmente
                        this.level[y + 1][x] = tile;
                        this.level[y][x] = 0;
                        this.redrawTile(x, y, 0);
                        this.redrawTile(x, y + 1, tile);
                        moved = true;
                        continue;
                    }
                    // Rodar en diagonal a la izquierda
                    if (
                        [3, 7].includes(this.level[y + 1][x]) &&
                        this.level[y][x - 1] === 0 &&
                        this.level[y + 1][x - 1] === 0
                    ) {
                        // Si Murphy está en la celda de destino diagonal y acaba de llegar a ser soporte, NO rodar
                        if (
                            this.playerPos &&
                            this.playerPos.x === x - 1 &&
                            this.playerPos.y === y + 1 &&
                            this.murphyJustBecameSupport
                        ) {
                            continue;
                        }
                        // Si Murphy está en la celda de destino diagonal y NO acaba de llegar a ser soporte, aplasta
                        if (
                            this.playerPos &&
                            this.playerPos.x === x - 1 &&
                            this.playerPos.y === y + 1
                        ) {
                            this.explodeAt(this.playerPos.x, this.playerPos.y);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 - 20, 
                                'BUM!!!', 
                                { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                            ).setOrigin(0.5);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 + 30, 
                                'Game Over', 
                                { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                            ).setOrigin(0.5);
                            this.scene.pause();
                            this.murphyJustBecameSupport = false;
                            return false;
                        }
                        this.level[y + 1][x - 1] = tile;
                        this.level[y][x] = 0;
                        this.redrawTile(x, y, 0);
                        this.redrawTile(x - 1, y + 1, tile);
                        moved = true;
                        continue;
                    }
                    // Rodar en diagonal a la derecha
                    if (
                        [3, 7].includes(this.level[y + 1][x]) &&
                        this.level[y][x + 1] === 0 &&
                        this.level[y + 1][x + 1] === 0
                    ) {
                        // Si Murphy está en la celda de destino diagonal y acaba de llegar a ser soporte, NO rodar
                        if (
                            this.playerPos &&
                            this.playerPos.x === x + 1 &&
                            this.playerPos.y === y + 1 &&
                            this.murphyJustBecameSupport
                        ) {
                            continue;
                        }
                        // Si Murphy está en la celda de destino diagonal y NO acaba de llegar a ser soporte, aplasta
                        if (
                            this.playerPos &&
                            this.playerPos.x === x + 1 &&
                            this.playerPos.y === y + 1
                        ) {
                            this.explodeAt(this.playerPos.x, this.playerPos.y);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 - 20, 
                                'BUM!!!', 
                                { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                            ).setOrigin(0.5);
                            this.add.text(
                                this.sys.game.config.width/2, 
                                this.sys.game.config.height/2 + 30, 
                                'Game Over', 
                                { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                            ).setOrigin(0.5);
                            this.scene.pause();
                            this.murphyJustBecameSupport = false;
                            return false;
                        }
                        this.level[y + 1][x + 1] = tile;
                        this.level[y][x] = 0;
                        this.redrawTile(x, y, 0);
                        this.redrawTile(x + 1, y + 1, tile);
                        moved = true;
                        continue;
                    }
                }
            }
        }

        // Segundo barrido: verifica aplastamiento
        return moved;
    }

    applyFullGravity() {
        let moved;
        do {
            moved = false;
            for (let y = this.height - 2; y >= 1; y--) {
                for (let x = 1; x < this.width - 1; x++) {
                    const tile = this.level[y][x];
                    if ([3, 7].includes(tile)) {
                        const below = this.level[y + 1][x];
                        if (below === 0) {
                            if (this.playerPos && this.playerPos.x === x && this.playerPos.y === y + 1) {
                            }
                            this.level[y + 1][x] = tile;
                            this.level[y][x] = 0;
                            this.redrawTile(x, y, 0);
                            this.redrawTile(x, y + 1, tile);
                            moved = true;
                            // Solo bitácora para la bomba que comenzó en (1,1)
                            if (x === 1 && y <= 1) {
                            }
                            // Verificar aplastamiento después de mover la bomba SOLO si playerPos es válida
                            if (
                                x === 1 && y <= 1 && // Solo para la bomba original de (1,1)
                                this.playerPos &&
                                typeof this.playerPos.x === 'number' &&
                                typeof this.playerPos.y === 'number'
                            ) {
                                if (this.playerPos.x === x && this.playerPos.y === y + 1) {
                                    this.explodeAt(this.playerPos.x, this.playerPos.y);
                                    this.add.text(
                                        this.sys.game.config.width/2, 
                                        this.sys.game.config.height/2 - 20, 
                                        'BUM!!!', 
                                        { font: 'bold 48px Arial', fill: '#ff6600', stroke: '#fff', strokeThickness: 4 }
                                    ).setOrigin(0.5);
                                    this.add.text(
                                        this.sys.game.config.width/2, 
                                        this.sys.game.config.height/2 + 30, 
                                        'Game Over', 
                                        { font: '32px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3 }
                                    ).setOrigin(0.5);
                                    this.scene.pause();
                                    return false;
                                }
                            }
                            if (this.playerPos && this.playerPos.x === x && this.playerPos.y === y + 1) {
                            }
                            continue;
                        }
                        // Rodar en diagonal a la izquierda
                        else if (
                            [3, 7].includes(this.level[y + 1][x]) &&
                            this.level[y][x - 1] === 0 &&
                            this.level[y + 1][x - 1] === 0
                        ) {
                            this.level[y + 1][x - 1] = tile;
                            this.level[y][x] = 0;
                            moved = true;
                        }
                        // Rodar en diagonal a la derecha
                        else if (
                            [3, 7].includes(this.level[y + 1][x]) &&
                            this.level[y][x + 1] === 0 &&
                            this.level[y + 1][x + 1] === 0
                        ) {
                            this.level[y + 1][x + 1] = tile;
                            this.level[y][x] = 0;
                            moved = true;
                        }
                    }
                }
            }
        } while (moved);
    }

    redrawPlayer() {
        this.player.clear();
        const px = this.playerPos.x * this.tileSize + this.tileSize / 2;
        const py = this.playerPos.y * this.tileSize + this.tileSize / 2;
        const r = this.tileSize * 0.4;

        // Círculo rojo (cuerpo)
        this.player.fillStyle(0xff0000, 1);
        this.player.fillCircle(px, py, r);

        // Línea blanca diagonal (surco)
        this.player.lineStyle(4, 0xffffff, 1);
        this.player.beginPath();
        this.player.moveTo(px - r * 0.7, py - r * 0.7);
        this.player.lineTo(px + r * 0.7, py + r * 0.7);
        this.player.strokePath();

        // Ojos (blancos)
        const eyeOffsetX = r * 0.4;
        const eyeOffsetY = -r * 0.3;
        const eyeRadius = r * 0.18;
        this.player.fillStyle(0xffffff, 1);
        this.player.fillCircle(px - eyeOffsetX, py + eyeOffsetY, eyeRadius);
        this.player.fillCircle(px + eyeOffsetX, py + eyeOffsetY, eyeRadius);

        // Pupilas (negras)
        const pupilRadius = r * 0.08;
        this.player.fillStyle(0x000000, 1);
        this.player.fillCircle(px - eyeOffsetX, py + eyeOffsetY, pupilRadius);
        this.player.fillCircle(px + eyeOffsetX, py + eyeOffsetY, pupilRadius);
    }

    redrawTile(x, y, type) {
        if (this.tileGraphics[y] && this.tileGraphics[y][x]) {
            this.tileGraphics[y][x].destroy();
            this.tileGraphics[y][x] = null;
        }
        if (type !== 0) {
            this.tileGraphics[y][x] = this.drawTile(x, y, type);
        }
    }

    drawTile(x, y, type) {
        if (type === 0) return null;
        const size = this.tileSize;
        const px = x * size;
        const py = y * size;
        const tileGfx = this.add.graphics();

        if (type === 1) {
            // Pared
            tileGfx.fillStyle(0x888888, 1);
            tileGfx.fillRect(px, py, size, size);
            tileGfx.lineStyle(2, 0x444444, 1);
            tileGfx.strokeRect(px, py, size, size);
            tileGfx.lineStyle(2, 0xffffff, 0.2);
            tileGfx.beginPath();
            tileGfx.moveTo(px, py + size);
            tileGfx.lineTo(px, py);
            tileGfx.lineTo(px + size, py);
            tileGfx.strokePath();
        } else if (type === 3) {
            // Infotron (celeste mejorado)
            tileGfx.fillStyle(0x00ffff, 1);
            tileGfx.fillCircle(px + size/2, py + size/2, size * 0.32);
            tileGfx.lineStyle(4, 0x0066cc, 1);
            tileGfx.strokeCircle(px + size/2, py + size/2, size * 0.32);
            tileGfx.fillStyle(0xffffff, 0.8);
            tileGfx.beginPath();
            tileGfx.arc(px + size/2 - size*0.10, py + size/2 - size*0.10, size*0.10, Math.PI*1.2, Math.PI*1.8, false);
            tileGfx.fillPath();
            tileGfx.lineStyle(2, 0x009999, 0.7);
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 3 * i;
                const x1 = px + size/2 + Math.cos(angle) * size * 0.10;
                const y1 = py + size/2 + Math.sin(angle) * size * 0.10;
                const x2 = px + size/2 + Math.cos(angle) * size * 0.28;
                const y2 = py + size/2 + Math.sin(angle) * size * 0.28;
                tileGfx.beginPath();
                tileGfx.moveTo(x1, y1);
                tileGfx.lineTo(x2, y2);
                tileGfx.strokePath();
            }
        } else if (type === 5) {
            // Salida
            tileGfx.fillStyle(0x0033cc, 1);
            tileGfx.fillRect(px + size*0.2, py + size*0.2, size*0.6, size*0.6);
            tileGfx.lineStyle(3, 0xffffff, 1);
            tileGfx.strokeRect(px + size*0.2, py + size*0.2, size*0.6, size*0.6);
            tileGfx.fillStyle(0xffff00, 1);
            tileGfx.fillCircle(px + size/2, py + size*0.7, size*0.06);
        } else if (type === 6) {
            // Circuito verde
            tileGfx.fillStyle(0x00bb00, 1);
            tileGfx.fillRect(px, py, size, size);
            tileGfx.lineStyle(1, 0x44ff44, 0.7);
            for (let i = 1; i < 4; i++) {
                tileGfx.beginPath();
                tileGfx.moveTo(px + i * size / 4, py);
                tileGfx.lineTo(px + i * size / 4, py + size);
                tileGfx.strokePath();
            }
            for (let i = 1; i < 4; i++) {
                tileGfx.beginPath();
                tileGfx.moveTo(px, py + i * size / 4);
                tileGfx.lineTo(px + size, py + i * size / 4);
                tileGfx.strokePath();
            }
            tileGfx.fillStyle(0x99ff99, 1);
            tileGfx.fillCircle(px + size/2, py + size/2, size*0.06);
        } else if (type === 7) {
            // Bomba (Zonk)
            tileGfx.fillStyle(0x444444, 1);
            tileGfx.fillCircle(px + size/2, py + size/2, size * 0.32);
            tileGfx.fillStyle(0xffffff, 0.3);
            tileGfx.fillCircle(px + size/2 - size*0.1, py + size/2 - size*0.1, size * 0.08);
            tileGfx.lineStyle(3, 0xff2222, 1);
            tileGfx.beginPath();
            tileGfx.moveTo(px + size/2 + size*0.18, py + size/2 - size*0.18);
            tileGfx.lineTo(px + size/2 + size*0.28, py + size/2 - size*0.28);
            tileGfx.strokePath();
        }
        return tileGfx;
    }

    generateRandomLevel(width, height) {
        const level = [];
        for (let y = 0; y < height; y++) {
            level[y] = [];
            for (let x = 0; x < width; x++) {
                if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                    level[y][x] = 1;
                } else {
                    // Generación aleatoria estándar
                    const r = Math.random();
                    if (r < 0.5) level[y][x] = 6; // Circuito verde
                    else if (r < 0.65) level[y][x] = 0; // Vacío
                    else if (r < 0.8) level[y][x] = 3; // Infotron (celeste)
                    else if (r < 0.88) level[y][x] = 1; // Pared interna
                    else if (r < 0.93) level[y][x] = 7; // Bomba
                    else level[y][x] = 0;
                }
            }
        }
        // Murphy solo como posición, no en el array
        level[this.murphyStart.y][this.murphyStart.x] = 0;
        level[height - 2][width - 2] = 5; // Salida
        return level;
    }

    // Utilidad para explotar una celda y las 6 alrededor (hexágono)
    explodeAt(x, y) {
        // 8 posiciones alrededor (todas las adyacentes)
        const positions = [
            [x, y],
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1],
            [x - 1, y - 1], [x + 1, y - 1],
            [x - 1, y + 1], [x + 1, y + 1]
        ];
        const explosionGfx = [];
        for (const [ex, ey] of positions) {
            if (
                ex > 0 && ex < this.width - 1 &&
                ey > 0 && ey < this.height - 1
            ) {
                this.level[ey][ex] = 0;
                this.redrawTile(ex, ey, 0);
                // Efecto visual simple: círculo naranja
                const gfx = this.add.graphics();
                gfx.fillStyle(0xff9900, 0.7);
                gfx.fillCircle(ex * this.tileSize + this.tileSize / 2, ey * this.tileSize + this.tileSize / 2, this.tileSize * 0.4);
                explosionGfx.push(gfx);
            }
        }
        // Desaparece a Murphy
        if (this.player) {
            this.player.clear();
            this.player.setVisible(false);
        }
        // Sonido de explosión si está disponible
        if (this.sound && this.sound.play) {
            try { this.sound.play('explosion', { volume: 1 }); } catch (e) {}
        }
        // Detén la música de fondo si está sonando
        const bgm = this.sound.get && this.sound.get('bgm');
        if (bgm) bgm.stop();
        // Limpia todos los gráficos de explosión después de 400ms, incluso si la escena está pausada
        setTimeout(() => {
            for (const gfx of explosionGfx) {
                gfx.destroy();
            }
        }, 400);

        // En todos los bloques de aplastamiento (caída o rodar), tras pausar la escena:
        this.murphyJustBecameSupport = false;
        this.justAteSupport = false;
        this.justArrivedFromAbove = false;
        this.justLeftSupport = null;
    }
}

