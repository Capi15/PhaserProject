class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });

        const tileset1 = map.addTilesetImage('houses_tileset', 'tiles1');
        const tileset2 = map.addTilesetImage('rpg_tileset', 'tiles2');

        const world = map.createStaticLayer('world', tileset2, 0, 0);
        const decoration = map.createStaticLayer('decoration', tileset2, 0, 0);

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
