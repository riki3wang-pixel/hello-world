// 定义全局变量
let sunY; // 太阳的Y坐标
let sunSize = 80; // 太阳大小
let sunSpeed = 0.5; // 太阳上升速度
let trees = []; // 存储树的数组
let numTrees = 5; // 树的数量
let groundHeight; // 地面高度
let time = 0; // 用于树的摇曳效果

// 设置函数，在程序开始时运行一次
function setup() {
  // 创建画布
  createCanvas(800, 600);
  
  // 初始化太阳位置（画布底部以下）
  sunY = height + sunSize/2;
  
  // 设置地面高度
  groundHeight = height * 0.8;
  
  // 创建树
  for (let i = 0; i < numTrees; i++) {
    // 在地面上随机位置创建树
    let x = map(i, 0, numTrees-1, width*0.1, width*0.9) + random(-50, 50);
    trees.push({
      x: x,
      y: groundHeight,
      size: random(80, 120),
      branchAngle: random(0.3, 0.5)
    });
  }
}

// 绘制函数，每帧运行一次
function draw() {
  // 更新太阳位置
  sunY -= sunSpeed;
  if (sunY < -sunSize/2) {
    // 当太阳完全离开画面顶部时，重置到底部
    sunY = height + sunSize/2;
  }
  
  // 计算太阳高度比例（0表示在底部，1表示在顶部）
  let sunProgress = map(sunY, height + sunSize/2, -sunSize/2, 0, 1);
  
  // 绘制天空渐变背景
  drawSky(sunProgress);
  
  // 绘制太阳
  drawSun(sunProgress);
  
  // 绘制地面
  drawGround();
  
  // 绘制树
  time += 0.01; // 增加时间用于树的摇曳效果
  for (let tree of trees) {
    drawFractalTree(tree.x, tree.y, tree.size, -HALF_PI, tree.branchAngle, 5);
  }
}

// 绘制天空渐变背景
function drawSky(progress) {
  // 根据太阳位置计算天空颜色
  // 从深蓝色(夜晚)到浅蓝色(白天)再到带暖色调的亮白色(日出/日落)
  let skyTopColor, skyBottomColor;
  
  if (progress < 0.3) {
    // 夜晚到日出
    let t = map(progress, 0, 0.3, 0, 1);
    skyTopColor = lerpColor(color(10, 10, 40), color(40, 60, 120), t);
    skyBottomColor = lerpColor(color(20, 20, 50), color(200, 100, 50), t);
  } else if (progress < 0.7) {
    // 日出到正午
    let t = map(progress, 0.3, 0.7, 0, 1);
    skyTopColor = lerpColor(color(40, 60, 120), color(100, 150, 255), t);
    skyBottomColor = lerpColor(color(200, 100, 50), color(180, 220, 255), t);
  } else {
    // 正午到傍晚
    let t = map(progress, 0.7, 1, 0, 1);
    skyTopColor = lerpColor(color(100, 150, 255), color(40, 60, 120), t);
    skyBottomColor = lerpColor(color(180, 220, 255), color(200, 100, 50), t);
  }
  
  // 绘制渐变天空
  for (let y = 0; y < groundHeight; y++) {
    let inter = map(y, 0, groundHeight, 0, 1);
    let c = lerpColor(skyTopColor, skyBottomColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// 绘制太阳
function drawSun(progress) {
  // 根据太阳位置计算颜色
  let sunColor;
  if (progress < 0.3 || progress > 0.7) {
    // 日出或日落时太阳呈橙红色
    sunColor = color(255, 150, 50);
  } else {
    // 白天太阳呈黄白色
    sunColor = color(255, 255, 200);
  }
  
  // 绘制太阳光晕
  noStroke();
  for (let i = 5; i > 0; i--) {
    let alpha = map(i, 0, 5, 50, 150);
    fill(red(sunColor), green(sunColor), blue(sunColor), alpha);
    ellipse(width/2, sunY, sunSize * (1 + i * 0.2));
  }
  
  // 绘制太阳本体
  fill(sunColor);
  ellipse(width/2, sunY, sunSize);
}

// 绘制地面
function drawGround() {
  // 绘制地面
  noStroke();
  fill(30, 120, 30); // 绿色地面
  rect(0, groundHeight, width, height - groundHeight);
}

// 绘制分形树
function drawFractalTree(x, y, len, angle, branchAngle, depth) {
  if (depth === 0) return;
  
  // 计算树枝摇曳效果
  let windEffect = map(sin(time + x * 0.01), -1, 1, -0.05, 0.05);
  let thisAngle = angle + windEffect * (6 - depth); // 风的影响在顶部更明显
  
  // 计算树枝末端坐标
  let endX = x + len * cos(thisAngle);
  let endY = y + len * sin(thisAngle);
  
  // 根据深度设置树枝颜色和粗细
  if (depth > 3) {
    // 树干和主要分支
    strokeWeight(depth * 2);
    stroke(101, 67, 33); // 棕色
  } else {
    // 小树枝和叶子
    strokeWeight(depth);
    // 根据太阳位置调整叶子颜色
    let progress = map(sunY, height + sunSize/2, -sunSize/2, 0, 1);
    let leafColor = lerpColor(color(30, 100, 30), color(60, 150, 60), progress);
    stroke(leafColor);
  }
  
  // 绘制树枝
  line(x, y, endX, endY);
  
  // 递归绘制分支
  let newLen = len * 0.67; // 每个分支长度缩小
  drawFractalTree(endX, endY, newLen, thisAngle - branchAngle, branchAngle, depth - 1);
  drawFractalTree(endX, endY, newLen, thisAngle + branchAngle, branchAngle, depth - 1);
}

// 鼠标点击事件 - 重置太阳位置
function mousePressed() {
  sunY = height + sunSize/2; // 重置太阳到底部
}