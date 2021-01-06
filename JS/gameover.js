class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init() {
        alert('Perdeu');

        // -- chamada da função que irá iniciar um outro estado do jogo
        this.iniciaJogo();
    }

    iniciaJogo() {
        // -- inicia uma nova Scene
        this.scene.start('WorldScene');
    }
}
