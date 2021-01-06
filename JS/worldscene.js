class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        const tileset1 = map.addTilesetImage('houses_tileset', 'tiles1');
        const tileset2 = map.addTilesetImage('rpg_tileset', 'tiles2');

        const world = map.createStaticLayer('world', tileset2, 0, 0);
        const decoration = map.createStaticLayer('decoration', tileset1, 0, 0);

        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, world);
        this.physics.add.collider(this.player, decoration);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 10,
                end: 17,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
        });

        this.treesGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        this.house_hitGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        const treeObjects = map.getObjectLayer('dead_trees')['objects'];

        const house_hitObjects = map.getObjectLayer('house_hit')['objects'];

        treeObjects.forEach((treeObject) => {
            const tree = this.treesGroup
                .create(treeObject.x, treeObject.y - treeObject.height, 'tree')
                .setOrigin(0, 0);
            tree.body.setSize(tree.width, tree.height - 5).setOffset(0, 5);
        });

        house_hitObjects.forEach((house_hitObject) => {
            const house_hit = this.house_hitGroup
                .create(
                    house_hitObject.x - 30,
                    house_hitObject.y - house_hitObject.height - 30,
                    'house_hit'
                )
                .setOrigin(0, 0);
            house_hit.body
                .setSize(house_hit.width, house_hit.height)
                .setOffset(0, 0);
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('walk', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);

            this.player.anims.play('walk', true);
            this.player.setFlipX(false);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            this.player.anims.play('walk', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
            this.player.anims.play('walk', true);
        } else {
            // Se nenhuma tecla for pressionada o jogador mantem-se parado
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            // A animação de 'Idle' apenas é mostrada se o jogador estivar em cima de uma plataforma
            // senão iria parecer estar parado enquanto saltava

            this.player.play('idle', true);
        }
    }
}
