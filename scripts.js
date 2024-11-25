import { Egg } from "./Egg.js";
import { Enemy } from "./Enemy.js";
import { Player } from "./Player.js";
import { Obstacles } from "./Obstacles.js";


class Game {
  constructor(canvas,ctx) {
    this.ctx=ctx
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.mouse = {
      x: this.width * 0.5,
      y: this.width * 0.5,
      pressed: false,
    };
    this.numberOfobstacles = 5;
    this.obstacles = [];
    this.debug = false;

    // controlling the fps of the game
    this.fps = 70;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    // adding eggs to the canvas

    this.maxEggs = 10;
    this.Eggs = [];
    this.eggTimer = 0;
    this.eggInterval = 1500;
    this.hatchlings = [];
    this.topMargin = 200;
    /* one of the keyfeatures of ES6 arrow functions is that they automatically inherit 
          the refrence to 'this' keyword from the parent scope   */

    this.gameObjects = [];
    this.Enemy = [];

    this.score = 0;
    this.lostHatchlings = 0;
    // attach event listerners to canvas
    // listen to event s like mouse down and mouse move
    canvas.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });

    canvas.addEventListener("mouseup", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });
    window.addEventListener("keypress", (e) => {
      if (e.key === "d") this.debug = !this.debug;
    });
  }
  // function to remove the eggs from the canvas
  // if they have hatched successfully into larva.
  removeGameObjects() {
    this.Eggs = this.Eggs.filter((object) => !object.markedForDeletion);
  }


  removeHatchlings() {
    this.hatchlings = this.hatchlings.filter(
      (object) => !object.markedForDeletion
    );
  }
  addEgg() {
    const newEgg = new Egg(this);
    this.Eggs.push(newEgg);
  }
  addEnemy() {
    this.Enemy.push(new Enemy(this));
  }

  // helper function to check collision between two objects
  // returns [true/false , dist. , sum of radii , dx,dy for dirction calculation]
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;

    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return [distance <= sumOfRadii, distance, sumOfRadii, dx, dy];
  }


  init() {

    // first we add 3 enemies to the game.
    for (let i = 0; i < 3; i++) {
      this.addEnemy();
    }
    
    let attempts = 0;
    // brute-force optimize it
    // now we add obstacles to the game while making sure the obstacles 
    //are not overlapping with each other.
    while (this.obstacles.length < this.numberOfobstacles && attempts < 100) {
      let collision = false;
      let newObstacle = new Obstacles(this);
      this.obstacles.forEach((obstacle) => {
        const dx = newObstacle.collisionX - obstacle.collisionX;
        const dy = newObstacle.collisionY - obstacle.collisionY;
        const distance = Math.hypot(dy, dx);
        // check if the newly added obstacles position 
        if ( distance < obstacle.collisionRadius + 200 + newObstacle.collisionRadius ) {
          collision = true;
        }
      });
      // check if the obstacle fits in the given frame
      if (
        !collision &&
        newObstacle.spriteX > 0 &&
        newObstacle.spriteX < this.width - newObstacle.width &&
        newObstacle.spriteY > 150 &&
        newObstacle.spriteY < this.height - 10
      ) {
        this.obstacles.push(newObstacle);
      }
      attempts++;
    }
  }

  // in this method we store the objects in the game in an array
  // then one by one we call their draw and update method.
  render(context, deltaTime) {
    if (this.timer > this.interval) {
      //animate the next frame
      this.gameObjects = [
        ...this.obstacles,
        ...this.Eggs,
        this.player,
        ...this.Enemy,
        ...this.hatchlings,
      ];
      // this.gameObjects.sort()

      this.ctx.clearRect(0, 0,this.canvas.width, this.canvas.height);
      // this.obstacles.forEach((obstacle)=>{
      //     obstacle.draw(context);
      // })
      // draw eggs
      this.gameObjects.sort((a, b) => {
        return a.collisionY - b.collisionY;
      });
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(deltaTime);
      });

      this.timer = 0;
    }

    this.timer += deltaTime;

    // add eggs periodically
    if (this.eggTimer > this.eggInterval && this.Eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    context.save();
    context.textAlign = "left";

    context.fillText("Score : " + this.score, 25, 50);
    context.restore();
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.font = "15px Helvetica";

 const game = new Game(canvas,ctx);
  // initialize the game and load assets
  game.init();

  let lastTime = 0;

// ------- using request animation frame ---------  
   function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);

  }
  // first call is made from here and then it continues calling itself from requestAnimationFrame,
  // so initially if we don't pass the 0 here we will get first deltatime as NaN which can break the code.. so pass 0
  animate(0);

// ------- using async method await ---------
// const frameRate = 60; // Target frames per second
// const frameDelay = 1000 / frameRate; // Time per frame in milliseconds

// function animate() {
  
//     const currentTime = performance.now();
//     const deltaTime = currentTime - lastTime;

//     if (deltaTime >= frameDelay) {
//       lastTime = currentTime;
//       game.render(ctx, deltaTime);
//     }
    
//      setTimeout(animate, frameDelay);
    
  
// }
// lastTime = 0;
// animate();


// ------- using synchronus implementation ---------
//  lastTime = performance.now();
// const frameRate = 60; // Target frames per second
// const frameDelay = 1000 / frameRate; // Time per frame in milliseconds

// function animate() {
//   while (true) {
//     const currentTime = performance.now();
//     const deltaTime = currentTime - lastTime;

//     if (deltaTime >= frameDelay) {
//       lastTime = currentTime;    
//       game.render(ctx, deltaTime);
//     }
//   }
// }

// // Start the game loop
// animate();
});


