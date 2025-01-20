import { Scene } from 'phaser';

export class GameScene extends Scene {
    private isDragging: boolean;
    private dragStartX: number;
    private dragStartY: number;
    private graphics: Phaser.GameObjects.Graphics;
    private coordinatesText: Phaser.GameObjects.Text;
    private tileHeight: number = 32;
    private tileWidth: number = 64;

    constructor() {
        super('GameScene');
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('tiles', 'iso-64x64-outside.png');
        this.load.image('tiles2', 'iso-64x64-building.png');
        this.load.tilemapTiledJSON('map', 'isorpg.json');
        this.load.image('house', 'rem_0002.png');
    }

    create ()
    {
        const backButton = this.add.text(50, 50, 'Back', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive();

        backButton.setScrollFactor(0);

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        const map = this.add.tilemap('map');
        console.log(map);
        const tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
        const tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

        if (!tileset1 || !tileset2) {
            console.error('Tileset not found');
            return;
        }

        map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);

        this.graphics = this.add.graphics();
        this.coordinatesText = this.add.text(this.scale.width / 2, 20, '', {
            fontFamily: 'Arial', fontSize: 16, color: '#ffffff'
        }).setOrigin(0.5).setDepth(100);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x;
            this.dragStartY = pointer.y;
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.handleDrag(pointer);
            this.highlightCell(pointer);
        });
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

    highlightCell(pointer: Phaser.Input.Pointer) {
        const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;

        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);

        const startX = 32;
        const startY = 32;
        this.drawIsoShape(startX, startY);
        this.drawIsoShape(startX + this.tileWidth/2, startY + this.tileHeight/2);
        this.drawIsoShape(startX - this.tileWidth/2, startY + this.tileHeight/2);
        this.drawIsoShape(startX, startY + this.tileHeight);

        this.coordinatesText.setText(`World: (${worldPoint.x}, ${worldPoint.y})`);
    }

    drawIsoShape(startX: number, startY: number) {

        this.graphics.beginPath();
        this.graphics.moveTo(startX, startY);
        this.graphics.lineTo(startX + this.tileWidth/2, startY + this.tileHeight/2);
        this.graphics.lineTo(startX, startY + this.tileHeight);
        this.graphics.lineTo(startX - this.tileWidth/2, startY + this.tileHeight/2);
        this.graphics.closePath();
        this.graphics.strokePath();
    }
}
