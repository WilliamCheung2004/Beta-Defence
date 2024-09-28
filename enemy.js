//the enemies of the game that will automatically make their way towards the tower
class Enemy {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    //how much damage every enemy can take before it can die
    this.health = 1
    //the damage each enemy will deal when colliding with the tower
    this.damage = 1
    // sets the default speed enemies will move
    this.speed = 1
    // calculates x distance from tower to enemy
    this.DistX = towers[0].x - this.x;
    // calculates y distance from tower to enemy
    this.DistY = towers[0].y - this.y;
    //finds the distance between tower and enemy
    this.distance = Math.sqrt((this.DistX * this.DistX) + (this.DistY * this.DistY));
    //find angle between enemy and player
    this.angle = Math.atan2(this.DistY, this.DistX)
  }


  draw() {
    stroke("black")
    //every enemy of this type is coloured red
    fill("red")
    rect(this.x, this.y, 50, 50)
    //creates an outline on each enemy
    fill("black")
    //draw eyes onto every enemy
    ellipse(this.x + 10, this.y - 5, 10)
    ellipse(this.x - 10, this.y - 5, 10)
    //draws mouth on each enemy
    line(this.x + 10, this.y + 10, this.x - 10, this.y + 10)
  
    // }
  }

  update() {

    //finds x angle enemy needs to move
    this.speedX = Math.cos(this.angle);
    //finds y angle enemy needs to move
    this.speedY = Math.sin(this.angle);


    //moves enemy's x cordinate based on the speed
    this.x += this.speedX * this.speed
    //moves enemy's y cordinate based on the speed
    this.y += this.speedY * this.speed

    //assumes enemies aren't colliding with the tower
    let towercolliding = false

    // loop through existing enemy list 
    for (let k = 0; k < enemys.length; k++) {
      // finds the distance between existing enemy and tower
      var towerdist = dist(this.x, this.y, towers[0].x, towers[0].y)
      // if current existing enemies position is not equal to tower    
      if (towers[0] != enemys[k]) {
        // if enemy is too close to tower
        if (towerdist < 50) {
          towercolliding = true
        }
      }
      // if enemy is colliding with tower
      if (towercolliding) {
        // makes sure the enemy is colliding with the tower but doesn't overlap on the tower
        this.speed = 0.00001
        //deal damage to the tower based on the enemys damage per second
        health -= this.damage * 0.1
        //if the player has no more health 
        if (health < 0) {
          //makes sure that the players health cannot go below 0 
          health = 0
          //once player has no more health, then the player is "dead" so enable losing screen
          gameMode = "dead", buttons = deadButtons
        }
      }
    }
  }
}

































