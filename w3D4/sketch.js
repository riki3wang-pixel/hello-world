let dog;
let dogSize = 200;
let rotationAngle = 0;
let rippleRadius = 0;
let isMousePressed = false;

function preload() {
  dog = loadImage('r14.png');
}

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
  imageMode(CENTER);
}

function draw() {
  background(frameCount % 360, 80, 100);
  
  if (dog) {
    push();
    translate(400, 400);
    
    // 检查是否在放大镜区域 (X: 100-200, Y: 300-400)
    let inMagnifyRegion = mouseX >= 100 && mouseX <= 200 && mouseY >= 300 && mouseY <= 400;
    
    // 放大镜效果
    if (inMagnifyRegion) {
      scale(1.5);
    }
    
    // 鼠标按压时的旋转和涟漪效果
    if (isMousePressed) {
      rotationAngle += 0.1;
      rippleRadius += 2;
      
      // 绘制涟漪效果
      noFill();
      stroke(255, 100);
      strokeWeight(2);
      for (let i = 0; i < 3; i++) {
        circle(0, 0, rippleRadius - i * 20);
      }
    }
    
    // 应用旋转
    rotate(rotationAngle);
    
    // 基于鼠标位置的像素重新映射
    let mappedX = map(mouseX, 0, width, -50, 50);
    let mappedY = map(mouseY, 0, height, -50, 50);
    
    // 绘制图像
    image(dog, mappedX, mappedY, dogSize, dogSize);
    
    pop();
  }
}

function mousePressed() {
  isMousePressed = true;
  rippleRadius = 0;
}

function mouseReleased() {
  isMousePressed = false;
}

function keyPressed() {
  if (key === 'w' || key === 'W') {
    dogSize += 50;
    if (dogSize > 800) {
      dogSize = 200;
    }
  }
}


