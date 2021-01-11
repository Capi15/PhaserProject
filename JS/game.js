//configurações de jogo
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1050,
    heigth: 560,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: [BootScene, MenuScene, InstrucoesScene, WorldScene, GameOver],
};

//exportação das configurações de jogo
let game = new Phaser.Game(config);
