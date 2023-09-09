// let canvas = document.querySelector("#canvas1");
// var ctx = canvas.getContext("2d");

// ctx.fillStyle = "black";
// ctx.fillRect(0,0,150,100)

// const img = new Image()
// img.src = 'path';
// img.onload = ()=>{}




function create_monster(){
  
}

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
    const hero = await  loadasset('player.png');
    const enemyShip = await loadasset('enemyShip.png');

    let canvas = document.querySelector("#canvas1");
    var ctx = canvas.getContext("2d");

    
    ctx.drawImage(hero, canvas.width / 2-45, canvas.height -canvas.height/4);
    // ctx.drawImage(enemyShip, 0, 0);
    // create_monster();

    const monster_number = 5;
  const monster_width = monster_number * 98;
  const start_x = (canvas.width - monster_width) / 2;
  const stop_x = start_x + monster_width;

  for (let x = start_x; x < stop_x; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) ctx.drawImage(enemyShip, x, y);
  }
}

display();

