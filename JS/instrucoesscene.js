class InstrucoesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstrucoesScene' });
    }

    //permite voltar ao menu
    voltaMenu() {
        this.scene.start('MenuScene');
    }

    create() {
        //adição da imagem de fundo
        this.buttonVoltarAoMenu = this.add
            .image(0, -60, 'background')
            .setOrigin(0, 0)
            .setScale(1.5)
            .setInteractive({ useHandCursor: true });

        //titulo da cena
        let tituloInstrucoes = this.add.text(
            this.cameras.main.width / 2 - 100,
            50,
            'Instruções',
            { font: '40px Arial', fill: '#ffffff' }
        );

        //texto das instruções
        let textoInstrucao = this.add.text(
            250,
            150,
            [
                '* Use as setas do teclado para se movimentar.',
                '* Pressione E junto de uma arvore para a cortar.',
                '* Dirija-se a cada uma das casas para comer, vender árvores, ou comprar árvores.',
                '* Comer aumenta a sua vida em 30HP.',
                '* Vender árvores dá 30 moedas.',
                '* Comprar árvores gasta 15 moedas.',
                '* Comer gasta 10 moedas e gasta 15% de oxigenio.',
                '* Por cada 10 árvores platadas o número de gerações aumenta +1.',
                '* O jogo termina caso o seu oxigénio, ou a sua vida chegue a 0.',
            ],
            { font: '16px Arial', fill: '#ffffff' }
        );

        //adição do butão voltar
        this.buttonVoltarAoMenu = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height - 100,
                'voltar'
            )
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        //click no butão de voltar
        this.buttonVoltarAoMenu.once(
            'pointerdown',
            function (pointer) {
                this.voltaMenu();
            },
            this
        );
    }
}
