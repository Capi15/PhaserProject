// Variáveis globais
let timer;
let msgTimer;
let total = 0;
let vida;
let oxigenio;
let temperatura;
let moedas;
let geracoes;
let fonte;

//Avisos
let tipoAviso = '';
let mensagemAviso;

//Variáveis de texto da Barra de estado
let vidaText;
let oxigenioText;
let temperaturaText;
let moedasText;
let geracoesText;

let startNewScene;
let audioOnOff = true;
let somFundo;
let playerAnim;
let keyObj;

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
        geracoes = 3;
        geracoesText = this.add.text(
            this.cameras.main.width - 100,
            10,
            geracoes + ' Gerações',
            fonte
        );

        let soundImage = this.add
            .image(this.cameras.main.width - 180, 20, 'soundButton')
            .setScale(0.05)
            .setInteractive({ useHandCursor: true });

        soundImage.on(
            'pointerdown',
            function (pointer) {
                playSom();
            },
            this
        );

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

        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(40, 50);
        this.physics.add.collider(this.player, world);
        this.physics.add.collider(this.player, decoration);

        //Musica de Fundo
        somFundo = this.sound.add('somFundo', { volume: 0.1 }, 1, true);
        somFundo.play();

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
            key: 'cut',
            frames: this.anims.generateFrameNumbers('player', {
                start: 21,
                end: 34,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
        });

        // Inicializar um timer
        timer = this.time.addEvent({
            delay: 500, // ms
            callback: updateStatus,
            loop: true,
        });

        //timer de aviso
        msgTimer = this.time.addEvent({
            delay: 500, // ms
            callback: aviso,
            loop: true,
        });

        mensagemAviso = this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height / 2,
            tipoAviso,
            { font: '18px Arial', fill: '#ffffff' }
        );

        keyObj = this.input.keyboard.addKey('E');
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
        mensagemAviso = tipoAviso;

        startNewScene = (startNewScene) => {
            this.scene.start('GameOver', geracoes);
        };

        aviso();

        keyObj.once('down', function (event) {
            console.log('E pressed');
            this.player.anims.play('cut', true);
        });
    }
}

function playerHit(player, tree) {
    console.log('bateu');
}

function updateStatus() {
    vida--;
    oxigenio -= 2;
    if (vida <= 0 || oxigenio <= 0 || temperatura <= -10 || temperatura >= 50) {
        startNewScene();
    }
}

function aviso() {
    if (temperatura <= 0) {
        tipoAviso.text = 'Você está com frio';
    } else if (temperatura >= 40) {
        tipoAviso.text = 'Você está com muito calor';
    } else if (oxigenio <= 20) {
        tipoAviso.text = 'Você está com pouco oxigenio';
    } else {
        tipoAviso = '';
    }
}

function playSom() {
    audioOnOff = !audioOnOff;
    console.log(audioOnOff);
    if (audioOnOff) {
        somFundo.play();
    } else {
        somFundo.stop();
    }
}
