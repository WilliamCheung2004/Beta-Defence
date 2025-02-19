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
var lastSpawned = 0
var spawnCooldown = 1000

// --- (Mechanics) (Player)  ---:
var money = 0
var health = 400;
var maxHealth = 400;

// --- (Mechanics) (Enemy)  ---:
enemysSpawned = 1

// --- (Mechanics) (Manual Tower)---:
defaultRange = 200
var cooldown = 1000
var manualFire = 0
var manualCooldown = 1300

//Auto tower
var lastFired = 0

// --- Scaling for screen ) ---:
var minW = 20 
var minH = 20
var maxW = 500
var maxH = 500
let buffer 
var hasDrawn = false

// --- Fade Animation) ---:
let alpha = 0
let colorSpeed = 5
let drawn = false

// --- Shop Upgrades) ---:
let healthUpgrade = "200"
let projectileUpgrade = "200"

// --- (Canvas Loading) ---:

// loads in image for menu background
function preload() {
  start = loadImage("Assets/background.png");
  upgrade1 = loadImage("Assets/heart.png")
  upgrade2 = loadImage("Assets/ammo.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(60)
  pixelDensity(1)
  
  menuButtons = [
    new Button("Start", windowWidth / 2, windowHeight / 2 + windowHeight * 0.1, min(windowWidth* 0.3, windowHeight * 0.3), min(windowWidth* 0.15, windowHeight * 0.15), () => { gameMode = 'play'; buttons = gameButtons}),
  ]

  gameButtons =
    [new Button('⚙️', 0,0,0,0, () => { gameMode = 'pause'; buttons = pauseButtons}),
    new Button('🛒', 0,0,0,0, () => { gameMode = 'shop'; buttons = shopButtons })
    ]

  pauseButtons = [
    new Button("Continue", 0,0,0,0, () => { gameMode = 'play'; buttons = gameButtons }),
    new Button('Quit', 0,0,0,0, () => { gameMode = 'menu'; buttons = menuButtons })
  ]

  deadButtons =
    [new Button("Play Again?", 0,0,0,0, () => { gameMode = 'replay'; buttons = gameButtons }),
    new Button('Quit', 0,0,0,0, () => { gameMode = 'menu'; buttons = menuButtons }),
    ]

  shopButtons =

    [new Button("X", 0,0,0,0, () => { gameMode = 'play'; buttons = gameButtons }),
    new Button(healthUpgrade, 0,0,0,0, () => { gameMode = 'shop'; buttons = shopButtons;upgradeHealth()}),
    new Button(projectileUpgrade, 0,0,0,0, () => { gameMode = 'shop'; buttons = shopButtons;upgradeBulletSpeed()})
     ]

  buttons = menuButtons
  towers.push(new Tower(this.x, this.y,));
  towersRange.push(new TowerRange(towers.x,towers.y,towers.x/2))

  //Initiase buttons 
  gameButtons[0].width = windowWidth * 0.05
  gameButtons[0].height = windowWidth * 0.05
  gameButtons[0].x = windowWidth - gameButtons[0].width/2 - 5
  gameButtons[0].y = gameButtons[0].height/2 + 5

  gameButtons[1].width = windowWidth * 0.05
  gameButtons[1].height = windowWidth * 0.05
  gameButtons[1].x = gameButtons[0].x - windowWidth * 0.06
  gameButtons[1].y = gameButtons[1].height/2 + 5

  pauseButtons[0].x = windowWidth / 2
  pauseButtons[0].y = windowHeight / 2 
  pauseButtons[0].width = windowWidth * 0.22
  pauseButtons[0].height = windowWidth * 0.05

  pauseButtons[1].x = windowWidth/ 2 
  pauseButtons[1].y = pauseButtons[0].y + pauseButtons[0].height * 1.25
  pauseButtons[1].width = windowWidth * 0.22
  pauseButtons[1].height = windowWidth * 0.05

  deadButtons[0].x = windowWidth / 2
  deadButtons[0].y = windowHeight / 2 
  deadButtons[0].width = windowWidth * 0.25
  deadButtons[0].height = windowWidth * 0.05

  deadButtons[1].x = windowWidth/ 2 
  deadButtons[1].y = deadButtons[0].y + deadButtons[0].height * 1.25
  deadButtons[1].width = windowWidth * 0.25
  deadButtons[1].height = windowWidth * 0.05

  shopButtons[0].width = windowWidth  * 0.05
  shopButtons[0].height = windowWidth * 0.05
  shopButtons[0].x = windowWidth - shopButtons[0].width/2 - 5
  shopButtons[0].y = shopButtons[0].height/2 + 5

  shopButtons[1].width = min(windowWidth,windowHeight) * 0.15
  shopButtons[1].height = min(windowWidth,windowHeight) * 0.07
  shopButtons[1].x = min(windowWidth,windowHeight) * 0.25
  shopButtons[1].y = min(windowWidth,windowHeight) * 0.3

  shopButtons[2].width = min(windowWidth,windowHeight) * 0.15
  shopButtons[2].height = min(windowWidth,windowHeight) * 0.07
  shopButtons[2].x = min(windowWidth,windowHeight) * 0.25
  shopButtons[2].y = min(windowWidth,windowHeight) * 0.5615
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

let drawnMenu = false
// --- (Draw function - actually draw the game) ---:

//When player clicks button, switch game modes
function draw() {

   if(gameMode != 'pause' && gameMode != 'dead'){
     restAlpha();
     drawn = false
    }
  
  switch (gameMode) {
    
    case 'menu':
      drawMenu()
      break

    case 'play':
      drawGame()
      break

    case 'pause':
      drawGame()
      drawPause()
      break

    case 'dead':
      drawGame()
      drawDead()
      break

    case 'replay':
      reset()
      gameMode = "play"
      break

    case 'shop':
      drawShop()
      gameMode = "shop"
      break
  }

  //Draw buttons
  if(gameMode == 'menu'){
  menuButtons[0].render()
  }
  
  else if(gameMode == 'play'){
    for(g of gameButtons)
      g.render()

  }else if(gameMode == 'pause'){
    for(p of pauseButtons)
      p.render()

  }else if(gameMode == 'dead'){
    for(d of deadButtons)
      d.render()

  }else if(gameMode == 'shop'){
    for(s of shopButtons)
      s.render()
  }
  
}

function restAlpha(){
  alpha = 0
}

// --- (Update methods) ---:

//Menu updating (Only when screen size changes) 
function updateMenu(){
  if(gameMode == "menu"){
  background(start)
  fill("gold")
  let titleSize = min(windowWidth, windowHeight) * 0.1
  textSize(titleSize)
  stroke("black")
  textAlign(CENTER,CENTER)
  text("Beta Defence", windowWidth / 2, windowHeight/2 - menuButtons[0].height/8);
  }
 }

//Game updating 
function updateGame(){
  
  //Update the tower itself 
    towersRange[0].x = windowWidth/2
    towersRange[0].y = windowHeight/2
    towersRange[0].r = windowWidth/4

    towers[0].x = windowWidth/2
    towers[0].y = windowHeight/2
  

  for(let manualProjectile of manualProjectiles){
    manualProjectile.speed = min(windowWidth * this.defaultSpeed / 500, windowHeight * this.defaultSpeed / 500)
  }
  
  // Enemy updating
  for (let enemy of enemys) {
    enemy.speed = min(windowWidth * (enemy.defaultSpeed/500),windowHeight * (enemy.defaultSpeed/500))
    enemy.update();
 }

 if(gameMode === 'play'){
  drawHealth()
  drawMoney()
 }

}

function updateButtons(){
    //Update the buttons within game - e.g. shop and pause

    //Shop
    menuButtons[0].x = windowWidth/2 
    menuButtons[0].y = windowHeight / 2 + windowHeight * 0.1
    menuButtons[0].width = min(windowWidth* 0.3,windowHeight * 0.3)
    menuButtons[0].height = min(windowWidth* 0.15,windowHeight * 0.15)

    //Game
    gameButtons[0].width = windowWidth * 0.05
    gameButtons[0].height = windowWidth * 0.05
    gameButtons[0].x = windowWidth - gameButtons[0].width/2 - 5
    gameButtons[0].y = gameButtons[0].height/2 + 5
  
    gameButtons[1].width = windowWidth * 0.05
    gameButtons[1].height = windowWidth * 0.05
    gameButtons[1].x = gameButtons[0].x - windowWidth * 0.06
    gameButtons[1].y = gameButtons[1].height/2 + 5

    //Pause
    pauseButtons[0].x = windowWidth / 2
    pauseButtons[0].y = windowHeight / 2 
    pauseButtons[0].width = windowWidth * 0.22
    pauseButtons[0].height = windowWidth * 0.05
  
    pauseButtons[1].x = windowWidth/ 2 
    pauseButtons[1].y = pauseButtons[0].y + pauseButtons[1].height * 1.25
    pauseButtons[1].width = windowWidth * 0.22
    pauseButtons[1].height = windowWidth * 0.05

    //Dead
    deadButtons[0].x = windowWidth / 2
    deadButtons[0].y = windowHeight / 2 
    deadButtons[0].width = windowWidth * 0.25
    deadButtons[0].height = windowWidth * 0.05

    deadButtons[1].x = windowWidth/ 2 
    deadButtons[1].y = deadButtons[0].y + deadButtons[1].height * 1.25
    deadButtons[1].width = windowWidth * 0.25
    deadButtons[1].height = windowWidth * 0.05

    //Shop
    shopButtons[0].width = windowWidth * 0.05
    shopButtons[0].height = windowWidth * 0.05
    shopButtons[0].x = windowWidth - shopButtons[0].width/2 - 5
    shopButtons[0].y = shopButtons[0].height/2 + 5
  
    shopButtons[1].width = min(windowWidth,windowHeight) * 0.15
    shopButtons[1].height = min(windowWidth,windowHeight) * 0.07
    shopButtons[1].x = min(windowWidth,windowHeight) * 0.25
    shopButtons[1].y = min(windowWidth,windowHeight) * 0.3

    shopButtons[2].width = min(windowWidth,windowHeight) * 0.15
    shopButtons[2].height = min(windowWidth,windowHeight) * 0.07
    shopButtons[2].x = min(windowWidth,windowHeight) * 0.25
    shopButtons[2].y = min(windowWidth,windowHeight) * 0.5615
}

//Check if window is maximised or minimized since windowResized does not check this
let prevWidth = window.innerWidth
let prevHeight = window.innerHeight

setInterval(function() {
  if(windowWidth != prevWidth || windowHeight != prevHeight){
    prevWidth = window.innerWidth
    prevHeight = window.innerHeight
    windowResized()
  }
},500)


//Update game per screen change
function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  updateMenu();
  updateGame();
  updateButtons();
}

// ---(Drawing methods) ---:

function drawDead() {
  
  let time = millis()
    if(time > colorSpeed && alpha <= 100){
      alpha+=5
    }

  background(255,alpha)

  //Box for buttons 
  fill("white")
  rect(windowWidth/2,deadButtons[0].y - deadButtons[0].height/2,min(windowWidth*0.4,windowHeight * 0.45),min(windowWidth*0.4,windowHeight * 0.45))
  stroke(255)

  //Text
  textSize(min(windowWidth, windowHeight) * 0.1)
  textAlign(CENTER,CENTER)
  fill("black")
  stroke(255)
  text("You Died!", windowWidth/2, deadButtons[0].y - deadButtons[0].height * 1.75)

}

function drawMenu() {
  reset()
  background(start)
  fill("gold")
  let titleSize = min(windowWidth, windowHeight) * 0.1
  textSize(titleSize)
  stroke("black")
  textAlign(CENTER,CENTER)
  text("Beta Defence", windowWidth / 2, windowHeight/2 - menuButtons[0].height/8);
}

function drawHealth(){
  fill("white")
  stroke("black")
  strokeWeight(1)

  let healthTextSize = min(windowWidth, windowHeight) * 0.03
  textSize(healthTextSize)
  text("Health",min(windowWidth, windowHeight) * 0.06, healthTextSize)

  rectMode(CORNER);
  noStroke();
  fill("red")
  rect(windowWidth * 0.01, healthTextSize + healthTextSize/2, map(health, 0, maxHealth, 0, min(windowWidth,windowHeight) * 0.1), min(windowWidth,windowHeight) * 0.02);
  noFill();
  stroke("white")
  strokeWeight(2)
  rect(windowWidth * 0.01, healthTextSize + healthTextSize/2, map(health, 0, maxHealth, 0, min(windowWidth,windowHeight) * 0.1), min(windowWidth,windowHeight) * 0.02);

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

  //inRange()

  if(!hasDrawn){
  background("black");
}
  drawHealth();
  drawMoney();
  rectMode(CENTER)
  spawn()

  towersRange[0].draw()
  towers[0].draw()

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



function drawPause() {

  let time = millis()
    if(time > colorSpeed && alpha <= 100){
      alpha+=5
    }
  
  background(100,alpha)

  if(!drawn){
  //Box for buttons 
  fill("white")
  rect(windowWidth/2,pauseButtons[0].y - pauseButtons[0].height/2,min(windowWidth*0.4,windowHeight * 0.45),min(windowWidth*0.4,windowHeight * 0.45))

  //Text
  textSize(min(windowWidth, windowHeight) * 0.1)
  textAlign(CENTER,CENTER)
  fill("black")
  stroke(255)
  text("Paused", windowWidth/2, pauseButtons[0].y - pauseButtons[0].height * 1.75)
  }
}

function resetAlpha(){
    alpha = 0
}

//test
function drawShop() {
  background("black");
  fill("white")
  textAlign(CENTER,CENTER)
  textSize(min(windowWidth, windowHeight) * 0.05)
  text("Shop (Beta Version 1.0)", windowWidth / 2, min(windowWidth, windowHeight) * 0.05)
  text("Health", min(windowWidth,windowHeight) * 0.18, min(windowWidth, windowHeight) * 0.2)
  text("Bullet Speed", min(windowWidth,windowHeight) * 0.18, min(windowWidth, windowHeight) * 0.45)
  imageMode(CENTER,CENTER)
  image(upgrade1,min(windowWidth,windowHeight) * 0.05, min(windowWidth,windowHeight) * 0.315,min(windowWidth, windowHeight) * 0.2,min(windowWidth, windowHeight) * 0.2)
  image(upgrade2,min(windowWidth,windowHeight) * 0.05, min(windowWidth,windowHeight) * 0.565,min(windowWidth, windowHeight) * 0.1,min(windowWidth, windowHeight) * 0.1)
}


//--- (Enemy Mechanics) ---

function spawn() {

  while (enemys.length < enemysSpawned && millis() > lastSpawned + spawnCooldown && gameMode == 'play') {

    colliding = false

    var xco = (windowWidth * Math.random())
    var yco = (windowHeight * Math.random())

    var check = dist(xco, yco, towersRange[0].x, towersRange[0].y)

    if (check < towersRange[0].r ) {
        xco = (windowWidth * Math.random())
        yco = (windowHeight * Math.random())
        colliding = true
      }

    //Prevent enemies spawning near another  
    for (let j = 0; j < enemys.length; j++) {
      var d = dist(xco, yco, enemys[j].x, enemys[j].y)

      if (d < 100)
        colliding = true
    }

    if (!colliding) {
      enemys.push(new Enemy(xco, yco))
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

//Shooting the tower (manual)
function mouseClicked() {
  
  //if the player has fired a projectile and the cooldown has passed
  if (gameMode == 'play' && millis() > manualFire + manualCooldown) {
    //create a new projectile at the towers position
    manualProjectiles.push(new manualProjectile(towers[0].x, towers[0].y))
    //store the amount of time since the player has last fired
    manualFire = millis()
  } else if (gameMode != 'play'){
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
      let inRange = collideRectCircle(enemys[i].x, enemys[i].y, enemys[i].width, enemys[i].height, towersRange[0].x, towersRange[0].y, towersRange[0].r);

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
  if(money >= shopButtons[1].text){
    money -= shopButtons[1].text
    health *= 1.25
    maxHealth *-1.25
    shopButtons[1].text = shopButtons[1].text * 1.25
  }
}

function debug(){
  for(e of enemys){
    e.speed = 0;
    e.damage = 0;
  }
  manualProjectile.setSpeed(manualProjectile.defaultSpeed = 5)
}

function upgradeBulletSpeed(){
  if(money >= shopButtons[2].text){
    money -= shopButtons[2].text
    shopButtons[2].text = shopButtons[2].text * 1.25

    for(m of manualProjectiles){
      m.defaultSpeed *= 1.25
    }

    manualProjectile.setSpeed(manualProjectile.defaultSpeed * 1.25)
  }
}








