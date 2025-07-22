export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Ejemplo: this.load.image('player', 'assets/images/player.png');
        // Aquí cargarás todos los recursos del juego
        this.load.setBaseURL('./');
        this.load.audio('explosion', [
            'assets/audio/explosion.mp3'
        ]);
        this.load.audio('bgm', [
            'assets/audio/supaplex_theme.mp3'
        ]);
        this.load.audio('collect', [
            'assets/audio/collect.mp3'
        ]);
    }

    create() {
        this.scene.start('GameScene');
    }
}
