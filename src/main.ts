import { MainMenu } from './scenes/MainMenu';
import { GameScene } from './scenes/GameScene';
import { MovementScene } from './scenes/MovementScene';
import { CartesianGridScene } from './scenes/CartesianGridScene';
import { AUTO, Game, Scale, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        MainMenu,
        GameScene,
        MovementScene,
        CartesianGridScene
    ]
};

export default new Game(config);
