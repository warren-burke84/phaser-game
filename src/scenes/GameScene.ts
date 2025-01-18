import { Scene } from 'phaser';

export class GameScene extends Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('tiles', 'iso-64x64-outside.png');
    }

    create() {
        //this.cameras.main.setBackgroundColor('#028af8');

        const backButton = this.add.text(50, 50, 'Back', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const mapData = new Phaser.Tilemaps.MapData({
            width: 10,
            height: 10,
            tileWidth: 64,
            tileHeight: 32,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        });

        const map = new Phaser.Tilemaps.Tilemap(this, mapData);

        const tileset = map.addTilesetImage('iso-64x64-outside', 'tiles');

        const layer = map.createBlankLayer('layer', tileset, 350, 200);

        const data = [
            [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ],
            [ 13, 11, 10, 12, 12, 15, 16, 10, 16, 10 ],
            [ 12, 10, 16, 13, 14, 15, 16, 16, 13, 12 ],
            [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ],
            [ 13, 11, 10, 12, 12, 15, 16, 10, 16, 10 ],
            [ 12, 10, 16, 13, 14, 15, 16, 16, 13, 12 ],
            [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ],
            [ 13, 11, 10, 12, 12, 15, 16, 10, 16, 10 ],
            [ 12, 10, 16, 13, 14, 15, 16, 16, 13, 12 ],
            [ 10, 11, 12, 13, 14, 15, 16, 10, 11, 12 ]
        ];

        let y = 0;

        data.forEach(row => {
            row.forEach((tile, x) => {
                layer.putTileAt(tile, x, y);
            });
            y++;
        });
    }
}
