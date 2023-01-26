var Tank1,Tank1Img;
var Tank1_r, Tank1_rImg = loadImage("./assets/tank1_R.png");
Tank1_lImg = loadImage("./assets/tank1_L.png");
Tank1_bImg = loadImage("./assets/tank1_B.png"); Tank1_rImg;
var Tank1_l,Tank1_lImg;
var Tank1_b,Tank1_bImg
var Battfeild
var Tank2,Tank2Img;
var Bullet,BulletImg;
var Bang,BangImg;
var Boom,BoomImg;
var database,gamestate,firebase;
var canvas;
var sum,sumImg;
var Boom,BoomImg;
var Boom2,Boom2Img;


function preload() 
{
  Tank1Img = loadImage("./assets/tank1.png");
  Tank1_rImg = loadImage("./assets/tank1_R.png");
  Tank1_lImg = loadImage("./assets/tank1_L.png");
  Tank1_bImg = loadImage("./assets/tank1_B.png"); 
  Battlefeild = loadImage("./assets/bg.jpg");
  BulletImg = loadImage("./assets/Bomb.png");
  BangImg = loadImage("./assets/Bomb.png");
  sumImg = loadImage("./assets/Semi.png");
  BoomImg = loadImage("./assets/Blast.png");
  Boom2Img = loadImage("./assets/Blast2.png");
  Tank1_rImg = loadImage("./assets/tank1_R.png");
  Tank1_lImg = loadImage("./assets/tank1_L.png");
  Tank1_bImg = loadImage("./assets/tank1_B.png"); 
}

function setup() 
{
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start()
}


function draw() 
{

  background(Battlefeild);


  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  drawSprites();
}




