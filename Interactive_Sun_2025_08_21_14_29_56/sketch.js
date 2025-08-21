//定义关于太阳的自变量

let sunHeight;
let horizon = 300;

//关于草的自变量

let grandColor;

//分割线：global variables

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  
 
//注意code的order：
  
  sunHeight = mouseY;
  
  console.log(sunHeight < horizon)
  
  if(sunHeight < horizon){
  background("lightblue");
} else  { background(0);
  
}
  
  
  fill("yellow");
  stroke("yellow");
  circle(300,sunHeight,150);
  
  stroke("rgb(94,222,94)")
  line(0,horizon,600,horizon);
  
  fill("green")
  rect(0,horizon,600,horizon);
  
  grandColor = mouseY
  
  if (grandColor > horizon){
    
    fill("green")
    rect(0,horizon,600,horizon);
    
  } else{
    fill("rgb(86,226,86)")
    rect(0,horizon,600,horizon);
  }
  
  
  
}