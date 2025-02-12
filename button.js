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
    textAlign(CENTER,CENTER)
    let textSizeVal =  min(windowWidth,windowHeight) * 0.05
    textSize(textSizeVal)
    fill("black")
    //creates an outline for the buttons 
    stroke(255)
    rect(this.x, this.y, this.width, this.height)
    noFill()
    //text for each button will be parsed in depending on the button
    text(this.text, this.x, this.y)
  }
}