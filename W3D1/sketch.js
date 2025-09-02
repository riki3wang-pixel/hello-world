// 全局变量 - 用于存储图像
let flower1;
let flower2;
let flower3;
let water;

// 花朵动画变量
let flowerY = 350;
let flowerSize = 20;

// 点彩画效果变量
let garden;

// preload() 函数 - 在setup()之前运行，用于加载图像等资源
function preload() {
    // 加载图像文件
    flower1 = loadImage('flower-1.png');
    flower2 = loadImage('flower-2.png');
    flower3 = loadImage('flower-3.png');
    water = loadImage('Water.gif');
}

// setup() 函数 - 程序开始时运行一次
function setup() {
    // 创建600x600像素的画布
    createCanvas(600, 600);
    
    // 创建garden图形对象
    garden = createGraphics(400, 400);
    garden.background(255);
    
    // 设置图像模式为中心对齐
    imageMode(CENTER);
    
    // 调整图像大小
    flower1.resize(100, 100);
    flower2.resize(100, 100);
    flower3.resize(100, 100);
    water.resize(50, 50);
    
    // 设置白色背景
    background(255);
}

// 绘制花茎函数
function drawStems() {
    stroke(139, 69, 19); // 棕色
    strokeWeight(5);
    
    // 绘制三条花茎，从底部连接到花朵位置
    line(100, 400, 100, flowerY);
    line(200, 400, 200, flowerY);
    line(300, 400, 300, flowerY);
}

// 点彩画效果函数
function paintFlower(img, x, y) {
    // 从图像中随机选择像素位置
    let randomX = random(img.width);
    let randomY = random(img.height);
    
    // 获取该位置的颜色
    let pixelColor = img.get(randomX, randomY);
    
    // 在garden图形对象上绘制随机大小的彩色点
    garden.fill(pixelColor);
    garden.noStroke();
    
    // 随机点大小(5-10像素)
    let dotSize = random(5, 10);
    
    // 点的位置基于原图像位置加上偏移量
    let offsetX = random(-20, 20);
    let offsetY = random(-20, 20);
    
    garden.ellipse(x + offsetX, y + offsetY, dotSize, dotSize);
}

// draw() 函数 - 持续运行，用于绘制动画
function draw() {
    // 设置白色背景
    background(255);
    
    // 绘制garden图形对象到画布上
    image(garden, 100, 100);
    
    // 绘制花茎
    drawStems();
    
    // 水平排列显示三朵花，使用flowerSize控制尺寸
    image(flower1, 100, flowerY, flowerSize, flowerSize);
    image(flower2, 200, flowerY, flowerSize, flowerSize);
    image(flower3, 300, flowerY, flowerSize, flowerSize);
}

// 鼠标按压检测函数
function mousePressed() {
    // 按压时花朵向上生长并增大尺寸
    flowerY -= 10; // 向上移动
    flowerSize += 5; // 增大尺寸
    
    // 为三朵花创建点彩效果
    paintFlower(flower1, 100, 200);
    paintFlower(flower2, 200, 200);
    paintFlower(flower3, 300, 200);
    
    // 检查生长限制
    if (flowerSize >= 100) {
        // 达到最大尺寸，重置
        flowerSize = 20;
        flowerY = 350;
    }
    
    if (flowerY <= 100) {
        // 达到最高位置，重置
        flowerSize = 20;
        flowerY = 350;
    }
}

// 键盘交互功能
function keyPressed() {
    // 当按下's'键时，保存5秒动画为GIF文件
    if (key === 's' || key === 'S') {
        saveGif('garden', 5);
        console.log('开始录制5秒GIF动画...');
    }
    
    // 当按下任意键时，清除点彩画层
    garden.clear();
    garden.background(255); // 重新设置白色背景
    console.log('点彩画层已清除');
}
