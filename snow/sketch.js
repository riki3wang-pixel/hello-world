// 定义全局变量
let snowflakes = []; // 存储雪花的数组
let groundSnow = []; // 存储地面积雪的数组
let skyColor; // 天空颜色
let timeOfDay = 0; // 时间进度 (0-1循环)
let timeSpeed = 0.001; // 时间流逝速度
let windStrength = 0; // 风力强度
let windDirection = 1; // 风向 (1为右，-1为左)
let windChangeTimer = 0; // 风力变化计时器
let groundHeight; // 地面高度
let groundSegments = 20; // 地面分段数
let ground = []; // 地面数组
let maxSnowflakes = 250; // 最大雪花数量
let snowDistribution = []; // 雪花分布密度图

// 设置函数，在程序开始时运行一次
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 设置地面高度为画布高度的80%
  groundHeight = height * 0.8;
  
  // 初始化地面分段
  initGround();
  
  // 初始化雪花分布密度图 - 创建更自然的分布
  for (let i = 0; i < width; i += 10) {
    // 使用柏林噪声创建自然分布
    let noiseVal = noise(i * 0.01, frameCount * 0.001);
    snowDistribution.push(noiseVal);
  }
  
  // 创建初始雪花 - 使用分布密度图
  for (let i = 0; i < 150; i++) {
    let newFlake = createSnowflake();
    
    // 根据分布密度图调整初始位置
    let index = floor(random(snowDistribution.length));
    let densityFactor = snowDistribution[index];
    
    // 使用密度因子影响x位置
    newFlake.x = map(index, 0, snowDistribution.length - 1, 0, width) + 
                random(-20, 20) * densityFactor;
    
    // 随机y位置，但使其分布在整个画布高度
    newFlake.y = random(-50, height * 0.7);
    
    snowflakes.push(newFlake);
  }
}

// 初始化地面分段
function initGround() {
  // 清空地面数组
  ground = [];
  
  // 创建地面分段
  let segmentWidth = width / groundSegments;
  
  for (let i = 0; i <= groundSegments; i++) {
    let x = i * segmentWidth;
    let y = groundHeight + random(-5, 5); // 略微不平的地面
    ground.push({
      x: x,
      y: y,
      snowHeight: 0, // 积雪高度
      maxSnowHeight: random(20, 40) // 最大积雪高度
    });
  }
}

// 绘制函数，每帧重复运行
function draw() {
  // 更新时间
  updateTime();
  
  // 更新风力
  updateWind();
  
  // 绘制天空
  drawSky();
  
  // 更新和绘制雪花
  updateAndDrawSnowflakes();
  
  // 绘制地面和积雪
  drawGround();
}

// 更新时间
function updateTime() {
  timeOfDay += timeSpeed;
  if (timeOfDay > 1) {
    timeOfDay = 0;
  }
}

// 更新风力
function updateWind() {
  windChangeTimer -= 1;
  
  // 随机改变风力
  if (windChangeTimer <= 0) {
    // 设置新的风力和方向
    windStrength = random(0, 2);
    if (random() < 0.3) { // 30%的概率改变风向
      windDirection = -windDirection;
    }
    
    // 设置下一次风力变化的时间
    windChangeTimer = random(100, 300);
  }
}

