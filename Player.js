import { LoadImageAsync } from "./Helper.js";

export class Player {
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
      this.image = null
      this.speedModifier = 5;
      this.spriteHeight = 255;
      this.spriteWidth = 255;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX;
      this.spriteY = this.collisionY;
      this.frameX = 0;
      this.frameY = 1;
      LoadImageAsync("./all_project_images/bull.png",this)
    }
    draw(context) {
      if(this.image)
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