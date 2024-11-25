import { LoadImageAsync } from "./Helper.js";

export class Enemy{
    constructor(game){
        this.game=game;
        this.collisionX=this.game.width;
        this.collisionY=250+((this.game.height-100)*Math.random());
        this.speedX=Math.random()*3 +3;
        this.image=null
        this.spriteWidth=140;
        this.spriteHeight=260;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteY;
        this.spriteX;
        this.collisionRadius=40
        LoadImageAsync("./all_project_images/toad.png",this)
    }
    draw(context){
      if(this.image)
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
