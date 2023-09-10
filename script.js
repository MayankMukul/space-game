// let canvas = document.querySelector("#canvas1");
// var ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
// ctx.fillRect(0,0,150,100)

// const img = new Image()
// img.src = 'path';
// img.onload = ()=>{}


function loadasset(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

async function display (){
  const hero = await loadasset("player.png");
  const enemyShip = await loadasset("enemyShip.png");

  let canvas = document.querySelector("#canvas");
  var ctx = canvas.getContext("2d");

  ctx.drawImage(hero, canvas.width / 2 - 45, canvas.height - canvas.height / 4);

  const monster_number = 5;
  const monster_width = monster_number * 98;
  const start_x = (canvas.width - monster_width) / 2;
  const stop_x = start_x + monster_width;

  for (let x = start_x; x < stop_x; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) ctx.drawImage(enemyShip, x, y);
  }
}






class GameObject {
  constructor (x, y, type){
    this.x= x;
    this.y = y;
    this.type = type;
    this.dead = false;
    this.height = 0;
    this.width = 0;
    this.img = undefined;
  }

  draw(ctx){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

// class Movable extends GameObject{
//   constructor(x,y, type){
//     super(x,y, type);
//   }

//   moveto(x,y){
//     this.x = x;
//     this.y = y;
//   }
// }

class Hero extends GameObject{
  constructor(x,y){
    super(x,y); //call the parent class constructor to initialize it's properties
    this.type = "hero";
    this.height = 75;
    this.width = 99;
  }
}

class Enemy extends GameObject{
  constructor(x,y){
    super(x,y);
    this.height = 50;
    this.width = 98;
    this.type = "enemy";
    let id = setInterval(()=>{
      if(this.y <canvas.height - this.height)
       { this.y +=2 ;}
      else {
        console.log("stoped at",this.y)
        clearInterval(id);
      }
    },200)
  }
}

let onekeydown = (e)=>{
  console.log(e.keycode);
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40:console.log("arrow keys") // Arrow keys
    case 32:
      e.preventDefault();
      break; // Space
    default:
      break; // do not block other keys
  }
  
}
window.addEventListener("keydown",onekeydown)
 
window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  }
});

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
}

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
};

let heroImg, 
    enemyImg, 
    laserImg,
    canvas, ctx, 
    gameObjects = [], 
    hero, 
    eventEmitter = new EventEmitter();



function initGame() {
  gameObjects = [];
  createEnemies();
  createHero();

  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -= 10;
  });

  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 10;
  });

  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 10;
  });

  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 10;
  });
}



window.onload = async ()=>{
  canvas=document.getElementById("canvas");
  ctx=canvas.getContext('2d');
  heroImg = await loadasset("player.png") ;
  enemyImg =await loadasset("enemyShip.png" );
  laserImg = await loadasset('laserRed.png');

  initGame();
  let gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
  }, 100)

}


function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;

  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}


function createHero() {
  hero = new Hero(
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);
}


function drawGameObjects(ctx) {
  gameObjects.forEach(go => go.draw(ctx));
}