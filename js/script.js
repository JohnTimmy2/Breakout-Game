class ExampleScene extends Phaser.Scene {
  ball;
  paddle;
  bricks;
  scoreText;
  score = 0;
  hitBrick(ball, brick) { 
    brick.destroy();
    this.score += 10;
    this.scoreText.setText(`points: ${this.score}`);
  }
 initBricks() {
    const bricksLayout = {
      width: 50,
      height: 20,
      count: {
        row: 3,
        col: 7,
      },
      offset: {
        top: 50,
        left: 60,
      },
      padding: 10,
    };
    this.bricks = this.add.group();
    for (let c = 0; c < bricksLayout.count.col; c++) {
      for (let r = 0; r < bricksLayout.count.row; r++){
        const brickX = c * (bricksLayout.width + bricksLayout.padding) + bricksLayout.offset.left;
        const brickY = r * (bricksLayout.height + bricksLayout.padding) + bricksLayout.offset.top;

        const newBrick = this.add.sprite(brickX, brickY, "brick");
        this.physics.add.existing(newBrick);
        newBrick.body.setImmovable(true);
        this.bricks.add(newBrick);
      }
    }
  }
  preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("brick", "assets/brick.png");
  }
  create() {
    this.physics.world.checkCollision.down = false;
    this.ball = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height - 25,
      "ball"
    );
    this.physics.add.existing(this.ball);
    this.ball.body.setVelocity(150,- 150);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1);
    this.paddle = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height - 5,
      "paddle"
    );
    this.paddle.setOrigin(0.5, 1);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.paddle.body.setCollideWorldBounds(true, 1, 1);
    this.physics.add.existing(this.paddle);
    this.initBricks();
    this.scoreText = this.add.text(5, 5, "points: 0", {
      font: "18px Arial",
      color: "#0095DD",
    });
  }
  update() {
    this.physics.collide(this.ball, this.paddle);
    this.physics.collide(this.ball, this.bricks, (ball, brick) => {
      this.hitBrick(ball,brick);
    });
    this.paddle.x = this.input.x || this.scale.width * 0.5;
    const ballOutofBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds()
    );
    if(ballOutofBounds) {
      alert("Game Over");
      location.reload();
    }
  }
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
  physics: {
    default: "arcade",
  },
  scene: ExampleScene,
};

const game = new Phaser.Game(config);