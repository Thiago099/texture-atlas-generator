import JSZip from "jszip"
function fitSize(image,x,y, size){
    const rectWidth = size;
    const rectHeight = size;

    // Get the original image dimensions
    const imgWidth = image.width;
    const imgHeight = image.height;

    // Calculate the aspect ratio of the image
    const imgAspectRatio = imgWidth / imgHeight;
    const rectAspectRatio = rectWidth / rectHeight;

    // Determine the dimensions of the image within the rectangle
    let drawWidth, drawHeight;
    if (imgAspectRatio > rectAspectRatio) {
        // Image is wider than the rectangle
        drawWidth = rectWidth;
        drawHeight = rectWidth / imgAspectRatio;
    } else {
        // Image is taller or fits exactly within the rectangle
        drawWidth = rectHeight * imgAspectRatio;
        drawHeight = rectHeight;
    }

    // Calculate the offsets to center the image
    const offsetX = x + (rectWidth - drawWidth) / 2;
    const offsetY = y + (rectHeight - drawHeight) / 2;

    return [offsetX, offsetY, drawWidth, drawHeight]
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof File)) {
            reject(new Error("Input must be a File object"));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                resolve();
            };
        };

        reader.onerror = () => {
            resolve();
        };

        reader.readAsDataURL(file);
    });
}

function drawIndexText(ctx, x, y,uvs, size){
    ctx.font = (size/3)+'px sans-serif';
    const textString = uvs.length
    ctx.textAlign = "start";
    ctx.textBaseline = "hanging";
    ctx.fillStyle = "#000000";
    ctx.fillText(textString , x+2, y+2);
    ctx.fillText(textString , x-2, y+2);
    ctx.fillText(textString , x-2, y+2);
    ctx.fillText(textString , x+2, y+2);
    ctx.fillStyle = "#ffff00";
    ctx.fillText(textString , x, y);
}
async function createCanvasDownloadLink(zip, canvas, fileName){
    zip.file(fileName, await new Promise(resolve=> canvas.toBlob(resolve)), {base64: true});

}
async function createObjectDownloadLink(zip, content, fileName){
    const blob = new Blob([JSON.stringify(content)], { type: 'text/plain' });
    zip.file(fileName, blob, {base64: true});
}
async function DownlaodZip(textureCanvas, referenceCanvas, uvs, exactUvs) {
    const zip = new JSZip();

    await createCanvasDownloadLink(zip, textureCanvas,"texture.png")
    await createCanvasDownloadLink(zip, referenceCanvas,"reference.png")
    await createObjectDownloadLink(zip, uvs, "chunkUvs.json")
    await createObjectDownloadLink(zip, exactUvs, "exactUvs.json")
    zip.generateAsync({ type: "blob" })
    .then(function (content) {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "files.zip"; 
      link.click(); 
    });
}
function renderImages(doScaleDown, doDownload, images, width, height, pad, size, textureCanvas, referenceCanvas){

    const scale = 1000 / ((width + height) / 2)

    if(doScaleDown){
        width*=scale
        height*=scale
        pad*=scale
        size*=scale
    }
    
    textureCanvas.width = width
    textureCanvas.height = height
    referenceCanvas.width = width
    referenceCanvas.height = height

    let x = pad
    let y = pad
    const ctx = textureCanvas.getContext("2d");
    const ctx2 = referenceCanvas.getContext("2d");
    ctx.clearRect(0,0,width,height)
    ctx2.clearRect(0,0,width,height)
    const chunckUvs = []
    const exactUvs = []

    for(let i = 0; i < images.length;i++){
        if(images[i] == null){
            continue
        }
        const [offsetX, offsetY, drawWidth, drawHeight] = fitSize(images[i], x, y, size)
        ctx.drawImage(images[i], offsetX, offsetY, drawWidth, drawHeight);
        ctx2.drawImage(images[i], offsetX, offsetY, drawWidth, drawHeight);

        drawIndexText(ctx2, x, y, chunckUvs, size)

        chunckUvs.push({
            u1: (x-pad) / width,
            v1: (y - pad) / height,
            u2: (x + size + pad) / width,
            v2: (y + size + pad) / height,
            aspectRatio: 1
        })

        exactUvs.push({
            u1: offsetX / width,
            v1: offsetY / height,
            u2: (x + drawWidth) / width,
            v2: (y + drawHeight) / height,
            aspectRatio: images[i].width / images[i].height
        })
        
        x += size + pad
        if(x+size>textureCanvas.width){
            x = 0
            y += size + pad
        }
    }
    if(doDownload){
        DownlaodZip(textureCanvas, referenceCanvas, chunckUvs, exactUvs)
    }

}

function Render(doScaleDown, doDownload, width, height, pad, size, textureCanvas, referenceCanvas, fileInput){

    const images = []
    for(const item of fileInput.files){
        images.push(loadImage(item))
    }
    Promise.all(images)
    .then((images)=>renderImages(doScaleDown, doDownload, images,width, height, pad, size, textureCanvas, referenceCanvas))
}

export {Render}