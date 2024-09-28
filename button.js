class Button {
  constructor(text, x, y, w, h, click) {
    this.x = x
    this.y = y
    this.text = text
    this.width = w
    this.height = h
    this.click = click
    //can button be clicked by the player?
    this.enabled = true
  }
  clicked() {
    //if the button can be clicked
    if (this.enabled) {
      //if current mouse position is within the buttons area
      if (mouseX > this.x - this.width / 2 && mouseX < this.x + this.width / 2 && mouseY > this.y - this.height / 2 && mouseY < this.y
        + this.height / 2) {
        // button is clicked by the player
        this.click()
      }
    }
  }
  render() {
    rectMode(CENTER)
    //makes sure text is in middle of button 
    textAlign(CENTER)
    fill("black")
    //fill button in as black
    
    //creates an outline for the buttons 
    stroke(255)
    rect(this.x, this.y, this.width, this.height)
    noFill()
    //adjusts text size in button 
    textSize(30)
    //text for each button will be parsed in depending on the button
    if (this.text === "Increase Health") {
      fill("white")
      textSize(25)
      text(this.text, this.x, this.y + 10)
    }else{
    text(this.text, this.x, this.y + 10)
    }
  }
}