import { LoadImageAsync } from "./Helper.js";
export class Obstacles {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * Math.random();
      this.collisionY = this.game.height * Math.random();
      this.collisionRadius = 60;
      this.image = null;
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 70;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
      LoadImageAsync('./all_project_images/obstacles.png',this)
    }
    update() {}
    draw(context) {
      if(this.image)
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
