class Game {
  //analisar o constructor
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    
  
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
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
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

   
    fuels = new Group();
    powerCoins = new Group();

    this.addSprites(fuels, 8, fuelImage, 0.02);
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

  }



  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,40)

    this.leadeboardTitle.html("placar")
    this.leadeboardTitle.position(width/3-60,40)
    this.leadeboardTitle.class("leadersText")

    //this.leader1.html("1")
    this.leader1.position(width/3-50,80)
    this.leader1.class("resetText")

    //this.leader2.html("2")
    this.leader2.position(width/3-50,130)
    this.leader2.class("resetText")


    
   

    // exibir os placares e titulo do placar

  }

  play() {
    this.handleElements();
    Player.getPlayersInfo();
  
    this.handleResetButton();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();
    
      var index = 0;
      for (var plr in allPlayers) {
        index = index + 1;
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        //codição de indice
        if (index === player.index) {
          stroke(10);
          //cor da marcação
          fill("red");
          ellipse(x, y, 60, 60);
          fill("");
          ellipse(x, y, 60, 60);

          camera.position.y = cars[index - 1].position.y;

      
          this.handlePowerCoins(index)
          this.handleFuels(index)
        }
             

      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  
  // função para resetar o BD
    handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
     playerCount:0,
     gameState:0,
     players:{}
      });
      window.location.realod();
    
    });
  }
  

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
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
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
  
  
    if (keyIsDown(RIGHT_ARROW) &&
     player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }

  
    if (keyIsDown(LEFT_ARROW) && 
    player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }

  }


 
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale){
  
    for(var i = 0; i< numberOfSprites; i++){
      var x, y;

      x = random(width/2 + 150, width/2-150);
      y = random(-height*8, height-400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite)
    }
    
  }

  // adicionar soma de score e função remove
  handlePowerCoins(index){
    cars[index -1].overlap(powerCoins, function(
      collector, collected){
      player.score += 2
      player.update();
      collected.remove();
  

    })
    
  }

  
  handleFuels(index){
    cars[index -1].overlap(fuels,  function(collect, collected){
      player.score+= 2
      player.update();
     collected.remove();

    })

  }

}