// 绘制天空
function drawSky() {
  // 根据时间确定天空颜色
  let skyColors = getSkyColors(timeOfDay);
  
  // 创建渐变背景
  for (let y = 0; y < groundHeight; y++) {
    let inter = map(y, 0, groundHeight, 0, 1);
    let c = lerpColor(skyColors.top, skyColors.bottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// 根据时间获取天空颜色
function getSkyColors(time) {
  let topColor, bottomColor;
  
  if (time < 0.25) { // 日出 (0-0.25)
    // 从深蓝到淡蓝
    let t = map(time, 0, 0.25, 0, 1);
    topColor = lerpColor(color(20, 30, 70), color(135, 206, 235), t);
    bottomColor = lerpColor(color(70, 80, 120), color(200, 230, 255), t);
  } else if (time < 0.5) { // 正午 (0.25-0.5)
    // 从淡蓝到亮蓝
    let t = map(time, 0.25, 0.5, 0, 1);
    topColor = lerpColor(color(135, 206, 235), color(100, 180, 255), t);
    bottomColor = lerpColor(color(200, 230, 255), color(220, 240, 255), t);
  } else if (time < 0.75) { // 傍晚 (0.5-0.75)
    // 从亮蓝到深蓝
    let t = map(time, 0.5, 0.75, 0, 1);
    topColor = lerpColor(color(100, 180, 255), color(20, 30, 70), t);
    bottomColor = lerpColor(color(220, 240, 255), color(70, 80, 120), t);
  } else { // 夜晚 (0.75-1)
    // 保持深蓝
    topColor = color(20, 30, 70);
    bottomColor = color(70, 80, 120);
  }
  
  return { top: topColor, bottom: bottomColor };
}

// 创建雪花
function createSnowflake() {
  // 随机选择雪花类型 (0-3)
  let flakeType = floor(random(4));
  
  return {
    x: random(width),
    y: random(-100, -10),
    size: random(3, 8),
    speed: random(0.8, 3),
    wobble: random(0, PI * 2), // 摇摆初始相位
    wobbleSpeed: random(0.01, 0.05), // 摇摆速度
    meltSpeed: random(0.01, 0.03), // 融化速度
    rotation: random(0, PI * 2), // 旋转角度
    rotationSpeed: random(-0.02, 0.02), // 旋转速度
    opacity: random(180, 255), // 透明度
    type: flakeType, // 雪花类型
    arms: floor(random(4, 9)), // 雪花臂数 (4-8)
    detail: random(0.2, 0.5) // 雪花细节复杂度
  };
}

// 绘制精致的雪花
function drawDetailedSnowflake(x, y, size, rotation, type, arms, detail, opacity) {
  push();
  translate(x, y);
  rotate(rotation);
  
  noStroke();
  fill(255, 255, 255, opacity);
  
  if (type === 0) {
    // 简单六角形雪花
    drawSimpleSnowflake(size, arms);
  } else if (type === 1) {
    // 带分支的雪花
    drawBranchedSnowflake(size, arms, detail);
  } else if (type === 2) {
    // 星形雪花
    drawStarSnowflake(size, arms);
  } else {
    // 晶体雪花
    drawCrystalSnowflake(size, detail);
  }
  
  pop();
}

// 简单六角形雪花
function drawSimpleSnowflake(size, arms) {
  let armLength = size / 2;
  
  // 绘制主干
  for (let i = 0; i < arms; i++) {
    let angle = TWO_PI * i / arms;
    let x2 = cos(angle) * armLength;
    let y2 = sin(angle) * armLength;
    
    // 主干
    strokeWeight(size / 10);
    stroke(255);
    line(0, 0, x2, y2);
    
    // 小分支
    let branchLength = armLength * 0.4;
    let branchAngle1 = angle + PI / 6;
    let branchAngle2 = angle - PI / 6;
    
    let bx1 = x2 * 0.6 + cos(branchAngle1) * branchLength;
    let by1 = y2 * 0.6 + sin(branchAngle1) * branchLength;
    let bx2 = x2 * 0.6 + cos(branchAngle2) * branchLength;
    let by2 = y2 * 0.6 + sin(branchAngle2) * branchLength;
    
    strokeWeight(size / 15);
    line(x2 * 0.6, y2 * 0.6, bx1, by1);
    line(x2 * 0.6, y2 * 0.6, bx2, by2);
  }
  
  // 中心点
  noStroke();
  fill(255);
  ellipse(0, 0, size / 5);
}

// 带分支的雪花
function drawBranchedSnowflake(size, arms, detail) {
  let armLength = size / 2;
  
  for (let i = 0; i < arms; i++) {
    let angle = TWO_PI * i / arms;
    
    push();
    rotate(angle);
    
    // 主干
    strokeWeight(size / 12);
    stroke(255);
    line(0, 0, armLength, 0);
    
    // 分支
    let branchCount = floor(3 + detail * 2);
    let branchSpacing = armLength / (branchCount + 1);
    
    for (let j = 1; j <= branchCount; j++) {
      let branchX = j * branchSpacing;
      let branchLength = map(j, 1, branchCount, armLength * 0.3, armLength * 0.15);
      
      strokeWeight(size / 15);
      line(branchX, 0, branchX, branchLength);
      line(branchX, 0, branchX, -branchLength);
    }
    
    pop();
  }
  
  // 中心点
  noStroke();
  fill(255);
  ellipse(0, 0, size / 4);
}

// 星形雪花
function drawStarSnowflake(size, arms) {
  noStroke();
  
  // 外部点
  beginShape();
  for (let i = 0; i < arms * 2; i++) {
    let angle = TWO_PI * i / (arms * 2);
    let r = (i % 2 === 0) ? size / 2 : size / 4;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // 中心点
  fill(240);
  ellipse(0, 0, size / 3);
}

// 晶体雪花
function drawCrystalSnowflake(size, detail) {
  // 六边形晶体
  let hexSize = size * 0.4;
  
  // 内部六边形
  fill(240);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let x = cos(angle) * hexSize;
    let y = sin(angle) * hexSize;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // 外部结晶结构
  stroke(255, 255, 255, 200);
  strokeWeight(size / 20);
  
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let x1 = cos(angle) * hexSize;
    let y1 = sin(angle) * hexSize;
    let x2 = cos(angle) * size / 2;
    let y2 = sin(angle) * size / 2;
    
    line(x1, y1, x2, y2);
    
    // 添加小晶体分支
    let subBranches = floor(2 + detail * 4);
    for (let j = 1; j <= subBranches; j++) {
      let t = j / (subBranches + 1);
      let subX = lerp(x1, x2, t);
      let subY = lerp(y1, y2, t);
      
      let subAngle1 = angle + PI/3;
      let subAngle2 = angle - PI/3;
      let subLength = size * 0.1 * (1 - t);
      
      let sx1 = subX + cos(subAngle1) * subLength;
      let sy1 = subY + sin(subAngle1) * subLength;
      let sx2 = subX + cos(subAngle2) * subLength;
      let sy2 = subY + sin(subAngle2) * subLength;
      
      strokeWeight(size / 25);
      line(subX, subY, sx1, sy1);
      line(subX, subY, sx2, sy2);
    }
  }
}

// 更新和绘制雪花
function updateAndDrawSnowflakes() {
  // 根据鼠标位置添加新雪花
  if (mouseIsPressed && mouseY < height - 50) {
    for (let i = 0; i < 3; i++) {
      let newFlake = createSnowflake();
      newFlake.x = mouseX + random(-30, 30);
      newFlake.y = mouseY + random(-10, 10);
      snowflakes.push(newFlake);
    }
  }
  
  // 随机添加雪花 - 使分布更自然
  if (frameCount % 3 === 0 && snowflakes.length < maxSnowflakes) {
    // 计算当前雪花密度
    let density = snowflakes.length / maxSnowflakes;
    
    // 根据密度和风力调整添加概率
    if (random() > density * 0.8) {
      let newFlake = createSnowflake();
      
      // 使用密度图选择生成位置
      let index = floor(random(snowDistribution.length));
      let densityFactor = snowDistribution[index];
      
      // 更新密度图 - 使其随时间变化
      if (frameCount % 30 === 0) {
        snowDistribution[index] = noise(index * 0.01, frameCount * 0.001);
      }
      
      // 根据密度因子和风力调整生成位置
      let baseX = map(index, 0, snowDistribution.length - 1, 0, width);
      
      // 根据风力调整生成位置
      if (abs(windDirection * windStrength) > 0.3) {
        // 有明显风力时，从上风处生成更多雪花
        let windOffset = map(windDirection * windStrength, -1, 1, width * 0.3, -width * 0.3);
        baseX -= windOffset * densityFactor;
      }
      
      newFlake.x = baseX + random(-20, 20) * densityFactor;
      snowflakes.push(newFlake);
    }
  }
  
  // 绘制和更新所有雪花
  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let flake = snowflakes[i];
    
    // 更新雪花位置
    flake.y += flake.speed * (1 + sin(frameCount * 0.01) * 0.1); // 添加微小的速度变化
    flake.wobble += flake.wobbleSpeed;
    
    // 更新旋转
    flake.rotation += flake.rotationSpeed;
    
    // 添加风力影响 - 根据雪花大小调整风力影响
    let windEffect = windStrength * windDirection * (flake.size / 4) * map(flake.y, 0, height, 0.5, 1.2);
    flake.x += sin(flake.wobble) * 0.7 + windEffect; // 增加摇摆幅度
    
    // 绘制精致雪花
    drawDetailedSnowflake(
      flake.x, 
      flake.y, 
      flake.size, 
      flake.rotation, 
      flake.type, 
      flake.arms, 
      flake.detail, 
      flake.opacity
    );
    
    // 检查是否到达地面
    let groundY = getGroundYAt(flake.x);
    if (flake.y > groundY - flake.size/2) {
      // 添加到地面积雪
      addSnowToGround(flake.x, flake.size * 0.5);
      
      // 移除雪花
      snowflakes.splice(i, 1);
    }
    
    // 如果雪花飞出画布，移除
    if (flake.x < -50 || flake.x > width + 50) {
      snowflakes.splice(i, 1);
    }
  }
}

// 获取指定x位置的地面y坐标
function getGroundYAt(x) {
  // 找到x所在的地面分段
  let segmentWidth = width / groundSegments;
  let i1 = floor(x / segmentWidth);
  let i2 = min(i1 + 1, groundSegments);
  
  // 确保索引在有效范围内
  i1 = constrain(i1, 0, groundSegments - 1);
  
  // 如果是最后一个点，直接返回
  if (i1 == groundSegments) {
    return ground[i1].y - ground[i1].snowHeight;
  }
  
  // 计算两点之间的插值
  let t = (x - ground[i1].x) / segmentWidth;
  let y1 = ground[i1].y - ground[i1].snowHeight;
  let y2 = ground[i2].y - ground[i2].snowHeight;
  
  // 线性插值计算y值
  return lerp(y1, y2, t);
}

// 向地面添加积雪
function addSnowToGround(x, size) {
  // 找到x所在的地面分段
  let segmentWidth = width / groundSegments;
  let i = floor(x / segmentWidth);
  
  // 确保索引在有效范围内
  i = constrain(i, 0, groundSegments - 1);
  
  // 增加积雪高度
  let snowAmount = map(size, 3, 8, 0.1, 0.3);
  ground[i].snowHeight += snowAmount;
  
  // 限制最大积雪高度
  ground[i].snowHeight = min(ground[i].snowHeight, ground[i].maxSnowHeight);
  
  // 平滑相邻积雪
  smoothSnow(i);
}

// 平滑积雪
function smoothSnow(index) {
  // 确保有相邻点
  if (index > 0 && index < groundSegments) {
    // 获取当前点和相邻点的积雪高度
    let leftHeight = ground[index-1].snowHeight;
    let currentHeight = ground[index].snowHeight;
    let rightHeight = ground[index+1].snowHeight;
    
    // 如果当前点比相邻点高出太多，平滑处理
    if (currentHeight > leftHeight + 5) {
      let diff = (currentHeight - leftHeight) * 0.2;
      ground[index].snowHeight -= diff;
      ground[index-1].snowHeight += diff;
    }
    
    if (currentHeight > rightHeight + 5) {
      let diff = (currentHeight - rightHeight) * 0.2;
      ground[index].snowHeight -= diff;
      ground[index+1].snowHeight += diff;
    }
  }
  
  // 随时间融化积雪
  let meltRate = map(timeOfDay, 0, 0.5, 0.001, 0.01); // 白天融化更快
  if (timeOfDay > 0.5) {
    meltRate = map(timeOfDay, 0.5, 1, 0.01, 0.001); // 晚上融化变慢
  }
  
  for (let i = 0; i <= groundSegments; i++) {
    ground[i].snowHeight = max(0, ground[i].snowHeight - meltRate);
  }
}

// 绘制地面和积雪
function drawGround() {
  // 绘制地面
  fill(20, 20, 20); // 深黑色地面
  beginShape();
  vertex(0, height);
  for (let i = 0; i <= groundSegments; i++) {
    vertex(ground[i].x, ground[i].y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // 绘制积雪
  fill(255); // 白色积雪
  beginShape();
  for (let i = 0; i <= groundSegments; i++) {
    vertex(ground[i].x, ground[i].y - ground[i].snowHeight);
  }
  for (let i = groundSegments; i >= 0; i--) {
    vertex(ground[i].x, ground[i].y);
  }
  endShape(CLOSE);
}

// 窗口大小改变时调整画布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundHeight = height * 0.8;
  initGround();
}