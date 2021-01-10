class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        //backgroud do menu
        this.load.image('background', 'assets/images/background.jpg');

        //imagem dos butões
        this.load.image('jogar', 'assets/images/jogar.png');
        this.load.image('instrucoes', 'assets/images/instrucoes.png');

        this.load.image('tree', 'assets/images/tree.png');
        this.load.image('dead_tree', 'assets/images/tree.png');
        this.load.image('house_hit', 'assets/images/house_hit.png');

        //icones de Status
        this.load.image('vida', 'assets/images/vida_icon.png');
        this.load.image('oxigenio', 'assets/images/oxygen_icon.png');
        this.load.image('moedas', 'assets/images/coin_icon.png');
        this.load.image('temperatura', 'assets/images/thermomether_icon.png');
        this.load.image('geracoes', 'assets/images/person_icon.png');
        this.load.image('soundButton', 'assets/images/sound_icon.png');

        this.load.image('tiles1', 'assets/tilesets/houses.png');
        this.load.image('tiles2', 'assets/tilesets/village_tileset_16.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');

        this.load.audio('somFundo', 'assets/audio/musicaFundo.wav');

        //deve ser carregado com o seu Json
        this.load.spritesheet('player', 'assets/images/Minotaur_sprite.png', {
            frameWidth: 96,
            frameHeight: 96,
        });
    }

    create() {
        // -- inicia uma nova Scene
        //this.scene.start('MenuScene');
        this.scene.start('MenuScene');
    }
}
