//The tower of the game
class Tower {
  constructor() {
    //position the tower in the middle of the player's screen
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
    //stores position of the tower
    this.pos = createVector(this.x, this.y)
  }
  //draws the body of the tower and the cannon of the tower
  draw() {
    //only move the tower and nothing else
    push()
    //positions the cannon with the tower
    rectMode(CENTER)
    //stores position of players cursor position
    this.mouse = createVector(mouseX, mouseY)
    //finds distance between players mouse and towers position
    this.angle = p5.Vector.sub(this.pos, this.mouse).heading()
    //fills in main body of tower in cyan
    fill("cyan");
    //create an outline for the tower
    stroke("black")
    //the body of the tower
    circle(windowWidth / 2, windowHeight / 2, 50);
    //makes sure the tower cannon is drawn with the main body of tower
    translate(this.x, this.y)
    fill("silver")
    //create an outline for the tower
    stroke("black")
    //rotates the tower cannon with an offset according to the players cursor position
    rotate(this.angle - 80.1)
    //draw cannon for tower
    rect(0, 30, 30, 55)
    pop()
  }
}

//how far the tower can technically "see" before it can automatically shoot an enemy
class TowerRange {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  // draws the towers range as a small red outline of a circle
  draw() {
    //towers range is filled in red
    stroke("red")
    //adjusts how thin the towers range is 
    strokeWeight(2)
    //gives outline for tower range
    fill("black")
    //the range of the tower, drawn using the x,y and radius
    circle(windowWidth / 2, windowHeight / 2, 400);
  }
}

class Projectile {
  constructor(src, tgt) {
    //the speed the projectile will be moving at
    this.speed = 1
    //stores position of projectile through coordinates parsed in
    this.pos = createVector(src.x, src.y)
    //finds the distance between enemies and projectiles
    this.bv = createVector(tgt.x - src.x, tgt.y - src.y)
    //sets the speed at which the projectile when moving towards enemies
    this.bv.setMag(this.speed)
  }

  //drawn the projectile at towers position and fill in white
  draw() {
    //colour projectile white
    fill("white")
    //projectile will be a small ellipse at the position of the tower 
    ellipse(this.pos.x, this.pos.y, 15)
  }
  //update the projectiles current position
  update() {
    this.pos.add(this.bv)
  }
  //checks if projectiles have collided with enemies 
  hashitenemy() {
    //loops through enemy array to check if any enemy has collided
    for (let i = enemys.length - 1; i >= 0; i--) {
      //checks if an enemy is currently colliding with a projectile
      let enemyHit = collideRectCircle(enemys[i].x - 25, enemys[i].y - 25, 50, 50, this.pos.x, this.pos.y, 15)

//if an enemy is hit by a projectile 
      if (enemyHit) {
        console.log("colliding?", enemyHit);
        //remove that specific enemy from the enemies array
        enemys.splice(i, 1)
        //remove that specific enemy from the projectiles array
        projectiles.splice(projectiles.indexOf(this), 1)
        //increase the players current money by 100 when an enemy has been killed
        money += 100
        //increase the number of enemies that can be "spawned" by 1 
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
    //the speed the projectile will move when fired
    this.speed = 2
    //calculates the x distance between the  mouse and the tower
    this.DistX = mouseX - towers[0].x;
    // calculates y distance from mouse to the tower
    this.DistY = mouseY - towers[0].y;
    //find angle between mouse and tower 
    this.angle = Math.atan2(this.DistY, this.DistX)

  }


  draw() {
    //colours the projectile white
    fill("white")
    //gives the projectile an outline 
    stroke("black")
    //draws the projectile as a small circle
    ellipse(this.x, this.y, 15)

  }

  update() {
    //finds the x angle projectile needs to move
    this.speedX = Math.cos(this.angle);
    //finds y angle projectile needs to move
    this.speedY = Math.sin(this.angle);


    //moves enemy's x cordinate based on the speed
    this.x += this.speedX * this.speed
    //moves enemy's y cordinate based on the speed
    this.y += this.speedY * this.speed
  }
  hashitenemy() {
    //loops through enemy array
    for (let i = enemys.length - 1; i >= 0; i--) {
      //checks if projectile is currently colliding with an enemy
      let enemyHit = collideRectCircle(enemys[i].x - 25, enemys[i].y - 25, 50, 50, this.x, this.y, 15)

      //if an enemy is currently colliding with an enemy
      if (enemyHit) {
        console.log("colliding?", enemyHit);
        //remove that specific enemy
        enemys.splice(i, 1)
        //remove that specific projectile
        manualProjectiles.splice(manualProjectiles.indexOf(this), 1)
        //increases players current money by 100
        money += 100
        //increases number of enemies that can be created by 1
        enemysSpawned++
        return true
      }
    }
    return false
  }
}










