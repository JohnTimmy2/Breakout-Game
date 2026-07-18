class ExampleScene extends Phaser.Scene {
  ball;
  paddle;
  bricks;
  scoreText;
  lives=3;
  livesText;
  lifeLostText;
  playing = false;
  ballLeft = false;
  startButton;
  score = 0;
  startGame() {
    this.startButton.destroy();
    this.ball.body.setVelocity(150, -150);
    this.playing = true;
  }

  hitBrick(ball, brick) {
    const destroyTween = this.tweens.add({
      targets: brick,
      ease: "Linear",
      repeat: 0,
    duration: 200,
    props: {
      scaleX: 0,
      scaleY: 0,
    },
    onComplete() {
      brick.destroy();
    },
  });
    this.brickHitSound.play();
  this.score += 10;
  this.scoreText.setText(`points: ${this.score}`);
}
   hitPaddle(ball, paddle) {
    this.ball.anims.play("wobble");
  }
  ballLeaveScreen() {
      if (this.ballLeft) return;
        this.ballLeft = true;
    this.lives--;
    if (this.lives > 0){
      this.livesText.setText(`lives: ${this.lives}`);
      this.lifeLostText.visible = true;
      this.ball.body.reset(this.scale.width * 0.5, this.scale.height - 25);
      this.input.once(
        "pointerdown",
        () => {
          this.lifeLostText.visible = false;
          this.ball.body.setVelocity(150, -150);
          this.ballLeft = false;
        },
        this,
      );
    } else {
      this.gameOverSound.play();
  this.time.delayedCall(2000, () => {
      location.reload();
    });
  }
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
    this.load.audio("gameOver", "assets/gameOver.mp3");
    this.load.image("ball", "assets/ball.png");
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("brick", "assets/brick.png");
      this.load.audio("brickHit", "assets/brickHit.mp3");
    this.load.spritesheet("wobble", "assets/wobble.png", {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.spritesheet("button", "assets/button.png", {  
      frameWidth: 120,
      frameHeight: 40,
    });
  }
  create() {
    this.gameOverSound = this.sound.add("gameOver");
    this.brickHitSound = this.sound.add("brickHit");
    this.startButton = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "button",
      0,
    );
   this.startButton.setInteractive();
this.startButton.on(
  "pointerover",
  () => {
    this.startButton.setFrame(1);
  },
  this,
);
this.startButton.on(
  "pointerdown",
  () => {
    this.startButton.setFrame(2);
  },
  this,
);
this.startButton.on(
  "pointerout",
  () => {
    this.startButton.setFrame(0);
  },
  this,
);
this.startButton.on(
  "pointerup",
  () => {
    this.startGame();
  },
  this,
);
    this.physics.world.checkCollision.down = false;
    this.ball = this.add.sprite(
      this.scale.width * 0.5,
      this.scale.height - 25,
      "ball"
    );
    this.ball.anims.create({
      key: "wobble",
      frameRate: 24,
      frames: this.anims.generateFrameNumbers("wobble",{
        frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
      })
    });
    this.physics.add.existing(this.ball);
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
    this.livesText = this.add.text(
      this.scale.width - 5,
      5,
      `lives: ${this.lives}`,
      {font: "18px Arial", fill: "#0095DD"},
    );
    this.livesText.setOrigin(1, 0);
    this.lifeLostText = this.add.text(
      this.scale.width * 0.5,
      this.scale.height * 0.5,
      "Life Lost, Click to Continue",
      {font: "18px Arial", fill: "#0095DD"},
    );
    this.lifeLostText.setOrigin(0.5, 0.5);
    this.lifeLostText.visible = false;

  }
  update() {
 this.physics.collide(this.ball, this.paddle, (ball, paddle) =>
      this.hitPaddle(ball, paddle),
    );
    this.physics.collide(this.ball, this.bricks, (ball, brick) =>
      this.hitBrick(ball, brick),
    );
    if (this.playing) {
    this.paddle.x = this.input.x || this.scale.width * 0.5;
    if (this.bricks.countActive() === 0) {
      alert("You Win!");
    }
    const ballOutofBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds()
    );
    if(ballOutofBounds) {
      this.ballLeaveScreen();
    }
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