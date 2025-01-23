type Direction = {
    offset: number;
    x: number;
    y: number;
    opposite: string;
}

type Animation = {
    startFrame: number;
    endFrame: number;
    speed: number;
}

const directions: { [key: string]: Direction } = {
    west: { offset: 0, x: -2, y: 0, opposite: 'east' },
    northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
    north: { offset: 64, x: 0, y: -2, opposite: 'south' },
    northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
    east: { offset: 128, x: 2, y: 0, opposite: 'west' },
    southEast: { offset: 160, x: 2, y: 1, opposite: 'east' },
    south: { offset: 192, x: 0, y: 2, opposite: 'north' },
    southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

const anims: { [key: string]: Animation } = {
    idle: {
        startFrame: 0,
        endFrame: 4,
        speed: 0.2
    },
    walk: {
        startFrame: 4,
        endFrame: 12,
        speed: 0.15
    },
    attack: {
        startFrame: 12,
        endFrame: 20,
        speed: 0.11
    },
    die: {
        startFrame: 20,
        endFrame: 28,
        speed: 0.2
    },
    shoot: {
        startFrame: 28,
        endFrame: 32,
        speed: 0.1
    }
};


var skeletons: Skeleton[] = [];
var d = 0;

class Skeleton extends Phaser.GameObjects.Image {
    startX: number;
    startY: number;
    distance: number;
    motion: String;
    anim: any;
    direction: any;
    speed: number;
    f: number;

    constructor(scene: Scene, x: number, y: number, motion: string, direction: any, distance: number) {
        super(scene, x, y, 'skeleton', direction.offset);

        this.startX = x;
        this.startY = y;
        this.distance = distance;

        this.motion = motion;
        this.anim = anims[motion];
        this.direction = directions[direction];
        this.speed = 0.15;
        this.f = this.anim.startFrame;

        this.depth = y + 64;

        scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    changeFrame ()
    {
        this.f++;

        var delay = this.anim.speed;

        if (this.f === this.anim.endFrame)
        {
            switch (this.motion)
            {
                case 'walk':
                    this.f = this.anim.startFrame;
                    this.frame = this.texture.get(this.direction.offset + this.f);
                    this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
                    break;

                case 'attack':
                    delay = Math.random() * 2;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'idle':
                    delay = 0.5 + Math.random();
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;

                case 'die':
                    delay = 6 + Math.random() * 6;
                    this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
                    break;
            }
        }
        else
        {
            this.frame = this.texture.get(this.direction.offset + this.f);
            this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
        }
    }

    resetAnimation ()
    {
        this.f = this.anim.startFrame;

        this.frame = this.texture.get(this.direction.offset + this.f);

        this.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    }

    update ()
    {
        if (this.motion === 'walk')
        {
            this.x += this.direction.x * this.speed;

            if (this.direction.y !== 0)
            {
                this.y += this.direction.y * this.speed;
                this.depth = this.y + 64;
            }

            //  Walked far enough?
            if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance)
            {
                this.direction = directions[this.direction.opposite];
                this.f = this.anim.startFrame;
                this.frame = this.texture.get(this.direction.offset + this.f);
                this.startX = this.x;
                this.startY = this.y;
            }
        }
    }
}

import { Scene } from 'phaser';

export class MovementScene extends Scene
{
    constructor () {
        super('MovementScene');
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.json('map', 'isometric-grass-and-water.json');
        this.load.spritesheet('tiles', 'isometric-grass-and-water.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton', 'skeleton8.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('house', 'rem_0002.png');
    }

    create ()
    {
        this.buildMap();
        this.placeHouses();

        //skeletons.push(this.add.existing(new Skeleton(this, 240, 290, 'walk', 'southEast', 50)));
        skeletons.push(this.add.existing(new Skeleton(this, 100, 380, 'walk', 'southEast', 200)));
        // skeletons.push(this.add.existing(new Skeleton(this, 620, 140, 'walk', 'south', 380)));
        // skeletons.push(this.add.existing(new Skeleton(this, 460, 180, 'idle', 'south', 0)));
        // skeletons.push(this.add.existing(new Skeleton(this, 760, 100, 'attack', 'southEast', 0)));
        // skeletons.push(this.add.existing(new Skeleton(this, 800, 140, 'attack', 'northWest', 0)));
        // skeletons.push(this.add.existing(new Skeleton(this, 750, 480, 'walk', 'east', 200)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1030, 300, 'die', 'west', 0)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1180, 340, 'attack', 'northEast', 0)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1180, 180, 'walk', 'southEast', 160)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1450, 320, 'walk', 'southWest', 320)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1500, 340, 'walk', 'southWest', 340)));
        // skeletons.push(this.add.existing(new Skeleton(this, 1550, 360, 'walk', 'southWest', 330)));

        //this.cameras.main.setSize(1600, 600);
        //this.cameras.main.scrollX = 800;
    }

    update ()
    {
        skeletons.forEach(function (skeleton) {
            skeleton.update();
        });
        return;

        if (d)
        {
            this.cameras.main.scrollX -= 0.5;

            if (this.cameras.main.scrollX <= 0)
            {
                d = 0;
            }
        }
        else
        {
            this.cameras.main.scrollX += 0.5;

            if (this.cameras.main.scrollX >= 800)
            {
                d = 1;
            }
        }
    }

    buildMap ()
    {
        //  Parse the data out of the map
        const data = this.cache.json.get('map');

        const tilewidth = data.tilewidth;
        const tileheight = data.tileheight;

        const tileWidthHalf = tilewidth / 2;
        const tileHeightHalf = tileheight / 2;

        const layer = data.layers[0].data;

        const mapwidth = data.layers[0].width;
        const mapheight = data.layers[0].height;

        const centerX = mapwidth * tileWidthHalf;
        const centerY = 16;

        let i = 0;

        for (let y = 0; y < mapheight; y++)
        {
            for (let x = 0; x < mapwidth; x++)
            {
                const id = layer[i] - 1;

                const tx = (x - y) * tileWidthHalf;
                const ty = (x + y) * tileHeightHalf;

                const tile = this.add.image(centerX + tx, centerY + ty, 'tiles', id);

                tile.depth = centerY + ty;

                i++;
            }
        }
    }

    placeHouses ()
    {
        const house_1 = this.add.image(240, 370, 'house');
        house_1.depth = house_1.y + 86;

        const house_2 = this.add.image(1300, 290, 'house');
        house_2.depth = house_2.y + 86;
    }
}
