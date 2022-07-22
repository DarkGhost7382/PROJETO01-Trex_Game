var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, cloudImage, cloud;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var jumpSound, checkPointSound, dieSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png"); 
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
} 

function setup() {
createCanvas(windowWidth, windowHeight);

trex = createSprite(50,windowHeight -90,20,50);
trex.addAnimation("running", trex_running);
trex.addAnimation("collided", trex_collided);
trex.scale = 0.4;

ground = createSprite(windowWidth/2,windowHeight,1200,10);
ground.addImage("ground", groundImage);
ground.velocityX = -6;
invisibleGround = createSprite(300,windowHeight +17,600,40);
invisibleGround.visible = false;

gameOver = createSprite(windowWidth/2,windowHeight/2-20,400,20);
gameOver.addImage(gameOverImg); 
restart = createSprite(windowWidth/2,windowHeight/2+20); 
restart.addImage(restartImg);

trex.debug = false;
trex.setCollider("circle",0,0,40);

score = 0; 

obstaclesGroup = createGroup(); 
cloudsGroup = createGroup();
}

function draw() {
background("white");

text ("Score: "+score, 20, 30);

if (gameState===PLAY){
  gameOver.visible = false 
  restart.visible = false
  ground.velocityX = -(7 + score/300) 
  score = score + Math.round(getFrameRate()/60);
  if(score > 0 && score%1500 === 0){
    checkPointSound.play();
  }
  spawnClouds();
  spawnObstacles();
  if (ground.x < 0) {
    ground.x = ground.width /2;
  }
  if (touches.length>0 || keyDown("space")&& trex.y >= 130) {
    trex.velocityY = -10;
    console.log (trex.y);
    jumpSound.play();
    touches = [];
  }
  trex.velocityY = trex.velocityY + 0.8
  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  }
} else if (gameState===END){
  ground.velocityX = 0
  trex.velocityX = 0

  gameOver.visible = true; 
  restart.visible = true;

  trex.changeAnimation("collided", trex_collided);

  obstaclesGroup.setLifetimeEach(-1); 
  cloudsGroup.setLifetimeEach(-1);

  obstaclesGroup.setVelocityXEach(0); 
  cloudsGroup.setVelocityXEach(0);
  if(mousePressedOver(restart)){
    reset();
  }
}

trex.collide(invisibleGround);


drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;

  trex.changeAnimation("running", trex_running);
}

function spawnClouds (){
  if (frameCount%60===0){
  cloud = createSprite (windowWidth,100,40,10);
  cloud.y = Math.round(random(100, 220));
  cloud.velocityX = -3;
  cloud.addImage (cloudImage);
  cloud.scale = 0.1;
  cloud.lifetime = 300
  cloud.depth = trex.depth;
  trex.depth = trex.depth = +1;
}
}

function spawnObstacles (){
  if (frameCount%60===0){
  var obstacle = createSprite (windowWidth,windowHeight-20,10,40);
  obstacle.velocityX = -(7 + score/300);
  var rand = Math.round(random(1,6));
  switch (rand){
    case 1: obstacle.addImage(obstacle1);
    break;
    case 2: obstacle.addImage(obstacle2);
    break;
    case 3: obstacle.addImage(obstacle3);
    break;
    case 4: obstacle.addImage(obstacle4);
    break;
    case 5: obstacle.addImage(obstacle5);
    break;
    case 6: obstacle.addImage(obstacle6);
    break;
    default: break;
  }
  obstacle.scale = 0.6;
  obstacle.lifetime = 500;

  obstaclesGroup.add(obstacle);
  cloudsGroup.add(cloud);
}
}