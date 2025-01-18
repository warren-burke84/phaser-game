import { Scene } from 'phaser';

export class BlankScene extends Scene {
    constructor() {
        super('BlankScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#028af8');
    }
}
