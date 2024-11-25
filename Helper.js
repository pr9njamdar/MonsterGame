// this file contains the helper functions like loading the assets etc.

function loadImage(src){
    return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject("Failed to load image from path "+src);
    img.src=src;
    })
}

export async function LoadImageAsync(src,Object){
    try{
      Object.image = await loadImage(src);
    }
    catch{
      console.log("Error while loading the image")
    }
  } 