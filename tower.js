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

    //tower auto cannon
    // push()
    // translate(this.x, this.y);
    // fill("silver");
    // stroke("black");
    // rotate(this.autoAngle - PI/2);
    // rect(0, windowWidth * 0.015, windowWidth * 0.03, windowWidth * 0.05);
    // pop();
  }
  rotateCannon(target){
    let targetPos = createVector(target.x,target.y)
    this.autoAngle = p5.Vector.sub(targetPos,this.pos).heading()
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
class Projectile {
  constructor(src, tgt) {
    this.speed = 1
    this.pos = createVector(src.x, src.y)
    this.bv = createVector(tgt.x - src.x, tgt.y - src.y)
    this.bv.setMag(this.speed)
    towers[0].rotateCannon(tgt)
  }
    draw() {
    fill("white")
    ellipse(this.pos.x, this.pos.y, 15)
  }
  update() {
    this.pos.add(this.bv)
  }
  hashitenemy() {
    for (let i = enemys.length - 1; i >= 0; i--) {
      let enemyHit = collideRectCircle(enemys[i].x - 25, enemys[i].y - 25, 50, 50, this.pos.x, this.pos.y, 15)
      if (enemyHit) {
        console.log("colliding?", enemyHit);
        enemys.splice(i, 1)
        projectiles.splice(projectiles.indexOf(this), 1)
        money += 100
        enemysSpawned++
        return true
      }
    }
    return false
  }
}
class manualProjectile {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.defaultSpeed = 1
    this.speed = min(windowWidth * this.defaultSpeed / 500, windowHeight * this.defaultSpeed / 500)
    this.DistX = mouseX - towers[0].x;
    this.DistY = mouseY - towers[0].y;
    this.angle = Math.atan2(this.DistY, this.DistX)
  }
  draw() {
    fill("white")
    stroke("black")
    ellipse(this.x, this.y, min(windowWidth,windowHeight) * 0.02)
  }
  update() {
    this.speedX = Math.cos(this.angle);
    this.speedY = Math.sin(this.angle);
    this.x += this.speedX * this.speed
    this.y += this.speedY * this.speed
  }
  hashitenemy() {
    for (let i = enemys.length - 1; i >= 0; i--) {
      let enemyHit = collideRectCircle(enemys[i].x - 25, enemys[i].y - 25, 50, 50, this.x, this.y, 15)
      if (enemyHit) {
        console.log("colliding?", enemyHit);
        enemys.splice(i, 1)
        manualProjectiles.splice(manualProjectiles.indexOf(this), 1)
        money += 100
        enemysSpawned++
        return true
      }
    }
    return false
  }
}