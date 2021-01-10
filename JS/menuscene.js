class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const backgroundImage = this.add
            .image(0, -60, 'background')
            .setOrigin(0, 0)
            .setScale(1.5);
        this.buttonJogar = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 100,
                'jogar'
            )
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });

        // -- click no button
        this.buttonJogar.once(
            'pointerdown',
            function (pointer) {
                this.scene.start('WorldScene');
            },
            this
        );

        this.buttonInstrucoes = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 100,
                'instrucoes'
            )
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });

        // -- click no button
        this.buttonInstrucoes.once(
            'pointerdown',
            function (pointer) {
                this.scene.start('InstrucoesScene');
            },
            this
        );
    }
}
