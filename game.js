var buttons = []
var pauseButtons = []
var menuButtons = []
var gameButtons = []
var deadButtons = []
var shopButtons = []
//stores the current game mode the player starts on, that being the menu
var gameMode = 'menu'
var towers = [];
var towersRange = [];
var enemys = [];
var projectiles = [];
var manualProjectiles = []
var shopButtons = []
//the time since the tower has last shot 
var lastFired = 0
//how long can it be until the tower can shoot again
var cooldown = 1000
//the time since the player has last shot
var manualFire = 0
//how long can it be until the player can shoot again
var manualCooldown = 1300
//the time it has been since an enemy has been created
var lastSpawned = 0
//how long it can be until another enemy can be created
var spawnCooldown = 1000
// stores the default amount of money player has when beginning the game
var money = 0
//stores the default value of health the player begins with
var health = 400;
//the maximum amount of health the player can have
var maxHealth = 400;
//the beginning number of enemies can be created
enemysSpawned = 1
//default tower range
defaultRange = 200

let start

// loads in image for menu background
function preload() {
  //stores the menu image as a variable so can be accessed
  start = loadImage("background.png");
}

function setup() {
  //creates a canvas that will cover whole screen 
  createCanvas(windowWidth, windowHeight)
  //stores every button relating to the menu
  menuButtons = [
    new Button("Start", windowWidth / 2, windowHeight / 2 + 100, 200, 100, () => { gameMode = 'play'; buttons = gameButtons}),
  ]
  //stpres every button relating to the game
  gameButtons =
    [new Button('⚙️', windowWidth - 30, 30, 50, 50, () => { gameMode = 'pause'; buttons = pauseButtons}),
    new Button('🛒', windowWidth - 100, 30, 50, 50, () => { gameMode = 'shop'; buttons = shopButtons })
    ]
  //stores every button relating to the pause menu
  pauseButtons = [
    new Button("Continue", windowWidth / 2, windowHeight / 2, 250, 50, () => { gameMode = 'play'; buttons = gameButtons }),
    new Button('Quit', windowWidth / 2, windowHeight / 2 + 100, 250, 50, () => { gameMode = 'menu'; buttons = menuButtons }),
  ]
  //stores every button relating to the losing screen
  deadButtons =
    [new Button("Play Again?", windowWidth / 2, windowHeight / 2, 250, 50, () => { gameMode = 'replay'; buttons = gameButtons }),
    new Button('Quit', windowWidth / 2, windowHeight / 2 + 100, 250, 50, () => { gameMode = 'menu'; buttons = menuButtons }),
    ]

  shopButtons =
    //close shop
    [new Button("X", windowWidth - 50, 50, 70, 70, () => { gameMode = 'play'; buttons = gameButtons }),
    // Upgrade 1
    new Button("Increase Health", 150 , 200, 180, 30, () => { gameMode = 'upgrade'; buttons = gameButtons })
     ]

  //loads in the menu buttons first since this is the first screen player will be on 
  buttons = menuButtons
  //
  towers.push(new Tower(this.x, this.y,));
  towersRange.push(new TowerRange(towers.x,towers.y,towers.x/2))
}

function mousePressed() {
  for (b of buttons) { b.clicked() }
}

function reset() {
  enemys.length = 0
  projectiles.length = 0
  manualProjectiles.length = 0
  health = maxHealth
  money = 0
  enemysSpawned = 1
}

function draw() {
  //when player clicks button, switch game modes
  switch (gameMode) {
    case 'menu':
      drawMenu()
      drawTitle()
      break
    case 'play':
      drawGame()
      break
    case 'pause':
      drawPause()
      break
    case 'dead':
      drawDead()
      break
    case 'replay':
      reset()
      gameMode = "play"
      drawGame()
      break
    case 'shop':
      drawShop()
      break
    case 'upgrade':
      upgradeHealth()
      break
  }

  for (b of buttons) {
    b.render()
  }
}

//menu updating 
function updateMenu(){
 menuButtons[0].x = windowWidth/2 
}

//game updating 
function updateGame(){
  gameButtons[0].x = windowWidth - 30;
  gameButtons[1].x = windowWidth - 100
}

function updateTower(){
  for(let tower of towers){
    tower.x = windowWidth/2
    tower.y = windowHeight/2
    tower.updatePosition();
  }
}

function updateRange(){
  for(let towerRange of towersRange){
    for(let tower of towers){
    towerRange.x = tower.x
    towerRange.y = tower.y
    towerRange.r = defaultRange
  }
 }
}


function windowResized(){
  updateMenu();
  updateGame();
  updateTower();
  updateRange();
  console.log("Resized")
  resizeCanvas(windowWidth,windowHeight);
}

function upgradeHealth(){
  health = health + 20
  maxHealth = maxHealth + 20
}

//when the player has no more health, draw the losing screen
function drawDead() {
  background(255, 255, 255, 0.6)
  fill("white")
  fill("black")
  rect(windowWidth / 2, windowHeight / 2, 500, 500)
  textSize(100)
  fill("white")
  text("You Died!", windowWidth / 2, windowHeight / 2 - 125)
}

