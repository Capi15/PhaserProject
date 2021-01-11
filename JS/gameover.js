class GameOver extends Phaser.Scene {
    geracoes;
    constructor() {
        super({ key: 'GameOver' });
    }

    //recebe o numero de gerações da cena anterior
    init(geracoes) {
        this.geracoes = geracoes;
    }

    //permite iniciar o jogo novamente
    iniciaJogo() {
        this.scene.start('WorldScene');
    }

    create(tempo) {
        //adição da imagem de fundo
        this.buttonVoltarAJogar = this.add
            .image(0, -60, 'background')
            .setOrigin(0, 0)
            .setScale(1.5)
            .setInteractive({ useHandCursor: true });

        //texto de fim do jogo
        let textoGeracoes = this.add.text(
            this.cameras.main.width / 2 - 300,
            this.cameras.main.height / 2 - 50,
            'Parabéns, você salvou ' + geracoes + ' gerações',
            { font: '40px Arial', fill: '#ffffff' }
        );

        //texto instrutivo
        let textoInstrucao = this.add.text(
            this.cameras.main.width / 2 - 150,
            this.cameras.main.height - 100,
            'Toque na area de jogo para jogar novamente!',
            { font: '16px Arial', fill: '#ffffff' }
        );

        //click na imagem de fundo
        this.buttonVoltarAJogar.once(
            'pointerdown',
            function (pointer) {
                this.iniciaJogo();
            },
            this
        );
    }
}
