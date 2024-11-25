import { LoadImageAsync } from "./Helper.js";
import { Larva } from "./Larva.js";
export class Egg {
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

      this.image = null
      this.markedForDeletion=false;
      this.hatchTimer=0;
      this.hatchInterval=5000;

      LoadImageAsync('./all_project_images/egg.png',this)
    }
    draw(context) {
      if(this.image)
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
