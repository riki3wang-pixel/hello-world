// 全局变量用于存储图像
let Dog2;
let particles = [];
const imgCenterX = 400;
const imgCenterY = 400;
const initialSize = 100;
let currentSize = initialSize;

function preload() {
  // 加载图像文件
  Dog2 = loadImage('r12.png');
}

function setup() {
  createCanvas(800, 800);
  imageMode(CENTER);
}

function draw() {
  background(0); // 黑色背景
  if (Dog2) {
    image(Dog2, imgCenterX, imgCenterY, currentSize, currentSize);
  }

  // 更新与绘制粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  // 检测点击是否在图片范围内（CENTER模式，动态大小）
  const half = currentSize / 2;
  const withinX = Math.abs(mouseX - imgCenterX) <= half;
  const withinY = Math.abs(mouseY - imgCenterY) <= half;
  if (Dog2 && withinX && withinY) {
    const col = get(mouseX, mouseY); // 颜色来自点击位置像素
    emitParticles(mouseX, mouseY, col, 40);
  }
}

function keyPressed() {
  if (key === 'w' || key === 'W') {
    currentSize += 20;
    if (currentSize > 500) {
      currentSize = initialSize;
    }
  }
}

function emitParticles(x, y, col, count) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, col));
  }
}

class Particle {
  constructor(x, y, colRGBA) {
    this.position = createVector(x, y);
    const angle = random(TWO_PI);
    const speed = random(1, 4);
    this.velocity = p5.Vector.fromAngle(angle).mult(speed);
    this.acceleration = createVector(0, 0.2); // 重力
    this.lifespan = 255;
    // 存储颜色（r,g,b,a）
    this.r = colRGBA[0];
    this.g = colRGBA[1];
    this.b = colRGBA[2];
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 4; // 生命周期衰减
  }

  isDead() {
    return this.lifespan <= 0;
  }

  show() {
    noStroke();
    fill(this.r, this.g, this.b, this.lifespan);
    circle(this.position.x, this.position.y, 6);
  }
}


