// --- (Items) ---:

var buttons = []
var pauseButtons = []
var menuButtons = []
var gameButtons = []
var deadButtons = []
var shopButtons = []
var gameMode = 'menu'
var towers = [];
var towersRange = [];
var enemys = [];
var projectiles = [];
var manualProjectiles = []
var shopButtons = []


// --- (Mechanics (Game) ) ---:

var lastFired = 0
var cooldown = 1000
var manualFire = 0
var manualCooldown = 1300
var lastSpawned = 0
var spawnCooldown = 1000
var money = 0
var health = 400;
var maxHealth = 400;
enemysSpawned = 1
defaultRange = 200

// --- Scaling for screen ) ---:
var minW = 20 
var minH = 20
var maxW = 500
var maxH = 500

// --- Fade Animation) ---:
let alpha = 0
let colorSpeed = 5

// --- (Canvas Loading) ---:

// loads in image for menu background
function preload() {
  start = loadImage("background.png");
}

function setup() {

  createCanvas(windowWidth, windowHeight)
  
  menuButtons = [
    new Button("Start", windowWidth / 2, windowHeight / 2 + windowHeight * 0.1, windowWidth * 0.35, windowHeight * 0.08, () => { gameMode = 'play'; buttons = gameButtons}),
  ]

  gameButtons =
    [new Button('⚙️', windowWidth * 0.95, 30, min(max(windowWidth * 0.1, minW), maxW), 50, () => { gameMode = 'pause'; buttons = pauseButtons}),
    new Button('🛒', windowWidth * 0.8, 30, min(max(windowWidth * 0.1, minW), maxW), 50, () => { gameMode = 'shop'; buttons = shopButtons })
    ]

  pauseButtons = [
    new Button("Continue", windowWidth / 2, windowHeight / 2, windowWidth * 0.35, windowHeight*0.08, () => { gameMode = 'play'; buttons = gameButtons }),
    new Button('Quit', windowWidth / 2, windowHeight / 2 + windowHeight * 0.1,  windowWidth * 0.35, windowHeight*0.08, () => { gameMode = 'menu'; buttons = menuButtons }),
  ]

  deadButtons =
    [new Button("Play Again?", windowWidth / 2, windowHeight / 2, 250, 50, () => { gameMode = 'replay'; buttons = gameButtons }),
    new Button('Quit', windowWidth / 2, windowHeight / 2 + 100, 250, 50, () => { gameMode = 'menu'; buttons = menuButtons }),
    ]

  shopButtons =

    [new Button("X", windowWidth - 50, 50, 70, 70, () => { gameMode = 'play'; buttons = gameButtons }),
    new Button("Increase Health", 150 , 200, 180, 30, () => { gameMode = 'upgrade'; buttons = gameButtons })
     ]

  buttons = menuButtons
  towers.push(new Tower(this.x, this.y,));
  towersRange.push(new TowerRange(towers.x,towers.y,towers.x/2))
}

// --- (Game methods) ---:

//Check mouse click
function mousePressed() {
  for (b of buttons) { b.clicked() }
}

//Reset game when player dies / Starts new one
function reset() {
  enemys.length = 0
  projectiles.length = 0
  manualProjectiles.length = 0
  health = maxHealth
  money = 0
  enemysSpawned = 1
}


// --- (Draw function - actually draw the game) ---:

