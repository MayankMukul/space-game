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
  
  rectFromGameObject(){
    return {
      top : this.y,
      left : this.x,
      bottom : this.y + this.height,
      right : this.x + this.width
    };
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
    super(x, y); //call the parent class constructor to initialize it's properties
    this.type = "hero";
    this.height = 75;
    this.width = 99;
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
  }

    fire(){
      gameObjects.push(new Laser(this.x + 45, this.y - 10));
      this.cooldown = 500;
   
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id);
        }
      }, 200);
    }
    canFire() {
      return this.cooldown === 0;
    }
  
}

class Enemy extends GameObject{
  constructor(x,y){
    super(x,y);
    this.height = 50;
    this.width = 98;
    this.type = "Enemy";
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

class Laser extends GameObject {
  constructor(x, y) {
    super(x,y);
    this.width = 9;
    this.height = 33;
    this.type = 'Laser';
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100)
  }
}

let onekeydown = (e)=>{
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
  } else if(evt.keyCode === 32) {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
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

  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};

let heroImg, 
    enemyImg, 
    laserImg,
    canvas, ctx, 
    gameObjects = [], 
    hero, 
    lifeImg,
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

  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
  });
}



window.onload = async ()=>{
  canvas=document.getElementById("canvas");
  ctx=canvas.getContext('2d');
  // ctx.font = "30px Arial";
  // ctx.fillStyle = "red";
  // ctx.textAlign = "right";
  // ctx.fillText("show this on the screen", 0, 0);
  heroImg = await loadasset("player.png");
  enemyImg =await loadasset("enemyShip.png" );
  laserImg = await loadasset('laserRed.png');
  lifeImg = await loadasset("life.png");

  initGame();
  let gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateGameObjects();
    drawPoints();
    drawLife();
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


function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function updateGameObjects() {
  // console.log("UPDATE GAME");
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === "Laser");
// laser hit something
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });

  enemies.forEach(enemy => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  })

  gameObjects = gameObjects.filter(go => !go.dead);
}  

function drawLife() {
  // TODO, 35, 27
  const START_POS = canvas.width - 180;
  for(let i=0; i < hero.life; i++ ) {
    ctx.drawImage(
      lifeImg, 
      START_POS + (45 * (i+1) ), 
      canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  // ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height-20);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

