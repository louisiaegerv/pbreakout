var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});

var ball,
    paddle,
    brick,
    newBrick,
    brickInfo;

function preload() {
  handleRemoteImagesOnJSFiddle();
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
  game.load.image('paddle', 'img/paddle.png');
  game.load.image('brick', 'img/brick.png');
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  paddle = game.add.sprite(game.world.width/2, game.world.height-10, 'paddle');
  paddle.anchor.set(.5, 1);
  ball = game.add.sprite(game.world.width/2, game.world.height-40, 'ball');
  ball.anchor.set(.5);

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false;

  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function() {
    alert("Game Over");
    location.reload();
  }, this);

  ball.body.collideWorldBounds = true;
  ball.body.velocity.set(150,-150);
  ball.body.bounce.set(1);
  paddle.body.immovable = true;
  initBricks();
}
function update() {
  game.physics.arcade.collide(ball, paddle);
  paddle.x = game.input.x || game.world.width/2;
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 5,
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

// this function (needed only on JSFiddle) take care of loading the images from the remote server
function handleRemoteImagesOnJSFiddle() {
	game.load.baseURL = 'https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/';
	game.load.crossOrigin = 'anonymous';
}
