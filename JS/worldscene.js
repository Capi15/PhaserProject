// Variáveis globais

let teste;
let teste2;
//timers
let timer, msgTimer, spawnTree, timeToSpawn;

//variaveis de valor status
let vida, oxigenio, temperatura, moedas, geracoes, arvores;

//Variáveis de texto da Barra de estado
let vidaText,
    oxigenioText,
    temperaturaText,
    moedasText,
    geracoesText,
    arvoresText;

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
let KeyObj2;

//controlo de cliques
let keyHasBeenPressed = false;
let hasInteracted = false;
let canSpawn = false;

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
let hitPosComer, hitPosComprar, letPosVender;

class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        arvores = 0;
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

        //controlo de dinheiro
        const arvoresImage = this.add.image(390, 20, 'tree').setScale(0.6);
        arvores = 0;
        arvoresText = this.add.text(410, 10, arvores + ' arv', fonte);

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
                this.playSom();
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

                .setScale(0.03);

            newObj = treesGroup2
                .create(treeObject.x, treeObject.y - treeObject.height, 'tree')
                .setVisible(false);

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

        timeToSpawn = this.time.addEvent({
            delay: 3000, // ms
            callback: this.treeSpawn(),
            loop: true,
        });

        //adição de uma nova tecla
        KeyObj2 = this.input.keyboard.addKey('E');

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
        arvoresText.text = arvores + ' arv';

        //spawn da mensagem de aviso

        //termina o jogo
        startNewScene = (startNewScene) => {
            oxigenio = 100;
            vida = 100;
            temperatura = 20;
            arvores = 0;
            moedas = 20;

            this.scene.start('GameOver', geracoes);
            geracoes = 0;
        };

        this.condicoes();

        //executa a mensagem de aviso
        this.aviso();

        if (arvores === 10) {
            geracoes += 1;
            arvores = 0;
        }
    }

    playerHit(player, tree) {
        console.log('bateu');
    }

    //controlo da barra de status
    updateStatus() {
        vida--;
        oxigenio -= 1.5;
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

    treeSpawn() {
        let rnd = 0;

        teste = treesGroup.getChildren();
        teste2 = treesGroup2.getChildren();

        spawnTree = this.time.addEvent({
            delay: Math.floor(Math.random() * 100) + 5000, // ms
            callback: function () {
                rnd = Math.floor(Math.random() * 11);
                console.log(rnd);
                if (teste2[rnd].visible) {
                    return;
                } else {
                    console.log(teste[rnd]);
                    teste[rnd].setVisible(false);
                    teste2[rnd].setVisible(true);
                    if (oxigenio < 80) {
                        oxigenio += 20;
                    } else if (oxigenio < 80) {
                        oxigenio = 100;
                    }

                    temperatura -= 5;
                }

                canSpawn = false;
            },
            loop: true,
        });
    }

    condicoes() {
        let posX;

        if (
            this.physics.overlap(this.player, treesGroup) &&
            this.physics.overlap(this.player, treesGroup2)
        ) {
            teste = treesGroup.getChildren();
            teste2 = treesGroup2.getChildren();

            for (let i = 0; i < teste.length; i++) {
                if (this.physics.overlap(this.player, teste[i])) {
                    if (
                        !teste[i].visible &&
                        KeyObj2.isDown &&
                        keyHasBeenPressed === false
                    ) {
                        console.log('Qualquer coisa');
                        arvores += 1;
                        this.player.anims.play('cut', true);
                        teste2[i].setVisible(false);
                        teste[i].setVisible(true);
                        keyHasBeenPressed = true;
                    }
                    if (KeyObj2.isUp) {
                        keyHasBeenPressed = false;
                    }
                }
            }
        }

        if (this.physics.overlap(this.player, house_hitGroup)) {
            if (KeyObj2.isUp) {
                hasInteracted = false;
            }
            teste = house_hitGroup.getChildren();
            for (let i = 0; i < teste.length; i++) {
                if (this.physics.overlap(this.player, teste[i])) {
                    posX = teste[i].x;
                    if (posX > 10 && posX < 300) {
                        if (KeyObj2.isDown && hasInteracted == false) {
                            console.log('Pode Comer');

                            if (arvores > 0) {
                                moedas -= 10;
                                if (vida < 70) {
                                    vida += 30;
                                } else if (vida < 100) {
                                    vida = 100;
                                }
                                oxigenio -= 15;
                                arvores -= 1;
                                temperatura += 20;
                                arvores -= 1;
                                hasInteracted = true;
                            }
                        }
                    } else if (posX < 800) {
                        if (KeyObj2.isDown && hasInteracted == false) {
                            console.log('Pode Comprar');
                            if (moedas <= 0) {
                                tipoAviso = 'Você está a zeros';
                                return;
                            } else {
                                arvores += 1;
                                moedas -= 50;
                                hasInteracted = true;
                            }
                        }
                    } else if (posX > 800) {
                        if (KeyObj2.isDown && hasInteracted == false) {
                            console.log('Pode Vender');
                            if (arvores <= 0) {
                                return;
                            } else {
                                moedas += 30;
                                arvores -= 1;
                                hasInteracted = true;
                            }
                        }
                    }
                }
            }
        }
    }
}
