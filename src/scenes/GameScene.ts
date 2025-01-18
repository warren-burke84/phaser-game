import { Scene } from 'phaser';

export class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#028af8');

        const backButton = this.add.text(50, 50, 'Back', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
