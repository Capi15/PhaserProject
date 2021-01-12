// Variáveis globais

//timers
let timer, msgTimer, animTimer;

//variaveis de valor status
let vida, oxigenio, temperatura, moedas, geracoes;

//Variáveis de texto da Barra de estado
let vidaText, oxigenioText, temperaturaText, moedasText, geracoesText;

//fontes de texto
let fonte;

//Avisos
let tipoAviso;
let mensagemAviso;

// variaveis de audio
let audioOnOff = true;
let somFundo;

//variaveis de animação
let playerAnim;
let playAnimation = false;
let animTime = 60;

//variaveis para o teclado
let keyObj;

//variavel para instanciar o fim do jogo
let startNewScene;

//variaveis de colheita
let temPlatacao,
    cresceu = false;

let obj;
let newObj;

let treeObjects, house_hitObjects;
let treesGroup, treesGroup2, house_hitGroup;

let children;

class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        //carregar o mapa
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

        //Musica de Fundo
        somFundo = this.sound.add('somFundo', { volume: 0.1 }, 1, true);
        somFundo.play();

        //Imagem e click no Botão de som
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

        //Grupos
        //zona de plantação
        treesGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        treesGroup2 = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        //zona de interação com as casas
        house_hitGroup = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        //atribuição de objetos aos seus respetivos layers
        treeObjects = map.getObjectLayer('dead_trees')['objects'];

        house_hitObjects = map.getObjectLayer('house_hit')['objects'];

        //Para cada grupo:
        treeObjects.forEach((treeObject) => {
            obj = treesGroup
                .create(
                    treeObject.x,
                    treeObject.y - treeObject.height,
                    'soil_icon'
                )
                .setOrigin(0, 0)
                .setScale(0.03);

            newObj = treesGroup2
                .create(treeObject.x, treeObject.y - treeObject.height, 'tree')
                .setOrigin(-10, -10);

            obj.body.setSize(obj.width, obj.height - 5).setOffset(0, 5);
            newObj.body
                .setSize(newObj.width, newObj.height - 5)
                .setOffset(0, 5);
        });

        house_hitObjects.forEach((house_hitObject) => {
            const house_hit = house_hitGroup
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

        // inicialização do jogador
        this.player = this.physics.add.sprite(50, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(40, 50);
        this.physics.add.collider(this.player, world);
        this.physics.add.collider(this.player, decoration);

        //controlo de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        //animações
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
                start: 31,
                end: 35,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
        });

        // Inicialização dos timers
        //timer de jogo
        timer = this.time.addEvent({
            delay: 500, // ms
            callback: this.updateStatus,
            loop: true,
        });

        //timer de aviso
        msgTimer = this.time.addEvent({
            delay: 500, // ms
            callback: this.aviso,
            loop: true,
        });

        //adição de uma nova tecla
        keyObj = this.input.keyboard.addKey('E');

        let casaComer = this.physics.add
            .image(145, this.cameras.main.height - 50, 'cozinhar_icon')
            .setImmovable()
            .setScale(0.5);

        casaComer.body.setSize(320, 220);
        this.physics.add.collider(this.player, casaComer);

        let casaComprar = this.physics.add
            .image(495, this.cameras.main.height - 50, 'comprar_icon')
            .setImmovable()
            .setScale(0.5);
        casaComprar.body.setSize(320, 220);
        this.physics.add.collider(this.player, casaComprar);

        let casaVender = this.physics.add
            .image(880, this.cameras.main.height - 50, 'vender_icon')
            .setImmovable()
            .setScale(0.5);

        casaVender.body.setSize(320, 220);
        this.physics.add.collider(this.player, casaVender);

        this.physics.add.overlap(
            this.player,
            house_hitGroup,
            function () {
                console.log(house_hitGroup.children);
            },
            null,
            this
        );

        mensagemAviso = this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height / 2,
            tipoAviso,
            { font: '18px Arial', fill: '#ffffff' }
        );
    }

    update() {
        //movimentação do jogador
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
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.play('idle', true);
        }

        //atualização dos valores de satatus
        vidaText.text = vida + 'HP';
        oxigenioText.text = oxigenio + '%';
        temperaturaText.text = temperatura + 'ºC';
        moedasText.text = moedas + '€';
        geracoesText.text = geracoes + ' Gerações';

        //spawn da mensagem de aviso

        //termina o jogo
        startNewScene = (startNewScene) => {
            this.scene.start('GameOver', geracoes);
        };

        this.condicoes();

        //executa a mensagem de aviso
        this.aviso();
    }

    playerHit(player, tree) {
        console.log('bateu');
    }

    //controlo da barra de status
    updateStatus() {
        vida--;
        oxigenio -= 2;
        if (
            vida <= 0 ||
            oxigenio <= 0 ||
            temperatura <= -10 ||
            temperatura >= 50
        ) {
            startNewScene();
        }
    }

    //verificação dos avisos
    aviso() {
        if (temperatura <= 0) {
            tipoAviso = 'Você está com frio';
        } else if (temperatura >= 40) {
            tipoAviso = 'Você está com muito calor';
        } else if (oxigenio <= 20) {
            tipoAviso = 'Você está com pouco oxigenio';
        } else {
            tipoAviso = '';
        }

        //atualização do aviso
        mensagemAviso.text = tipoAviso;
    }

    //liga/desliga o som do jogo
    playSom() {
        audioOnOff = !audioOnOff;
        console.log(audioOnOff);
        if (audioOnOff) {
            somFundo.play();
        } else {
            somFundo.stop();
        }
    }

    condicoes() {
        let teste;
        let posX;
        let posY;
        if (this.physics.overlap(this.player, treesGroup)) {
            //console.log('yei');

            teste = treesGroup.getChildren();
            posX;
            posY;
            for (let i = 0; i < teste.length; i++) {
                if (this.physics.overlap(this.player, teste[i])) {
                    posX = teste[i].x;
                    posY = teste[i].y;
                    if (keyObj.isDown) {
                        this.player.anims.play('cut', true);
                        teste[i].destroy();
                    }
                }
            }
        }

        //if(this.player.posX = )
    }
}