//When player clicks button, switch game modes
function draw() {
  background(0)

  if(gameMode != 'pause'){
    restAlpha();
  }
  
  switch (gameMode) {
    case 'menu':
      drawMenu()
      drawTitle()
      break
    case 'play':
      drawGame()
      break
    case 'pause':
      drawGame()
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

function restAlpha(){
  alpha = 0
}

// --- (Update methods) ---:

//Menu updating (Only when screen size changes) 
function updateMenu(){
  menuButtons[0].x = windowWidth/2 
  menuButtons[0].y = windowHeight / 2 + windowHeight * 0.1
  menuButtons[0].width = 300
  menuButtons[0].height = 125
  
  if(gameMode === 'menu'){
    drawTitle()
  }
 }

//Game updating 
function updateGame(){

  //Update the buttons within game - e.g. shop and pause
  gameButtons[0].x = windowWidth - gameButtons[0].width/2 - 5
  gameButtons[0].y = gameButtons[0].height/2 + 5
  gameButtons[0].width = windowWidth * 0.05
  gameButtons[0].height = windowWidth * 0.05

  gameButtons[1].x = gameButtons[0].x - windowWidth * 0.06
  gameButtons[1].y = gameButtons[1].height/2 + 5
  gameButtons[1].width = windowWidth * 0.05
  gameButtons[1].height = windowWidth * 0.05
  
  //Update the tower itself 
  for(let towerRange of towersRange){
    towerRange.x = windowWidth/2
    towerRange.y = windowHeight/2
    towerRange.r = windowWidth/4
  }

  for(let tower of towers){
    tower.x = windowWidth/2
    tower.y = windowHeight/2
  }

  for(let manualProjectile of manualProjectiles){
    manualProjectile.speed = windowWidth * 0.002
  }
  
  // Enemy updating
  for (let enemy of enemys) {
    enemy.speed = max(windowWidth * 0.002,windowHeight * 0.002)
    enemy.update();
 }

 if(gameMode === 'play'){
  //Any other items on game screen
  drawHealth()
  drawMoney()
 }

}

function updatePause(){

  pauseButtons[0].x = windowWidth / 2
  pauseButtons[0].y = windowHeight / 2 
  pauseButtons[0].width = windowWidth * 0.25
  pauseButtons[0].height = windowWidth * 0.05

  pauseButtons[1].x = windowWidth/ 2 
  pauseButtons[1].y = pauseButtons[0].y + pauseButtons[1].height + 20
  pauseButtons[1].width = windowWidth * 0.25
  pauseButtons[1].height = windowWidth * 0.05
  
}

//Update game per screen change
function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  updateMenu();
  updateGame();
  updatePause();
}

// ---(Drawing methods) ---:

function drawDead() {
  background(255, 255, 255, 0.6)
  fill("white")
  fill("black")
  rect(windowWidth / 2, windowHeight / 2, 500, 500)
  textSize(100)
  fill("white")
  text("You Died!", windowWidth / 2, windowHeight / 2 - 125)
}

function drawMenu() {
  reset()
  background(start)
}

function drawHealth(){
  fill("white")
  stroke("black")
  strokeWeight(1)
  let healthSize = min(windowWidth, windowHeight) * 0.03
  textSize(healthSize)
  text("Health", windowWidth * 0.065, healthSize)

  rectMode(CORNER);
  noStroke();
  fill("red")
  rect(windowWidth * 0.01, healthSize + 10, map(health, 0, maxHealth, 0, windowWidth*0.1), 20);
  noFill();
  stroke("white")
  strokeWeight(2)
  rect(windowWidth*0.01,healthSize + 10,windowWidth*0.1,20)
}

function drawMoney(){
  let moneySize = min(windowWidth, windowHeight) * 0.03
  textSize(moneySize)
  fill("white")
  noStroke();
  text("Money", windowWidth/2 + 20, moneySize)
  text(money + " " + "$", windowWidth/2 + 20 , moneySize + moneySize)
  rectMode(CORNER)
  noFill();
}

function drawGame() {
  background("black");
  drawHealth();
  drawMoney();
  rectMode(CENTER)
  spawn()

  
  for (r of towersRange) {
    r.draw()
  }

  for (t of towers) {
    t.draw();
  }

  for (e of enemys) {
    e.draw();
    if(gameMode === 'play'){
    e.update();
    }
  }

  for (p of projectiles) {
    p.draw();
    if(gameMode === 'play'){
    p.update();
    }
    p.hashitenemy()
  }

  for (m of manualProjectiles) {
    m.draw()
    if(gameMode === 'play'){
    m.update()
    }
    m.hashitenemy()
  }
}

function drawTitle() {
  fill("gold")
  let titleSize = min(windowWidth, windowHeight) * 0.15
  textSize(titleSize)
  stroke("black")
  text("Beta Defence", windowWidth / 2, windowHeight / 2);
}

function drawPause() {

  let time = millis()
  
  if(time > colorSpeed){
    if(alpha <= 150){
      alpha+=5
    }
  }

  background(255,alpha)

  fill(0)
  textSize(10)
  textAlign(CENTER,CENTER)
  text("Paused", windowWidth/2, windowHeight/2)

}

function resetAlpha(){
  if(alpha == 150){
    alpha = 0
  }
}

function drawShop() {
  background("black");
  fill("white")
  textSize(100)
  text("Shop", windowWidth / 2, 100)
}


//--- (Enemy Mechanics) ---

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

    //Distance checking for each enemy
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


//--- (Player Mechanics) ---
function checkHealth() {

  //Check player health
  if (health < 0) {
    //then pause the game 
    gameMode = "pause"
  }
}

//Shooting the tower
function mouseClicked() {
  //if the player has fired a projectile and the cooldown has passed
  if (millis() > manualFire + manualCooldown && gameMode === 'play') {
    //create a new projectile at the towers position
    manualProjectiles.push(new manualProjectile(towers[0].x, towers[0].y))
    //store the amount of time since the player has last fired
    manualFire = millis()
  }
}


//--- (Tower Mechanics) ---
function inRange() {

  //Cooldown for the tower
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


//--- (Upgrade Mechanics) ---

function upgradeHealth(){
  health = health + 20
  maxHealth = maxHealth + 20
}






