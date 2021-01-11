class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        //backgroud do menu/gameover
        this.load.image('background', 'assets/images/background.jpg');

        //imagem dos butões
        this.load.image('jogar', 'assets/images/jogar.png');
        this.load.image('instrucoes', 'assets/images/instrucoes.png');
        this.load.image('voltar', 'assets/images/voltar.png');

        //interacões
        this.load.image('soil_icon', 'assets/images/soil_icon.png');
        this.load.image('seed_icon', 'assets/images/seed_icon.png');
        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('dead_tree', 'assets/images/dead_tree.png');
        this.load.image('house_hit', 'assets/images/house_hit.png');

        //icones de Status
        this.load.image('vida', 'assets/images/vida_icon.png');
        this.load.image('oxigenio', 'assets/images/oxygen_icon.png');
        this.load.image('moedas', 'assets/images/coin_icon.png');
        this.load.image('temperatura', 'assets/images/thermomether_icon.png');
        this.load.image('geracoes', 'assets/images/person_icon.png');

        //botão do som
        this.load.image('soundButton', 'assets/images/sound_icon.png');

        //carregar o audio
        this.load.audio('somFundo', 'assets/audio/musicaFundo.wav');

        //carregar o mapa
        this.load.image('tiles1', 'assets/tilesets/houses.png');
        this.load.image('tiles2', 'assets/tilesets/village_tileset_16.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');

        //carregar o jogador
        this.load.spritesheet('player', 'assets/images/Minotaur_sprite.png', {
            frameWidth: 96,
            frameHeight: 96,
        });

        //falsas hitboxes(casas)
        this.load.image('cozinhar_icon', 'assets/images/cozinhar_icon.png');
        this.load.image('comprar_icon', 'assets/images/comprar_icon.png');
        this.load.image('vender_icon', 'assets/images/vender_icon.png');
    }

    create() {
        // -- inicia uma nova Scene
        //this.scene.start('MenuScene');
        this.scene.start('MenuScene');
    }
}
