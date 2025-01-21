import { Scene } from 'phaser';

export class CartesianGridScene extends Scene {
    private mouseText: Phaser.GameObjects.Text;
    private isDragging: boolean;
    private dragStartX: number;
    private dragStartY: number;

    constructor() {
        super('CartesianGridScene');
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    preload() {
        // Load any necessary assets here
    }

    create() {
        const graphics = this.add.graphics();
        const width = this.scale.width;
        const height = this.scale.height;
        const cellSize = 50;

        graphics.lineStyle(1, 0xffffff, 1);

        // Draw vertical lines
        for (let x = 0; x <= width; x += cellSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }

        // Draw horizontal lines
        for (let y = 0; y <= height; y += cellSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }

        graphics.strokePath();

        // Label the axis with values
        for (let x = 0; x <= width; x += cellSize) {
            this.add.text(x, 0, `${x}`, { font: '12px Arial', fill: '#ffffff' }).setOrigin(0.5, 0);
        }

        for (let y = 0; y <= height; y += cellSize) {
            this.add.text(0, y, `${y}`, { font: '12px Arial', fill: '#ffffff' }).setOrigin(0, 0.5);
        }

        // Display mouse position
        this.mouseText = this.add.text(10, 10, '', { font: '16px Arial', fill: '#ffffff' });
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.mouseText.setText(`X: ${pointer.x}, Y: ${pointer.y}`);
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
