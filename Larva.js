import { LoadImageAsync } from "./Helper.js";
export class Larva {
    constructor(game,x,y){
        this.game=game;
        this.collisionX=x;
        this.collisionY=y;
        this.collisionRadius=40;
        this.image=null;
        this.spriteWidth=150;
        this.spriteHeight=150;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.speedY=1+Math.random();
        this.markedForDeletion=false;
        LoadImageAsync('./all_project_images/Larva.png',this);      
    }
    
    draw(context){
        if(this.image)
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