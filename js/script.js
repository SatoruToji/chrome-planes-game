const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
let gameover = document.querySelector('gameover')

//images
let skyscraperImg = new Image()
skyscraperImg.src = '/images/140-150.png'
let planeImg = new Image()
planeImg.src = '/images/plane.png'
let helicopterImg = new Image()
helicopterImg.src = '/images/helicopter.png'

//parameters
const planeWidth = 200
const planeHeight = 100

const skyscraperWidth = 120
let skyscraperHeight

//spawn
let playerPosX = 100
let playerPosY = (canvas.height - planeHeight) / 2

let skyscraperPosX = canvas.width
let skyscraperPosY

let helicopterPosX = canvas.width / 2
let helicopterPosY = canvas.height / 2

skyscrapersArr = []
helicoptersArr = []

//control
let moveUp = false
let moveRight = false
let moveDown = false
let moveLeft = false
let planeSpeed = 2
let speedSkyscraperX = 2

let count = 0
let hdx = 1 //helicopterDirectionX
let hdy = 1 //helicopterDirectionY
let countHelicopters = 5

let reload = false

//drawing
function drawPlane() {
  ctx.beginPath()
  ctx.drawImage(planeImg, playerPosX, playerPosY, planeWidth, planeHeight)
  ctx.closePath()
}

//skyscraper
function createSkyscraper() {
  skyscrapersArr.push({
    x: skyscraperPosX,
    y: canvas.height - skyscraperHeight,
    width: skyscraperWidth,
    height: skyscraperHeight
  })
}
function drawSkyscraper() {
  for (let i = 0; i < skyscrapersArr.length; i++) {
    let s = skyscrapersArr[i]
    ctx.beginPath()
    ctx.drawImage(skyscraperImg, s.x, s.y, s.width, s.height)
    ctx.closePath()
    
    s.x -= speedSkyscraperX
  }
}
function deleteSkyscraper(){
  for(let i = skyscrapersArr.length - 1; i >= 0; i--){
    let s = skyscrapersArr[i]
    if(s.x + s.width < 0){
      skyscrapersArr.splice(i, 1)
    }
  }
}
function collisionSkyscraperDetect() {
  for (let s of skyscrapersArr) {
    if (
      playerPosX + planeWidth > s.x &&
      playerPosX < s.x + s.width &&
      playerPosY + planeHeight > s.y 
      //&& playerPosY < s.y + s.height
    ) {
      reload=true
    }
  }
}

//helicopter
//create helicopters
for(let i = 0; i < countHelicopters; i++){
  helicoptersArr.push({
    img: helicopterImg,
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 200,
    height: 100,
    hdx: (Math.random() * 2 - 1) * 0.5,
    hdy: (Math.random() * 2 - 1) * 0.5
  })
}
function drawHelicopter(helicopter){
  ctx.beginPath()
  ctx.drawImage(helicopter.img, helicopter.x, helicopter.y, helicopter.width, helicopter.height)
  ctx.closePath()
}
function collisionHelicopterDetect(helicopter){
  if(helicopter.x + helicopter.hdx > canvas.width - helicopter.width || helicopter.x + helicopter.hdx < 0){
    helicopter.hdx = -helicopter.hdx
  }
  if(helicopter.y + helicopter.hdy > canvas.height - helicopter.height || helicopter.y + helicopter.hdy < 0){
    helicopter.hdy = -helicopter.hdy
  }
  if(
    playerPosX < helicopter.x + helicopter.width &&
    playerPosX + planeWidth > helicopter.x &&
    playerPosY < helicopter.y + helicopter.height &&
    playerPosY + planeHeight > helicopter.y
  ){
    reload=true
  }
}

//main foo
function draw() {
  count++
  skyscraperHeight = (Math.random() > 0.5)? 150 : (Math.random() > 0.4)? 200 : 270
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlane()
  drawSkyscraper()
  deleteSkyscraper()
  collisionSkyscraperDetect()

  helicoptersArr.forEach((helicopter)=>{
    drawHelicopter(helicopter)
    collisionHelicopterDetect(helicopter)
    helicopter.x += helicopter.hdx
    helicopter.y += helicopter.hdy
  })

  if (count % 250 === 0 || count % 721 === 0) {
    createSkyscraper()
  }

  if(reload){
    helicoptersArr = []
    skyscrapersArr = []
  }
}

//control
function controlSwitch() {
  draw();

  if (moveUp) {
    playerPosY = Math.max(playerPosY - planeSpeed, 0);
  }
  else if (moveRight) {
    playerPosX = Math.min(playerPosX + planeSpeed, canvas.width - planeWidth);
  }
  if (moveDown) {
    playerPosY = Math.min(playerPosY + planeSpeed, canvas.height - planeHeight);
  } 
  else if (moveLeft) {
    playerPosX = Math.max(playerPosX - planeSpeed, 0);
  }
}

//start game
function startGame() {
  setInterval(controlSwitch, 1)
}

//control block
document.getElementById('start').addEventListener('click', function() {
  startGame();
  this.disabled = true;
})

document.addEventListener('keydown', function(e) {
  if (e.code === 'KeyW') {
    moveUp = true;
  } else if (e.code === 'KeyD') {
    moveRight = true;
  } else if (e.code === 'KeyS') {
    moveDown = true;
  } else if (e.code === 'KeyA') {
    moveLeft = true;
  }
})

document.addEventListener('keyup', function(e) {
  if (e.code === 'KeyW') {
    moveUp = false;
  } else if (e.code === 'KeyD') {
    moveRight = false;
  } else if (e.code === 'KeyS') {
    moveDown = false;
  } else if (e.code === 'KeyA') {
    moveLeft = false;
  }
})