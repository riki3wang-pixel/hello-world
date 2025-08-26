let sunRiseY = 400;

let skyColorN = 0;
let skyColorD = 0;

let birdX = 500;
let birdY = 100;


let space = 0;


  //function 设置的区域:

function press(){
  fill("space");
  circle(300,150,150);
}
 
    //a function for sky

function sky () {
  background(skyColorD,skyColorN,0);
} 

    //a function for sun
  
function sun () {
  fill(255, 135, 5, 60);
  strokeWeight(0);
  stroke(255, 135, 5, 60);
  circle(300, sunRiseY, 180);
  
  fill(255, 100, 0, 100);
  circle(300, sunRiseY, 140);
  
}

    //a function for mountains

function mountains() {
 
  
  fill(110, 50, 18);
  strokeWeight(0);
  triangle(200, 400, 520, 253, 800, 400);
  fill(110,95,20);
  triangle(200,400,520,253,350,400);  

  fill(150, 75, 0);
  triangle(-100, 400, 150, 200, 400, 400);
  fill(100, 50, 12);
  triangle(-100, 400, 150, 200, 0, 400); 

  fill(150, 100, 0);
  triangle(200, 400, 450, 250, 800, 400);
  fill(120, 80, 50);
  triangle(200, 400, 450, 250, 300, 400);

}
  
    //A function to draw trees

function tree(x,y,size) {
  // Draw a tree.
  fill(80,30,20);
  rect(x-size,y,size*2,size*6);
  fill(20,130,5);
  triangle(x-size*3,y,x,y-size*8,x+size*3,y)
}




    // a function for bird

function bird (birdX,birdY) {
  
  textSize(30);
  text("🦅",birdX,birdY);

}

    //function for grass
function grass(X,Y,Size) {
  stroke('#67D76B');
  strokeWeight(4);
  line(X,Y,X-Size/2,Y-Size,);
  line(X,Y,X,Y-Size*1.2);
  line(X,Y,X+Size/2,Y-Size);
}



    //a function to update variables



function setup() {
  createCanvas(600, 400);
}
function draw() {
  
  
  

  sky();
  
 
  
  //sun
  sun();
  
  //mountains
  mountains();
  
  
  
  //birds
  bird(birdX,birdY);
  birdX = birdX -5
  birdY = birdX
  
 
  
  //trees
  
  tree(150,320,10);
  tree(210, 320, 10);
  
  
 
   //grass
grass(400,355,30)
grass(430,355,30)
  
  //交互

  


  // reduce sunHeight by 2 until it reaches 130
  if (sunRiseY > 130) {
    sunRiseY -=2;
}
  // increase color variables by 4 or 1 during sunrise
  if (sunRiseY < 480) {
    skyColorD += 4;
    skyColorN += 1;
}
 

  
  //displays the x and y position of the mouse on the canvas
fill(255) //white text
strokeWeight(0);
text(`${mouseX}, ${mouseY}`, 20, 20);
  
 

  
  
function keyPressed(space) {
press();
  
  
}

  
}