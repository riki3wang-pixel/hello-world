let startY = 400;
let startX = 300;

let colorA = 0;
let colorB = 0;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background("rgb(43,43,150)");
  
  
  
  textSize(20);
  text("⭐",startX,startY);
  
  textSize(20);
  text("⭐",startX-100,startY+100);
  
  textSize(20);
  text("⭐",startX+100,startY+50);

  
  textSize(20);
  text("⭐",startX-150,startY+35);
  
  textSize(20);
  text("⭐",startX-240,startY+14);
  
  if (startY > 130) {
    startY -= 2
  }
  
  
  
}