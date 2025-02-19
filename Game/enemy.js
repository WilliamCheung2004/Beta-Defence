class Enemy {
  
  constructor(x, y) {
    //attributes of enemies
    this.x = x
    this.y = y
    this.w = min(windowWidth,windowHeight) * 0.06
    this.h = min(windowWidth,windowHeight) * 0.06
    //stats
    this.health = 10
    this.damage = 1
    this.defaultSpeed = 1
    this.speed = min(windowWidth * this.defaultSpeed / 500, windowHeight * this.defaultSpeed / 500)
  }
  draw() {
    //enemy graphics
    stroke("black")
    fill("red")
    rect(this.x, this.y, this.w, this.h)
    fill("black")
    ellipse(this.x + min(windowWidth,windowHeight) * 0.01, this.y - min(windowWidth,windowHeight) * 0.01, min(windowWidth,windowHeight) * 0.01)
    ellipse(this.x - min(windowWidth,windowHeight) * 0.01, this.y - min(windowWidth,windowHeight) * 0.01, min(windowWidth,windowHeight) * 0.01)
    line(this.x + min(windowWidth,windowHeight) * 0.01, this.y + min(windowWidth,windowHeight) * 0.01, this.x - min(windowWidth,windowHeight) * 0.01, this.y + min(windowWidth,windowHeight) * 0.01)
  }
  update() {
    this.w = min(windowWidth,windowHeight) * 0.06
    this.h = min(windowWidth,windowHeight) * 0.06
    //calc distance from enemy to tower
    let towercolliding = false
    this.DistX = towers[0].x - this.x;
    this.DistY = towers[0].y - this.y;
    this.distance = Math.sqrt((this.DistX * this.DistX) + (this.DistY * this.DistY));
    this.angle = Math.atan2(this.DistY, this.DistX)
    this.speedX = Math.cos(this.angle);
    this.speedY = Math.sin(this.angle);
    this.x += this.speedX * this.speed
    this.y += this.speedY * this.speed

    //collision detection enemy -> tower
    for (let k = 0; k < enemys.length; k++) {
      var towerdist = dist(this.x, this.y, towers[0].x, towers[0].y)
      if (towers[0] != enemys[k]) {
        if (towerdist < min(windowWidth,windowHeight) * 0.05) {
          towercolliding = true
        }
      }
      if (towercolliding && gameMode == 'play') {
        this.speed = 0.00001
        health -= this.damage * 0.5
      }else{
        min(windowWidth * this.defaultSpeed / 500, windowHeight * this.defaultSpeed / 500)
      }

      //switch gamemode - health 0 
        if (health < 0) {
          health = 0
          gameMode = "dead", buttons = deadButtons
        }
    }
  }
}