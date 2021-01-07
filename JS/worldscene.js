// Variáveis globais
let timer;
let total = 0;
let vida;
let oxigenio;
let temperatura;
let moedas;
let geracoes;
let fonte;

//Variáveis de texto da Barra de estado
let vidaText;
let oxigenioText;
let temperaturaText;
let moedasText;
let geracoesText;

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

        //controlo de Vida
        const vidaImage = this.add.image(20, 20, 'vida').setScale(0.02);
        fonte = { font: '16px Arial', fill: '#ffffff' };
        vida = 100;
        vidaText = this.add.text(40, 10, vida + 'HP', fonte);

        //controlo de Oxigénio
        const oxigenioImage = this.add
            .image(120, 20, 'oxigenio')
            .setScale(0.05);
        oxigenio = 100;
        oxigenioText = this.add.text(140, 10, oxigenio + '%', fonte);

        //controlo de Temperatura
        const tempImage = this.add
            .image(200, 20, 'temperatura')
            .setScale(0.035);
        temperatura = 10;
        temperaturaText = this.add.text(220, 10, temperatura + 'ºC', fonte);

        //controlo de dinheiro
        const moedasImage = this.add.image(290, 20, 'moedas').setScale(0.015);
        moedas = 20;
        moedasText = this.add.text(320, 10, moedas + '€', fonte);

        //controlo de gerações
        const geracoesImage = this.add
            .image(this.cameras.main.width - 130, 20, 'geracoes')
            .setScale(0.15);
        geracoes = 0;
        geracoesText = this.add.text(
            this.cameras.main.width - 100,
            10,
            geracoes + ' Gerações',
            fonte
        );

        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(40, 50);
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
        this.width;

        const house_hitObjects = map.getObjectLayer('house_hit')['objects'];

        treeObjects.forEach((treeObject) => {
            const tree = this.treesGroup
                .create(treeObject.x, treeObject.y - treeObject.height, 'tree')
                .setOrigin(0, 0);
            tree.body.setSize(tree.width, tree.height - 5).setOffset(0, 5);
            this.physics.add.collider(
                this.player,
                this.treesGroup,
                playerHit,
                null,
                this
            );
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
            this.physics.add.collider(
                this.player,
                this.house_hitGroup,
                playerHit,
                null,
                this
            );
        });

        // Inicializar um timer
        timer = this.time.addEvent({
            delay: 500, // ms
            callback: updateStatus,
            loop: true,
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

        vidaText.text = vida + 'HP';
        oxigenioText.text = oxigenio + '%';
        temperaturaText.text = temperatura + 'ºC';
        moedasText.text = moedas + '€';
        geracoesText.text = geracoes + ' Gerações';

        updateStatusBar();
    }
}

function playerHit(player, tree) {
    console.log('bateu');
}

function updateStatus() {
    vida--;
    oxigenio -= 2;
    if (vida == 0) {
        this.game.state.restart();
    }
}

function updateStatusBar() {}
