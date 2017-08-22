var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});

var ball,
    ballSpeed = 150,
    paddle,
    brick,
    newBrick,
    brickInfo,
    scoreText,
    score = 0,
    livesText,
    lifeLostText,
    lifeIcon = "+",
    lives = 3,
    playing = false,
    startButton;

function preload() {
  handleRemoteImagesOnJSFiddle();
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.image('paddle', 'img/paddle.png');
  game.load.image('brick', 'img/brick.png');
  game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
  game.load.spritesheet('button', 'img/button.png', 120, 40);
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  paddle = game.add.sprite(game.world.width/2, game.world.height-10, 'paddle');
  paddle.anchor.set(.5, 1);
  ball = game.add.sprite(game.world.width/2, game.world.height-40, 'ball');
  ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
  ball.anchor.set(.5);

  textStyle = {font: '18px Roboto', fill: "#0095DD"};
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  livesText = game.add.text(game.world.width - 5, 5, "Lives: "+lifeIcon.repeat(lives), textStyle);
  livesText.anchor.set(1, 0);
  lifeLostText = game.add.text(game.world.width/2, game.world.height/2, 'Life lost, click to continue', textStyle);
  lifeLostText.anchor.set(.5);
  lifeLostText.visible = false;

  startButton = game.add.button(game.world.width/2, game.world.height/2, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(.5);

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false;

  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(missedBall, this);

  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  paddle.body.immovable = true;
  initBricks();
}
function update() {
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  paddle.x = game.input.x || game.world.width/2;
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10
  }

  bricks = game.add.group();
  for(c=0; c<brickInfo.count.col; c++) {
    for(r=0; r<brickInfo.count.row; r++) {
      var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
      var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(.5);
      bricks.add(newBrick);
    }
  }
}
function ballHitBrick(ball, brick) {
  ball.animations.play('wobble');

  var killTween = game.add.tween(brick.scale)
    .to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
  killTween.onComplete.addOnce(() => {
      brick.kill();
  }, this);
  killTween.start();

  score+=100;
  scoreText.setText('Score: ' + score);
  if (score === brickInfo.count.row*brickInfo.count.col*100) {
    alert("Congrats! You Won!\nScore: " + score);
    location.reload();
  }
}

function ballHitPaddle(ball, paddle) {
  ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}

function missedBall() {
  lives--;

  if(lives) {
    livesText.setText(`Lives: ${lifeIcon.repeat(lives)}`);
    lifeLostText.visible = true;
    ball.reset(game.world.width/2, game.world.height-40);
    paddle.reset(game.world.width/2, game.world.height-10);
    game.input.onDown.addOnce(() => {
      lifeLostText.visible = false;
      ball.body.velocity.set(ballSpeed, -ballSpeed);
    }, this);
  } else {
    alert("Game Over\nScore: " + score);
    location.reload();
  }
}

function startGame() {
  startButton.destroy();
  ball.body.velocity.set(ballSpeed, -ballSpeed);
  playing = true;
}

// this function (needed only on JSFiddle) take care of loading the images from the remote server
function handleRemoteImagesOnJSFiddle() {
	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
	game.load.crossOrigin = 'anonymous';
}
