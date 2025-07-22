import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, PreloadScene, GameScene]
};

let game;

window.addEventListener('DOMContentLoaded', () => {
    game = new Phaser.Game(config);
    window.game = game;

    // Botón de reinicio
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const scene = game.scene.getScene('GameScene');
            if (scene) {
                // Detén y destruye la música de fondo si existe
                const bgm = scene.sound && scene.sound.get && scene.sound.get('bgm');
                if (bgm) {
                    bgm.stop();
                    bgm.destroy();
                }
                scene.scene.restart();
            }
        });
    }
});

// Función global para actualizar el HUD externo
window.updateInfotronHUD = function(collected, total) {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.innerHTML = `Infotrons recolectados: <b>${collected}</b> &nbsp; | &nbsp; Infotrons restantes: <b>${total - collected}</b>`;
    }
};
