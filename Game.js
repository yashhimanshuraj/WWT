class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive=false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.5;
    car1.addImage("oop",oops)
    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.addImage("oop", oops);
    car2.scale = 0.5;

    cars = [car1, car2];
     
     
     
     
    fuels = new Group();
    powerCoins = new Group();
    powerCoins1=new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 750, y: height - 800, image: Enemy2Img},
      { x: width / 2 - 150, y: height - 1300, image: Enemy1Img},
      { x: width / 2 + 450, y: height - 1800, image: Enemy1Img  },
      { x: width / 2 - 100, y: height - 2300, image: Enemy2Img },
      { x: width / 2, y: height - 2800, image: Enemy2Img },
      { x: width / 2 - 180, y: height - 3300, image: Enemy1Img  },
      { x: width / 2 + 180, y: height - 3300, image: Enemy2Img },
      { x: width / 2 + 350, y: height - 3800, image: Enemy2Img },
      { x: width / 2 - 150, y: height - 4300, image: Enemy1Img  },
      { x: width / 2 + 350, y: height - 4800, image: Enemy2Img },
      { x: width / 2, y: height - 5300, image: Enemy1Img  },
      { x: width / 2 - 180, y: height - 5500, image: Enemy2Img },
      // { x: width / 2 + 520, y: height - 800, image: Enemy2Img},
      // { x: width / 2 - 600, y: height - 1300, image: Enemy1Img },
      // { x: width / 2 + 700, y: height - 1800, image: Enemy1Img  },
      // { x: width / 2 - 800, y: height - 2300, image: Enemy2Img },
      // { x: width / 2, y: height - 2800, image: Enemy2Img },
      // { x: width / 2 - 520, y: height - 3300, image: Enemy1Img  },
      // { x: width / 2 + 600, y: height - 3300, image: Enemy2Img },
      // { x: width / 2 + 700, y: height - 3800, image: Enemy2Img },
      // { x: width / 2 - 800, y: height - 4300, image: Enemy2Img },
      // { x: width / 2, y: height - 5300, image: Enemy1Img  },
      // { x: width / 2 - 600, y: height - 5500, image: Enemy2Img }
    ];

    // Adding fuel sprite in the game
    this.addSprites(fuels, 4, fuelImage, 0.1);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    this.addSprites(powerCoins1, 18, powerCoinImage1, 0.09);
    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle1Image,
      0.5,
      obstaclesPositions
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    
    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      //image(track, 0, -height * 5, width, height * 6);
      //Homework to change the image take help from speed racer track image
      image(track,0, -height * 5, width, height*6);

      this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          // stroke(10);
          // fill("red");
          // ellipse(x, y, 100, 100);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handlePowerCoins1(index);
          this.handleObstacleCollision(index);
          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // if (this.playerMoving) {
      //   player.positionY += 5;
      //   player.update();
      // }

      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finshLine = height * 30 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
 
      drawSprites();
    }
  }
  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }
handleObstacleCollision(index)
{
  if(cars[index-1].collide(obstacles))
  {
    if(this.leftKeyActive)
    {
      player.positionX+=100;
    }
    else{
      player.positionX-=100;
    }
    
  //  op.addImage("oops",oops)
  // op.visible=true
    if(player.life>0)
    {
      player.life -=185/4;
     
    }
   
    player.update()
    
  }
}

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      this.playerMoving=true
      player.positionY += 10;
      player.update();
    }
// if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) 
    if (keyIsDown(LEFT_ARROW)) {
      this.leftKeyActive=true;
      player.positionX -= 5;
      player.update();
    }

    //if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300)
    if (keyIsDown(RIGHT_ARROW))
     {
      this.leftKeyActive=false
      player.positionX += 5;
      player.update();
     }
  }
  handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });

    // Reducing Player car fuel
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }
  handlePowerCoins1(index) {
    cars[index - 1].overlap(powerCoins1, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
}
