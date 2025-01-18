import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.setPath('assets');
        
        this.load.image('logo', 'logo.png');
    }

    create() {
        const logo = this.add.image(this.scale.width / 2, this.scale.height / 2 - 100, 'logo').setDepth(100).setOrigin(0.5, 0.5);

        const startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            const { width, height } = gameSize;
            logo.setPosition(width / 2, height / 2 - 100);
            startButton.setPosition(width / 2, height / 2 + 100);
        });
    }
}
