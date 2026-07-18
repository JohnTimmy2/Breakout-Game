class ExampleScene extends Phaser.Scene {
  ball;
  preload() {
    this.load.image("ball", "assets/ball.png");
  }
  create() {
    this.ball = this.add.image(50, 50, "ball");
  }
  update() {}
}

const config = {
  type: Phaser.CANVAS,
  width: 480,
  height: 320,
  backgroundColor: "#eeeeee",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: ExampleScene,
};

const game = new Phaser.Game(config);