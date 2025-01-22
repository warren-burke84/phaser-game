import { Scene } from 'phaser';

export class CartesianGridScene extends Scene {
    private isDragging: boolean;
    private dragStartX: number;
    private dragStartY: number;
    private tileHeight: number = 32;
    private tileWidth: number = 64;
    private map: Phaser.Tilemaps.Tilemap;
    private layer: Phaser.GameObjects.Layer;
    private cellImage: Phaser.GameObjects.Image;
    private graphics: Phaser.GameObjects.Graphics;
    private imageSelected: boolean = true;

    constructor() {
        super('CartesianGridScene');
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.imageSelected = true;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('tiles', 'iso-64x64-outside.png');
        this.load.image('tiles2', 'iso-64x64-building.png');
        this.load.tilemapTiledJSON('map', 'isorpg.json');
        this.load.image('house', 'rem_0002.png');
        this.load.image('cell', 'cell.png');
    }

    create() {
        this.addMap();
        this.addMouseEvents();
        this.layer = this.add.layer();
        this.graphics = this.add.graphics();

        this.cellImage = this.add.image(0, 0, 'cell');
        this.cellImage.setAlpha(0.5);
        this.cellImage.setVisible(false);
        this.layer.add(this.cellImage);
        this.layer.add(this.graphics);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x;
            this.dragStartY = pointer.y;
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            this.isDragging = false;
            if (pointer.leftButtonReleased()) {
                const tile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY);

                if (tile && this.imageSelected) {
                    this.cellImage.setPosition(tile.pixelX + 32, tile.pixelY);
                    this.cellImage.setVisible(true);
                    this.imageSelected = false;
                    this.cellImage.setAlpha(1);
                }
            }
        });

        this.input.on('pointermove', this.handleDrag, this);
    }

    addMap(){
        this.map = this.add.tilemap('map');
        console.log(this.map);
        const tileset1 = this.map.addTilesetImage('iso-64x64-outside', 'tiles');
        const tileset2 = this.map.addTilesetImage('iso-64x64-building', 'tiles2');

        if (!tileset1 || !tileset2) {
            console.error('Tileset not found');
            return;
        }

        this.map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
    }

    addMouseEvents() {
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            const tile = this.map.getTileAtWorldXY(pointer.worldX, pointer.worldY);
            if (tile) {
                this.highlightCell(tile.pixelX + 32, tile.pixelY + 32);

                if (this.imageSelected) {
                    this.cellImage.setPosition(tile.pixelX + 32, tile.pixelY);
                    this.cellImage.setVisible(true);
                }
            }
            else {
                this.cellImage.setVisible(false);
            }
        });
    }

    highlightCell(startX: number, startY: number) {
        this.drawIsoShape(startX, startY);
    }

    drawIsoShape(startX: number, startY: number) {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 0.7);
        this.graphics.beginPath();
        this.graphics.moveTo(startX, startY);
        this.graphics.lineTo(startX + this.tileWidth/2, startY + this.tileHeight/2);
        this.graphics.lineTo(startX, startY + this.tileHeight);
        this.graphics.lineTo(startX - this.tileWidth/2, startY + this.tileHeight/2);
        this.graphics.closePath();
        this.graphics.strokePath();
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
