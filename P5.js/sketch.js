// 定义全局变量
let balls = []; // 存储所有小球
let numBalls = 10; // 小球数量
let sphereRadius = 200; // 球体半径
let rotationX = 0; // X轴旋转角度
let rotationY = 0; // Y轴旋转角度
let rotationSpeed = 0.005; // 旋转速度

// 设置函数，在程序开始时运行一次
function setup() {
  // 创建画布
  createCanvas(800, 600, WEBGL);
  
  // 初始化小球
  for (let i = 0; i < numBalls; i++) {
    // 在球体内随机生成小球位置
    let r = random(0, sphereRadius * 0.8); // 小球到球心的距离
    let theta = random(0, PI); // 极角
    let phi = random(0, TWO_PI); // 方位角
    
    // 转换为笛卡尔坐标
    let x = r * sin(theta) * cos(phi);
    let y = r * sin(theta) * sin(phi);
    let z = r * cos(theta);
    
    // 随机生成小球速度
    let vx = random(-2, 2);
    let vy = random(-2, 2);
    let vz = random(-2, 2);
    
    // 创建小球对象并添加到数组
    balls.push(new Ball(x, y, z, vx, vy, vz, 15)); // 小球半径为15
  }
}

// 绘制函数，每帧运行一次
function draw() {
  // 设置背景色
  background(0);
  
  // 添加环境光
  ambientLight(60);
  // 添加定向光源
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // 旋转球体
  rotationX += rotationSpeed;
  rotationY += rotationSpeed;
  rotateX(rotationX);
  rotateY(rotationY);
  
  // 绘制透明球体
  noFill();
  stroke(255);
  strokeWeight(1);
  sphere(sphereRadius);
  
  // 更新和显示所有小球
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].display();
    
    // 检测小球之间的碰撞
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j]);
    }
  }
}

// 小球类
class Ball {
  constructor(x, y, z, vx, vy, vz, radius) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(vx, vy, vz);
    this.radius = radius;
    this.mass = radius; // 质量与半径成正比
  }
  
  // 更新小球位置和速度
  update() {
    // 更新位置
    this.position.add(this.velocity);
    
    // 检测与球体边界的碰撞
    let distanceFromCenter = this.position.mag();
    if (distanceFromCenter + this.radius > sphereRadius) {
      // 计算法向量（从球心指向小球中心的单位向量）
      let normal = this.position.copy().normalize();
      
      // 计算入射速度在法向量方向上的分量
      let dot = this.velocity.dot(normal);
      
      // 计算反射后的速度
      let reflection = p5.Vector.mult(normal, -2 * dot);
      this.velocity.add(reflection);
      
      // 将小球位置调整到球体内部
      let correction = p5.Vector.mult(normal, sphereRadius - distanceFromCenter - this.radius);
      this.position.add(correction);
      
      // 添加一些能量损失
      this.velocity.mult(0.9);
    }
  }
  
  // 检测与其他小球的碰撞
  checkCollision(other) {
    // 计算两球中心之间的距离
    let distance = p5.Vector.dist(this.position, other.position);
    let minDistance = this.radius + other.radius;
    
    // 如果距离小于两球半径之和，则发生碰撞
    if (distance < minDistance) {
      // 计算碰撞法向量（从this指向other的单位向量）
      let normal = p5.Vector.sub(other.position, this.position).normalize();
      
      // 计算相对速度
      let relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
      let velocityAlongNormal = relativeVelocity.dot(normal);
      
      // 如果小球正在远离，则不处理碰撞
      if (velocityAlongNormal > 0) return;
      
      // 计算碰撞后的速度（弹性碰撞）
      let e = 0.9; // 弹性系数
      let j = -(1 + e) * velocityAlongNormal;
      j /= 1/this.mass + 1/other.mass;
      
      let impulse = p5.Vector.mult(normal, j);
      
      // 更新两球的速度
      this.velocity.sub(p5.Vector.div(impulse, this.mass));
      other.velocity.add(p5.Vector.div(impulse, other.mass));
      
      // 防止小球重叠
      let overlap = minDistance - distance;
      let correction = p5.Vector.mult(normal, overlap * 0.5);
      this.position.sub(correction);
      other.position.add(correction);
    }
  }
  
  // 显示小球
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(255, 255, 0); // 黄色
    noStroke();
    sphere(this.radius);
    pop();
  }
}