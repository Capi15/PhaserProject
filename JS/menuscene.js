class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        //adiciona uma imagem de fundo ao menu
        const backgroundImage = this.add
            .image(0, -60, 'background')
            .setOrigin(0, 0)
            .setScale(1.5);

        //criação do botão jogar
        this.buttonJogar = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 100,
                'jogar'
            )
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        //click no butão jogar
        this.buttonJogar.once(
            'pointerdown',
            function (pointer) {
                this.scene.start('WorldScene');
            },
            this
        );

        //adição de um botão de instruções
        this.buttonInstrucoes = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 100,
                'instrucoes'
            )
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        //click no butão de instruções
        this.buttonInstrucoes.once(
            'pointerdown',
            function (pointer) {
                this.scene.start('InstrucoesScene');
            },
            this
        );
    }
}
