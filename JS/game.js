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
    scene: [BootScene, MenuScene, WorldScene, GameOver],
};

let game = new Phaser.Game(config);
