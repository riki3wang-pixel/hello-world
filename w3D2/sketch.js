let dog1;
let dogSize = 100;
let filterIndex = 0; // 0: GRAY, 1: BLUR, 2: INVERT
let dogFiltered; // filtered copy of dog1 used for pointillism

function preload() {
  dog1 = loadImage('r11.png');
}

function setup() {
  createCanvas(800, 800);
  imageMode(CENTER);
  updateDogFiltered();
}

function draw() {
  background(173, 216, 230);
  
  if (!mouseIsPressed && keyIsDown(87)) { // 'w' controls size before mouse click
    dogSize += 5;
  }
  if (dogSize > 800) {
    dogSize = 100;
  }

  image(dogFiltered, 400, 400, dogSize, dogSize);
}

function mousePressed() {
  // cycle filters: GRAY -> BLUR -> INVERT -> GRAY ...
  filterIndex = (filterIndex + 1) % 3;
  updateDogFiltered();
}

function updateDogFiltered() {
  dogFiltered = dog1.get();
  if (filterIndex === 0) {
    dogFiltered.filter(GRAY);
  } else if (filterIndex === 1) {
    dogFiltered.filter(BLUR, 2);
  } else if (filterIndex === 2) {
    dogFiltered.filter(INVERT);
  }
}