//draws the menu screen 
function drawMenu() {
  //when player is in menu, reset the game
  reset()
  //fills in the background by the image stored in variable start
  background(start)
}

function drawHealth(){
  //text
  fill("white")
  stroke("black")
  strokeWeight(1)
  textSize(20)
  text("Health", 100, 20)

  //bar itself
  rectMode(CORNER);
  noStroke();
  fill("red")
  rect(5, 40, map(health, 0, maxHealth, 0, 200), 20);
  noFill();
  stroke("white")
  strokeWeight(2)
  rect(5,40,200,20)
}

function drawMoney(){
  text("Money", windowWidth/2 + 20, 20)
  textSize(30)
  text(money + " " + "$", windowWidth/2 + 20, 60)
  rectMode(CORNER)
  stroke("white");
  strokeWeight(2);
  noFill();
}

//when game starts, draw the game
function drawGame() {
  background("black");
  drawHealth();
  drawMoney();
  rectMode(CENTER)
  //enables enemies to be drawn
  spawn()

  //draws the towers range
  for (r of towersRange) {
    r.draw()
  }
  //draws the tower
  for (t of towers) {
    t.draw();
  }
  //for every enemy in the enemies array
  for (e of enemys) {
    //draw the enemy 
    e.draw();
    //update the enemies position
    e.update();
  }
  // for every projectile in the projectiles array
  for (p of projectiles) {
    p.draw();
    //update the projectiles position
    p.update();
    //checks if projectile has collided with some enemies
    p.hashitenemy()
  }
  // for every projectile shot by the player
  for (m of manualProjectiles) {
    //draw the projectile 
    m.draw()
    //update the projectiles position
    m.update()
    //check if the projectile has collided with some enemies 
    m.hashitenemy()
  }
}
// draws the main title of the game
function drawTitle() {
  fill("gold")
  textSize(50)
  stroke("black")
  text("Beta Defence", windowWidth / 2, windowHeight / 2);
}

//draws the pause screen when the pause button is clicked
function drawPause() {
  background(255, 255, 255, 0.6)
  fill("white")
  fill("black")
  rect(windowWidth / 2, windowHeight / 2, 500, 500)
  textSize(100)
  fill("white")
  text("Paused", windowWidth / 2, windowHeight / 2 - 125)
}

//draws the shop screen when shop button is pressed 
function drawShop() {
  background("black");
  fill("white")
  textSize(100)
  text("Shop", windowWidth / 2, 100)
}

function spawn() {
  //loops through enemies array until a set number enemies are created whilst also drawing these enemies every 2 seconds
  while (enemys.length < enemysSpawned && millis() > lastSpawned + spawnCooldown) {
    // assumes enemy is not colliding
    colliding = false
    // generate a random x coordinate for enemy
    var xco = (windowWidth * Math.random())
    // generate a random y coordinate for enemy
    var yco = (windowHeight * Math.random())

    //loops through enemies currently to see if they are drawn within the towers area
    for (let i = 0; i < enemysSpawned; i++) {
      //checks if enemys are created within the towers radius
      var check = dist(xco, yco, windowWidth / 2, windowHeight / 2)
      //if enemies are created within the towers radius then 
      if (check < 400) {
        //generate a new random x coordinate
        xco = (windowWidth * Math.random())
        // generate a new random y coordinate
        yco = (windowHeight * Math.random())
      }
    }

    // loop through existing enemy list to see if current enemy being drawn is too close to existing enemy

    for (let j = 0; j < enemys.length; j++) {
      // finds the distance of enemy that is going to be drawn with existing ones
      var d = dist(xco, yco, enemys[j].x, enemys[j].y)
      // if enemy is too close - within a distance of 100 of each other don't create the enemy
      if (d < 100)
        // colliding flag set to true so enemy cannot be drawn
        colliding = true
    }
    // if enemy is not colliding with another enemy, then create enemy in that position
    if (!colliding) {
      enemys.push(new Enemy(xco, yco))
      //stores the last time a previous enemy was created
      lastSpawned = millis()
    }
  }
}

function checkHealth() {
  //if the player has no more health
  if (health < 0) {
    //then pause the game 
    gameMode = "pause"
  }
}

function mouseClicked() {
  //if the player has fired a projectile and the cooldown has passed
  if (millis() > manualFire + manualCooldown) {
    //create a new projectile at the towers position
    manualProjectiles.push(new manualProjectile(towers[0].x, towers[0].y))
    //store the amount of time since the player has last fired
    manualFire = millis()
  }
}


function inRange() {
  // only check if the time now is more than COOLDOWN milliseconds since last event

  if (millis() > lastFired + cooldown) {

    //loops through enemy array
    for (let i = 0; i < enemys.length; i++) {
      //if enemy is in range, then inRange will be set to true and so will fire a projectile
      let inRange = collideRectCircle(enemys[i].x, enemys[i].y, 50, 50, windowWidth / 2, windowHeight / 2, 400);

      //checks if enemy is in range and if enemy is being targeted by the tower
      if (inRange && !enemys[i].targeted) {
        //fire new projectile towards enemy
        projectiles.push(new Projectile(towers[0], enemys[i]))
        // note the time this happened, and exit the function
        lastFired = millis()
        return
      }
    }
  }
}






