import { Scene } from 'phaser';

export class GameScene extends Scene {
    private isDragging: boolean;
    private dragStartX: number;
    private dragStartY: number;
    private house: Phaser.GameObjects.Image;
    private housePlaced: boolean;

    constructor() {
        super('GameScene');
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.housePlaced = false;
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

        const layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
        //map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
        //map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
        //map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
        //map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);


        this.house = this.add.image(0, 0, 'house').setAlpha(0.5);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown() && !this.housePlaced) {
                this.house.setPosition(pointer.worldX, pointer.worldY);
                this.house.setAlpha(1);
                this.housePlaced = true;
            } else {
                this.isDragging = true;
                this.dragStartX = pointer.x;
                this.dragStartY = pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                const dragX = pointer.x - this.dragStartX;
                const dragY = pointer.y - this.dragStartY;

                this.cameras.main.scrollX -= dragX;
                this.cameras.main.scrollY -= dragY;

                this.dragStartX = pointer.x;
                this.dragStartY = pointer.y;
            } else if (!this.housePlaced) {
                const tileX = Math.floor(pointer.worldX / 64) * 64;
                const tileY = Math.floor(pointer.worldY / 64) * 64;
                this.house.setPosition(tileX, tileY);
            }
        });

        // Center the map on the screen
        this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
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
