import { Scene } from 'phaser';

export class GameScene extends Scene {
    private isDragging: boolean;
    private dragStartX: number;
    private dragStartY: number;

    constructor() {
        super('GameScene');
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('tiles', 'iso-64x64-outside.png');
        this.load.json('tilemap', 'tilemap.json');
    }

    create() {
        const backButton = this.add.text(50, 50, 'Back', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        backButton.setScrollFactor(0);

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const mapData = new Phaser.Tilemaps.MapData({
            width: 10,
            height: 25,
            tileWidth: 64,
            tileHeight: 32,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        });

        const map = new Phaser.Tilemaps.Tilemap(this, mapData);

        const tileset = map.addTilesetImage('iso-64x64-outside', 'tiles');

        const layer = map.createBlankLayer('layer', tileset, 350, 200);

        const data = this.cache.json.get('tilemap').data;

        let y = 0;

        data.forEach(row => {
            row.forEach((tile, x) => {
                layer.putTileAt(tile, x, y);
            });
            y++;
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x;
            this.dragStartY = pointer.y;
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.input.on('pointermove', this.handleDrag, this);
    }

    handleDrag(pointer: Phaser.Input.Pointer) {
        if (this.isDragging) {
            const dragX = pointer.x - this.dragStartX;
            const dragY = pointer.y - this.dragStartY;

            this.cameras.main.scrollX -= dragX;
            this.cameras.main.scrollY -= dragY;

            this.dragStartX = pointer.x;
            this.dragStartY = pointer.y;
        }
    }
}
