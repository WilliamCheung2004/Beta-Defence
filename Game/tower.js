class Tower {
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
  }
    draw() {
    this.pos = createVector(this.x, this.y)   
    this.mouse = createVector(mouseX, mouseY)  
    this.angle = p5.Vector.sub(this.mouse, createVector(windowWidth/2,windowHeight/2)).heading()

    //tower body
    push()
    rectMode(CENTER)
    fill("cyan");
    stroke("black")
    circle(windowWidth / 2, windowHeight / 2, windowWidth * 0.05 );
    pop()

    //tower cannon
    push()
    translate(windowWidth / 2, windowHeight / 2)
    fill("silver")
    stroke("black")
    rotate(this.angle - PI / 2)
    rect(0, windowWidth * 0.015, windowWidth * 0.03, windowWidth * 0.05)
    pop()

  }
}
class TowerRange {
  constructor() {
    this.x = windowWidth/2;
    this.y = windowHeight/2;
    this.r = this.x/1.5;
  }
    draw() {
    stroke("red")
    strokeWeight(2)
    fill("black")
    circle(this.x,this.y,this.r);
  }
}

let turretX = null
let turretY = null
let turretSet = false

class Projectile {
  constructor(src, tgt,towerRX,towerRY,towerRR) {
    this.speed = 1;
    this.pos = createVector(src.x, src.y);
    this.bv = createVector(tgt.x - src.x, tgt.y - src.y);
    this.bv.setMag(this.speed);

    this.tempX = towerRX
    this.tempY = towerRY
    this.tempR = towerRR
  }

  draw() {
    //projectile
    push()
    fill("white")
    ellipse(this.pos.x, this.pos.y, 15)
    pop()
}


drawTurret(upgrade4){

  // push()
  // fill("blue")
  // noStroke()
  // ellipse(towers[0].x + towersRange[0].r/2,towers[0].y, min(windowWidth,windowHeight) * 0.02)
  // pop()

  if(!turretSet){ 
    turretX = this.tempX + random(-this.tempR/2,this.tempR/2)
    turretY = this.tempY + random(-this.tempR/2,this.tempR/2)
    turretSet = true
  }

  push()
  translate(turretX,turretY)
  let angle = this.bv.heading()
  rotate(angle)
  image(upgrade4, -25,-25, 50,50) 
  pop()

}



  update() {
    this.pos.add(this.bv);
  }

  hashitenemy() {
    for (let i = enemys.length - 1; i >= 0; i--) {
      let enemyHit = collideRectCircle(enemys[i].x - enemys[i].w/2, enemys[i].y - enemys[i].h/2, enemys[i].w, enemys[i].h, this.x, this.y, this.r)
      
      if (enemyHit) {
        enemys[i].health -= this.damage
        console.log(enemys[i].health)
        Projectiles.splice(Projectiles.indexOf(this), 1)
        enemyHit = false

        if(enemys[i].health <= 0){
        enemys.splice(i, 1)
        money += 50
        enemysSpawned++
        return true
        }
      }
    }
    return false
  }

}

class manualProjectile {
  static defaultSpeed = 1
  static defaultDamage = 1
  constructor(x, y) {
    this.x = x
    this.y = y
    this.r = min(windowWidth,windowHeight) * 0.02
    this.defaultSpeed = manualProjectile.defaultSpeed
    this.speed = min(windowWidth * this.defaultSpeed / 500, windowHeight * this.defaultSpeed / 500)
    this.DistX = mouseX - towers[0].x;
    this.DistY = mouseY - towers[0].y;
    this.angle = Math.atan2(this.DistY, this.DistX)
    this.damage = manualProjectile.defaultDamage
  }
  draw() {
    fill("white")
    stroke("black")
    ellipse(this.x, this.y, this.r)
  }
  update() {
    this.r = min(windowWidth,windowHeight) * 0.02
    this.speedX = Math.cos(this.angle);
    this.speedY = Math.sin(this.angle);
    this.x += this.speedX * this.speed
    this.y += this.speedY * this.speed
  }
  hashitenemy() {
    for (let i = enemys.length - 1; i >= 0; i--) {
      let enemyHit = collideRectCircle(enemys[i].x - enemys[i].w/2, enemys[i].y - enemys[i].h/2, enemys[i].w, enemys[i].h, this.x, this.y, this.r)
      
      if (enemyHit) {
        enemys[i].health -= this.damage
        console.log(enemys[i].health)
        manualProjectiles.splice(manualProjectiles.indexOf(this), 1)
        enemyHit = false

        if(enemys[i].health <= 0){
        enemys.splice(i, 1)
        money += 100
        enemysSpawned++
        return true
        }
      }
    }
    return false
  }
  static setSpeed(val){
    manualProjectile.defaultSpeed = val
  }
  static reset(){
    manualProjectile.defaultSpeed = 1
    manualProjectile.defaultDamage = 1
  }
}

class Shooter {
  constructor() {
    this.x = towers[0].x
    this.y = towers[0].y
    this.DistX = towers[0].x 
    // this.DistY = towers[0].y - enemys[0].y;
    // this.angle = Math.atan2(this.DistY, this.DistX)
  }
  draw() {

    push()
    fill("blue")
    noStroke()
    ellipse(this.x,this.y, min(windowWidth,windowHeight) * 0.02)
    pop()

    push()
    rotate(this.angle)
    image(upgrade4, this.x - min(windowWidth,windowHeight) * 0.02, this.y - min(windowWidth,windowHeight) * 0.02, min(windowWidth,windowHeight) * 0.04, min(windowWidth,windowHeight) * 0.04)
    pop()
  }
  update() {
    this.angle = Math.atan2(this.DistY, this.DistX)
  }
}
