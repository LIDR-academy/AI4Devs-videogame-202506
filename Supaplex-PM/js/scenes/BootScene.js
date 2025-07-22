export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Aquí podrías cargar una barra de progreso o logo
    }

    create() {
        this.scene.start('PreloadScene');
    }
}
