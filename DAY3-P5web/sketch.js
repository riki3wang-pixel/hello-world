//custom variable for x coordinate of cloud
let snowOneY = 50;


let bloomOneX= 13;
let bloomOneY= 100;



function setup() {
  // 在default代码中更改了画布大小
  createCanvas(600, 400);
}

function draw() {
  
  frameRate(15); //set frame rate to 15
  //尝试颜色，需要知道不同颜色的code
  background(color('hsl(191,68%,77%)'));
  //雪花
  fill("white");//雪花颜色
  
  stroke("white");//边框颜色
  
  circle(500,snowOneY,10);
  
  
  fill("white");//雪花颜色
  
  stroke("white");//边框颜色
  
  circle(450,snowOneY + 20,10);
  
  
  fill("white");//雪花颜色
  
  stroke("white");//边框颜色
  
  circle(300,snowOneY - 20,10);
  
  //sets the x coordinate to the frame count
//resets at left edge
snowOneY = frameCount % width
  
  fill("white");//雪花颜色
  
  stroke("white");//边框颜色
  
  circle(400,snowOneY,10);
  
  snowOneY = frameCount % width
  
  //怎么重复一个循环，然后变量随频数变化？
  
  


  
  fill("black");//地颜色
  
  rect(0, 300, 600, 200);
  
  fill("white");//雪地颜色
  
  rect(0, 300, 600, 50);
  
  textSize(70);
  
  text("🌳",0,300);
  
  text("🌳",100,300);
  
  text("🌳",100,300);
  text("🌳",200,300);
  text("🌳",300,300);
  text("🌳",400,300);
  text("🌳",500,300);
  
  textSize(50);
  text("🌝",mouseX,mouseY);
  
    //horizantal moving
  
  
  frameRate(80);
  textSize(35)
  text("🎈",bloomOneX,bloomOneY,bloomOneX + 50,bloomOneY + 50);
  
  bloomOneX = frameCount % width
  
  bloomOneY = frameCount % width

  //displays the x and y position of the mouse on the canvas
  fill(200) //white text
  textSize(20);
  text(`${mouseX}, ${mouseY}`, 20, 20);
  
}