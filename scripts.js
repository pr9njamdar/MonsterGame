window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.font = '15px Helvetica';
  class Player {
    constructor(game) {
      // it will not create new instance of game but point
      //to the one which is already created
      this.game = game;
      this.collisionX = this.game.width * 0.6;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.dx = 0;
      this.dy = 0;
      this.speedX = 0;
      this.speedY = 0;
      this.image = document.getElementById("bull");
      this.speedModifier = 5;
      this.spriteHeight = 255;
      this.spriteWidth = 255;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX;
      this.spriteY = this.collisionY;
      this.frameX = 0;
      this.frameY = 1;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.spriteWidth,
        this.spriteHeight
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        // globalAlpha property to set opacity of the shapes we are drawing
        // to limit certain settings only to specific drwa calls we can wrap that drawing code
        // between save() and restore() built-in canvas method.
        context.save();
        /* save() method creates a snapshot of the current canvas state,
                including fillstyle,lineWidth,opacity(globalAlpha) as well as transformations and scaling
                */
        context.globalAlpha = 0.5;
        context.fill();
        // restor the settings henceforth.
        context.restore();
      }

      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const angle = Math.atan2(this.dy, this.dx);

      if (angle < -2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;
      else if (angle < -1.96) this.frameY = 7;

      if (this.collisionX < 0 + this.collisionRadius)
        this.collisionRadius = 0 + this.collisionRadius;

      if (this.collisionY < 200) this.collisionY = 200;

      if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;

      const distance = Math.hypot(this.dx, this.dy);

      if (distance > 50) {
        // Move only if the distance is greater than 1 to avoid shaking
        this.speedX = this.dx / distance;
        this.speedY = this.dy / distance;

        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
        this.spriteX = this.collisionX - this.width * 0.5;
      }
      this.spriteY = this.collisionY - this.height * 0.9;
      this.game.obstacles.forEach((obstacle) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, obstacle);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;

          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;

          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Obstacles {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * Math.random();
      this.collisionY = this.game.height * Math.random();
      this.collisionRadius = 60;
      this.image = document.getElementById("obstacles");
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 70;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }
    update() {}
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        // globalAlpha property to set opacity of the shapes we are drawing
        // to limit certain settings only to specific drwa calls we can wrap that drawing code
        // between save() and restore() built-in canvas method.
        context.save();
        /* save() method creates a snapshot of the current canvas state,
                including fillstyle,lineWidth,opacity(globalAlpha) as well as transformations and scaling
                */
        context.globalAlpha = 0.5;
        context.fill();
        // restor the settings henceforth.
        context.restore();
      }
    }
  }
  class Egg {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 40;
      this.margin = this.collisionRadius * 2;

      this.collisionX =
        this.margin + Math.random() * (this.game.width - this.margin * 2);
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height*0.9 - this.game.topMargin );

      this.spriteHeight = 110;
      this.spriteWidth = 135;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.4;
      this.spriteY = this.collisionY - this.height * 0.5 - 35;

      this.image = document.getElementById("egg");
      this.markedForDeletion=false;
      this.hatchTimer=0;
      this.hatchInterval=5000;
    }
    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY);
      if (this.game.debug) {
        const displayTimer=(this.hatchTimer*0.001).toFixed(0)
        context.fillText(displayTimer,this.spriteX,this.spriteY)
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        // globalAlpha property to set opacity of the shapes we are drawing
        // to limit certain settings only to specific drwa calls we can wrap that drawing code
        // between save() and restore() built-in canvas method.
        context.save();
        /* save() method creates a snapshot of the current canvas state,
                including fillstyle,lineWidth,opacity(globalAlpha) as well as transformations and scaling
                */
        context.globalAlpha = 0.5;
        context.fill();
        // restor the settings henceforth.
        context.restore();
      }
    }

    update(deltaTime) {
      // check collision for each object and player.
      let collisionObjects = [this.game.player, ...this.game.obstacles,...this.game.Enemy];
      collisionObjects.forEach((obj) => {
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, obj);
        if (collision) {
          // move the object accordingly...
          const unit_x = dx / distance;
          const unit_y = dy / distance;

          this.collisionX = obj.collisionX + (sumOfRadii + 2) * unit_x;
          this.collisionY = obj.collisionY + (sumOfRadii + 2) * unit_y;

          this.spriteX = this.collisionX - this.width * 0.4;
          this.spriteY = this.collisionY - this.height * 0.5 - 35;
        }
      });

      // // hatching
      if(this.hatchTimer > this.hatchInterval){
        this.game.hatchlings.push(new Larva(this.game,this.collisionX,this.collisionY))
        this.markedForDeletion=true;
        this.game.removeGameObjects()
      }
      else{
        this.hatchTimer+=deltaTime;
      }
    }
  }

  class Enemy{
    constructor(game){
        this.game=game;
        this.collisionX=this.game.width;
        this.collisionY=250+((this.game.height-100)*Math.random());
        this.speedX=Math.random()*3 +3;
        this.image=document.getElementById('enemy');
        this.spriteWidth=140;
        this.spriteHeight=260;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteY;
        this.spriteX;
        this.collisionRadius=40

    }
    draw(context){
        context.drawImage(this.image,this.spriteX,this.spriteY)
        if (this.game.debug) {
            context.beginPath();
            context.arc(
              this.collisionX,
              this.collisionY,
              this.collisionRadius,
              0,
              Math.PI * 2
            );
            // globalAlpha property to set opacity of the shapes we are drawing
            // to limit certain settings only to specific drwa calls we can wrap that drawing code
            // between save() and restore() built-in canvas method.
            context.save();
            /* save() method creates a snapshot of the current canvas state,
                    including fillstyle,lineWidth,opacity(globalAlpha) as well as transformations and scaling
                    */
            context.globalAlpha = 0.5;
            context.fill();
            // restor the settings henceforth.
            context.restore();
          }
    }
    update(){
        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.height*0.5-70;
        this.collisionX-=this.speedX;
        if(this.spriteX +this.width <0){
            this.collisionX=this.game.width;
            this.collisionY=250+((this.game.height-250)*Math.random());
            this.speedX=Math.random()*3 +0.5;
        }
        let collisionObjects=[this.game.player,...this.game.obstacles]
        collisionObjects.forEach((obstacle) => {
            let [collision, distance, sumOfRadii, dx, dy] =
              this.game.checkCollision(this, obstacle);
            if (collision) {
              const unit_x = dx / distance;
              const unit_y = dy / distance;
    
              this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
    
              this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
            }
          });
         
         
    }
  }

  class Larva {
    constructor(game,x,y){
        this.game=game;
        this.collisionX=x;
        this.collisionY=y;
        this.collisionRadius=40;
        this.image=document.getElementById('larva');
        this.spriteWidth=150;
        this.spriteHeight=150;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.speedY=1+Math.random();
        this.markedForDeletion=false;
        
    }

    draw(context){
        context.drawImage(this.image,0,0,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height);
    }
    update(){
        this.collisionY-=this.speedY;
        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.height*0.5;

        if(this.collisionY < this.game.topMargin-100){
          this.markedForDeletion=true;
          this.game.removeHatchlings();
          this.game.score++;
        }

        // collision with objects
        let collisionObjects=[this.game.player,...this.game.obstacles]
        collisionObjects.forEach((obstacle) => {
            let [collision, distance, sumOfRadii, dx, dy] =
              this.game.checkCollision(this, obstacle);
            if (collision) {
              const unit_x = dx / distance;
              const unit_y = dy / distance;
    
              this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
    
              this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
            }
          });

          // collision with larva
          this.game.Enemy.forEach(enemy=>{
            if(this.game.checkCollision(this,enemy)[0]){
              this.markedForDeletion=true;
              this.game.removeHatchlings();
              this.game.lostHatchlings++;
            }
          })
    }
  }

  class Game {
    constructor(canvas) {
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
      this.hatchlings=[];
      this.topMargin = 200;
      /* one of the keyfeatures of ES6 arrow functions is that they automatically inherit 
            the refrence to 'this' keyword from the parent scope   */

      this.gameObjects = [];
      this.Enemy=[];

      this.score=0;
      this.lostHatchlings=0;
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
    removeGameObjects(){
      this.Eggs=this.Eggs.filter(object=> !object.markedForDeletion)
      
    }
    removeHatchlings(){
      this.hatchlings=this.hatchlings.filter(object=>!object.markedForDeletion)
    }
    addEgg() {
      const newEgg = new Egg(this);
      this.Eggs.push(newEgg);
    }
    addEnemy(){
        this.Enemy.push(new Enemy(this))
    }
    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;

      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return [distance <= sumOfRadii, distance, sumOfRadii, dx, dy];
    }
    init() {

        for(let i=0;i<3;i++){
            this.addEnemy();            
        }
        console.log(this.Enemy)
      let attempts = 0;
      // brute-force optimize it
      while (this.obstacles.length < this.numberOfobstacles && attempts < 100) {
        let collision = false;
        let newObstacle = new Obstacles(this);
        this.obstacles.forEach((obstacle) => {
          const dx = newObstacle.collisionX - obstacle.collisionX;
          const dy = newObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);

          if (
            distance <
            obstacle.collisionRadius + 200 + newObstacle.collisionRadius
            
          ) {
            collision = true;
          }
        });
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
    render(context, deltaTime) {
      if (this.timer > this.interval) {
        //animate the next frame
        this.gameObjects = [...this.obstacles, ...this.Eggs, this.player,...this.Enemy,...this.hatchlings];
        // this.gameObjects.sort()
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      context.textAlign='left';
     
      context.fillText('Score'+this.score,25,50);
      context.restore();
    }
  }
  const game = new Game(canvas);
  game.init();
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;

    lastTime = timeStamp;

    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  // first call is made from here and then it continues calling itself from requestAnimationFrame, so initially if we don't pass the 0 here we will get first deltatime as NaN which can break the code.. so pass 0
  animate(0);
});
