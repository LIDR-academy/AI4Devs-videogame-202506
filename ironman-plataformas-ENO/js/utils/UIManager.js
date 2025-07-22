/**
 * UIManager.js - Sistema de UI Mejorada para Iron Man vs Ultron
 * Fase 7: UI Mejorada y Configuración
 */

class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.elements = {};
        this.powerUpIndicators = {};
        this.configPanel = null;
        this.isConfigOpen = false;
        
        // Configuración de colores estilo Iron Man
        this.colors = {
            primary: 0xFF0000,      // Rojo Iron Man
            secondary: 0xFFD700,    // Dorado
            accent: 0x00BFFF,       // Azul
            background: 0x000000,   // Negro
            text: 0xFFFFFF,         // Blanco
            health: 0x00FF00,       // Verde para vida
            damage: 0xFF0000        // Rojo para daño
        };
        
        // Inicializar UI
        this.init();
        
        console.log('🎨 UIManager inicializado');
    }
    
    init() {
        this.createMainHUD();
        this.createPowerUpIndicators();
        this.createConfigPanel();
        this.createGameStats();
    }
    
    createMainHUD() {
        // Crear HUD principal con estilo Iron Man
        const hudContainer = this.scene.add.container(0, 0);
        
        // Fondo del HUD - usar ancho completo del mundo (2048px)
        const hudBg = this.scene.add.rectangle(0, 0, 2048, 80, this.colors.background, 0.8);
        hudBg.setOrigin(0, 0);
        hudBg.setScrollFactor(0); // Hacer fijo
        hudContainer.add(hudBg);
        
        // Barra de vida mejorada
        this.createHealthBar(hudContainer);
        
        // Contador de vidas con iconos
        this.createLivesDisplay(hudContainer);
        
        // Puntuación con efectos
        this.createScoreDisplay(hudContainer);
        
        // Indicador de nivel
        this.createLevelIndicator(hudContainer);
        
        // Hacer todo el HUD fijo
        hudContainer.setScrollFactor(0);
        
        this.elements.hud = hudContainer;
        console.log('✅ HUD principal creado (ancho completo, fijo)');
    }
    
    createHealthBar(container) {
        const x = 150;
        const y = 25;
        const width = 150; // Reducida de 200 a 150
        const height = 15; // Reducida de 20 a 15
        
        // Fondo de la barra
        const healthBg = this.scene.add.rectangle(x, y, width, height, 0x333333, 0.8);
        healthBg.setOrigin(0, 0);
        healthBg.setScrollFactor(0);
        container.add(healthBg);
        
        // Barra de vida principal
        const healthBar = this.scene.add.rectangle(x + 2, y + 2, width - 4, height - 4, this.colors.health, 0.9);
        healthBar.setOrigin(0, 0);
        healthBar.setScrollFactor(0);
        container.add(healthBar);
        
        // Texto de vida (ajustado para evitar superposición)
        const healthText = this.scene.add.text(x + width + 15, y, '100/100', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        healthText.setOrigin(0, 0);
        healthText.setScrollFactor(0);
        container.add(healthText);
        
        // Icono de vida
        const healthIcon = this.scene.add.circle(x - 25, y + 10, 8, this.colors.health);
        healthIcon.setScrollFactor(0);
        container.add(healthIcon);
        
        this.elements.healthBar = healthBar;
        this.elements.healthText = healthText;
        this.elements.healthIcon = healthIcon;
    }
    
    createLivesDisplay(container) {
        const x = 420; // Ajustado para evitar superposición con el texto de vida
        const y = 25;
        
        // Texto de vidas
        const livesText = this.scene.add.text(x, y, 'Vidas: 3', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        livesText.setOrigin(0, 0);
        livesText.setScrollFactor(0);
        container.add(livesText);
        
        // Iconos de vidas
        const livesIcons = [];
        for (let i = 0; i < 3; i++) {
            const icon = this.scene.add.circle(x + 80 + (i * 25), y + 10, 8, this.colors.primary);
            icon.setScrollFactor(0);
            livesIcons.push(icon);
            container.add(icon);
        }
        
        this.elements.livesText = livesText;
        this.elements.livesIcons = livesIcons;
    }
    
    createScoreDisplay(container) {
        const x = 600;
        const y = 25;
        
        // Texto de puntuación
        const scoreText = this.scene.add.text(x, y, 'Puntuación: 0', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        });
        scoreText.setOrigin(0, 0);
        scoreText.setScrollFactor(0);
        container.add(scoreText);
        
        this.elements.scoreText = scoreText;
    }
    
    createLevelIndicator(container) {
        const x = 850;
        const y = 25;
        
        // Texto de nivel
        const levelText = this.scene.add.text(x, y, 'Nivel: 1', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#00BFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        levelText.setOrigin(0, 0);
        levelText.setScrollFactor(0);
        container.add(levelText);
        
        this.elements.levelText = levelText;
    }
    
    createPowerUpIndicators(container) {
        const powerUpContainer = this.scene.add.container(0, 100);
        
        // Título de power-ups
        const powerUpTitle = this.scene.add.text(20, 0, 'Power-ups Activos:', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        powerUpTitle.setOrigin(0, 0);
        powerUpTitle.setScrollFactor(0);
        powerUpContainer.add(powerUpTitle);
        
        // Crear indicadores para cada tipo de power-up
        const powerUpTypes = ['shield', 'speed', 'damage', 'jetpack'];
        const colors = {
            shield: 0x00BFFF,
            speed: 0xFF8C00,
            damage: 0xFF0000,
            jetpack: 0x32CD32
        };
        
        powerUpTypes.forEach((type, index) => {
            const y = 25 + (index * 30);
            
            // Icono del power-up
            const icon = this.scene.add.circle(20, y + 10, 6, colors[type]);
            icon.setScrollFactor(0);
            powerUpContainer.add(icon);
            
            // Nombre del power-up
            const name = this.scene.add.text(35, y, type.toUpperCase(), {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 1
            });
            name.setOrigin(0, 0);
            name.setScrollFactor(0);
            powerUpContainer.add(name);
            
            // Barra de duración
            const barBg = this.scene.add.rectangle(120, y + 10, 80, 8, 0x333333, 0.8);
            barBg.setOrigin(0, 0);
            powerUpContainer.add(barBg);
            
            const bar = this.scene.add.rectangle(122, y + 12, 76, 4, colors[type], 0.9);
            bar.setOrigin(0, 0);
            powerUpContainer.add(bar);
            
            // Texto de tiempo
            const timeText = this.scene.add.text(210, y, '0s', {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 1
            });
            timeText.setOrigin(0, 0);
            powerUpContainer.add(timeText);
            
            // Ocultar inicialmente
            icon.setVisible(false);
            name.setVisible(false);
            barBg.setVisible(false);
            bar.setVisible(false);
            timeText.setVisible(false);
            
            this.powerUpIndicators[type] = {
                icon: icon,
                name: name,
                barBg: barBg,
                bar: bar,
                timeText: timeText,
                active: false
            };
        });
        
        powerUpContainer.setScrollFactor(0);
        this.elements.powerUpContainer = powerUpContainer;
        console.log('✅ Indicadores de power-ups creados (fijos)');
    }
    
    createConfigPanel() {
        // Panel de configuración (inicialmente oculto)
        const configContainer = this.scene.add.container(512, 288);
        
        // Fondo del panel
        const panelBg = this.scene.add.rectangle(0, 0, 400, 300, this.colors.background, 0.95);
        panelBg.setStrokeStyle(2, this.colors.primary);
        configContainer.add(panelBg);
        
        // Título
        const title = this.scene.add.text(0, -120, 'CONFIGURACIÓN', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        title.setOrigin(0.5, 0.5);
        configContainer.add(title);
        
        // Sección de Audio
        this.createAudioSection(configContainer);
        
        // Botón de cerrar
        const closeButton = this.scene.add.text(150, -120, 'X', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 2
        });
        closeButton.setOrigin(0.5, 0.5);
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => this.toggleConfig());
        configContainer.add(closeButton);
        
        // Ocultar inicialmente
        configContainer.setVisible(false);
        
        this.configPanel = configContainer;
        console.log('✅ Panel de configuración creado');
    }
    
    createAudioSection(container) {
        const y = -60;
        
        // Título de audio
        const audioTitle = this.scene.add.text(-150, y, 'AUDIO', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        audioTitle.setOrigin(0, 0);
        container.add(audioTitle);
        
        // Slider de volumen master
        this.createSlider(container, -150, y + 30, 'Volumen Master', (value) => {
            if (this.scene.audioManager) {
                this.scene.audioManager.setMasterVolume(value);
            }
        });
        
        // Slider de volumen música
        this.createSlider(container, -150, y + 60, 'Volumen Música', (value) => {
            if (this.scene.audioManager) {
                this.scene.audioManager.setMusicVolume(value);
            }
        });
        
        // Slider de volumen efectos
        this.createSlider(container, -150, y + 90, 'Volumen Efectos', (value) => {
            if (this.scene.audioManager) {
                this.scene.audioManager.setSfxVolume(value);
            }
        });
    }
    
    createSlider(container, x, y, label, callback) {
        // Etiqueta
        const labelText = this.scene.add.text(x, y, label, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        labelText.setOrigin(0, 0);
        container.add(labelText);
        
        // Fondo del slider
        const sliderBg = this.scene.add.rectangle(x + 120, y + 10, 100, 8, 0x333333, 0.8);
        sliderBg.setOrigin(0, 0);
        container.add(sliderBg);
        
        // Barra del slider
        const sliderBar = this.scene.add.rectangle(x + 122, y + 12, 96, 4, this.colors.primary, 0.9);
        sliderBar.setOrigin(0, 0);
        container.add(sliderBar);
        
        // Valor del slider
        const valueText = this.scene.add.text(x + 230, y, '50%', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        valueText.setOrigin(0, 0);
        container.add(valueText);
        
        // Hacer interactivo
        sliderBg.setInteractive();
        sliderBg.on('pointerdown', (pointer) => {
            const localX = pointer.x - sliderBg.x;
            const percentage = Math.max(0, Math.min(1, localX / 100));
            sliderBar.width = percentage * 96;
            valueText.setText(Math.round(percentage * 100) + '%');
            callback(percentage);
        });
    }
    
    createGameStats() {
        const statsContainer = this.scene.add.container(20, 200);
        
        // Título de estadísticas
        const statsTitle = this.scene.add.text(0, 0, 'ESTADÍSTICAS', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        statsTitle.setOrigin(0, 0);
        statsContainer.add(statsTitle);
        
        // Enemigos restantes
        const enemiesText = this.scene.add.text(0, 25, 'Enemigos: 6', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        enemiesText.setOrigin(0, 0);
        statsContainer.add(enemiesText);
        
        // Monedas recolectadas
        const coinsText = this.scene.add.text(0, 45, 'Monedas: 0/10', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        coinsText.setOrigin(0, 0);
        statsContainer.add(coinsText);
        
        // Tiempo de juego
        const timeText = this.scene.add.text(0, 65, 'Tiempo: 00:00', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        });
        timeText.setOrigin(0, 0);
        statsContainer.add(timeText);
        
        this.elements.enemiesText = enemiesText;
        this.elements.coinsText = coinsText;
        this.elements.timeText = timeText;
        
        console.log('✅ Estadísticas del juego creadas');
    }
    
    // Métodos de actualización
    updateHealth(health, maxHealth) {
        if (this.elements.healthBar && this.elements.healthText) {
            const percentage = health / maxHealth;
            this.elements.healthBar.width = percentage * 146; // Ajustado para barra más pequeña (150 - 4)
            this.elements.healthText.setText(`${health}/${maxHealth}`);
            
            // Cambiar color según la vida
            if (percentage > 0.6) {
                this.elements.healthBar.fillColor = this.colors.health;
            } else if (percentage > 0.3) {
                this.elements.healthBar.fillColor = 0xFFFF00; // Amarillo
            } else {
                this.elements.healthBar.fillColor = this.colors.damage;
            }
        }
    }
    
    updateLives(lives, maxLives) {
        if (this.elements.livesText && this.elements.livesIcons) {
            this.elements.livesText.setText(`Vidas: ${lives}`);
            
            // Actualizar iconos
            this.elements.livesIcons.forEach((icon, index) => {
                icon.setVisible(index < lives);
            });
        }
    }
    
    updateScore(score) {
        if (this.elements.scoreText) {
            this.elements.scoreText.setText(`Puntuación: ${score}`);
            
            // Efecto de contador
            this.scene.tweens.add({
                targets: this.elements.scoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });
        }
    }
    
    updateLevel(level) {
        if (this.elements.levelText) {
            this.elements.levelText.setText(`Nivel: ${level}`);
            console.log(`📊 UI: Nivel actualizado a ${level}`);
        } else {
            console.warn('⚠️ UI: levelText no encontrado en updateLevel');
        }
    }
    
    updatePowerUp(type, active, duration = 0) {
        const indicator = this.powerUpIndicators[type];
        if (indicator) {
            if (active) {
                // Mostrar indicador
                indicator.icon.setVisible(true);
                indicator.name.setVisible(true);
                indicator.barBg.setVisible(true);
                indicator.bar.setVisible(true);
                indicator.timeText.setVisible(true);
                indicator.active = true;
                
                // Efecto de activación
                this.scene.tweens.add({
                    targets: indicator.icon,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 200,
                    yoyo: true
                });
            } else {
                // Ocultar indicador
                indicator.icon.setVisible(false);
                indicator.name.setVisible(false);
                indicator.barBg.setVisible(false);
                indicator.bar.setVisible(false);
                indicator.timeText.setVisible(false);
                indicator.active = false;
            }
        }
    }
    
    updatePowerUpTimer(type, remainingTime, totalTime) {
        const indicator = this.powerUpIndicators[type];
        if (indicator && indicator.active) {
            const percentage = remainingTime / totalTime;
            indicator.bar.width = percentage * 76;
            indicator.timeText.setText(`${Math.ceil(remainingTime / 1000)}s`);
        }
    }
    
    updateGameStats(enemiesRemaining, coinsCollected, totalCoins, gameTime) {
        if (this.elements.enemiesText) {
            this.elements.enemiesText.setText(`Enemigos: ${enemiesRemaining}`);
        }
        
        if (this.elements.coinsText) {
            this.elements.coinsText.setText(`Monedas: ${coinsCollected}/${totalCoins}`);
        }
        
        if (this.elements.timeText) {
            const minutes = Math.floor(gameTime / 60000);
            const seconds = Math.floor((gameTime % 60000) / 1000);
            this.elements.timeText.setText(`Tiempo: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    }
    
    toggleConfig() {
        this.isConfigOpen = !this.isConfigOpen;
        if (this.configPanel) {
            this.configPanel.setVisible(this.isConfigOpen);
        }
    }
    
    // Método de actualización general
    update() {
        // Actualizar estadísticas del juego
        if (this.scene.player && this.scene.enemies) {
            const enemiesRemaining = this.scene.enemies.children.size;
            const coinsCollected = 0; // TODO: Implementar contador
            const totalCoins = 10;
            const gameTime = this.scene.gameTime || 0;
            
            this.updateGameStats(enemiesRemaining, coinsCollected, totalCoins, gameTime);
        }
    }
}

console.log('📝 UIManager.js cargado - Fase 7: UI Mejorada'); 