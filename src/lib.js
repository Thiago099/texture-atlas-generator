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

function drawIndexText(ctx, x, y,uvs){
    ctx.font = '20px sans-serif';
    const textString = uvs.length
    const textWidth = ctx.measureText(textString ).width;
    ctx.fillStyle = "#000000";
    ctx.fillText(textString , x+5+2, y+10+2);
    ctx.fillText(textString , x+5-2, y+10-2);
    ctx.fillText(textString , x+5-2, y+10+2);
    ctx.fillText(textString , x+5+2, y+10-2);
    ctx.fillStyle = "#ffff00";
    ctx.fillText(textString , x+5, y+10);
}
function createCanvasDownloadLink(canvas, fileName, text){
    var link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL()
    link.innerHTML = text
    document.getElementById("links").appendChild(link)
}
function createObjectDownloadLink(content, fileName, text){

    const blob = new Blob([JSON.stringify(content)], { type: 'text/plain' });

    var link = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    link.innerHTML = text
    document.getElementById("links").appendChild(link)
}
function renderImages(images, width, height, pad, size, textureCanvas, referenceCanvas){
    let x = pad
    let y = pad
    const ctx = textureCanvas.getContext("2d");
    const ctx2 = referenceCanvas.getContext("2d");
    const uvs = []

    for(let i = 0; i < images.length;i++){
        if(images[i] == null){
            continue
        }
        const [offsetX, offsetY, drawWidth, drawHeight] = fitSize(images[i], x, y, size)
        ctx.drawImage(images[i], offsetX, offsetY, drawWidth, drawHeight);
        ctx2.drawImage(images[i], offsetX, offsetY, drawWidth, drawHeight);

        drawIndexText(ctx2, x, y, uvs)

        uvs.push({
            u1: x / width,
            v1: y / height,
            u2: (x + size) / width,
            v2: (y + size) / height 
        })
        
        x += size + pad
        if(x+size>textureCanvas.width){
            x = 0
            y += size + pad
        }
    }
    document.getElementById("links").innerHTML = ""
    createCanvasDownloadLink(textureCanvas,"texture.png", "download texture")
    createCanvasDownloadLink(referenceCanvas,"reference.png", "download reference")
    createObjectDownloadLink(uvs, "metadata.json", "download metadata")
}

function Render(width, height, pad, size, textureCanvas, referenceCanvas, fileInput){
    textureCanvas.width = width
    textureCanvas.height = height
    referenceCanvas.width = width
    referenceCanvas.height = height
    const images = []
    for(const item of fileInput.files){
        images.push(loadImage(item))
    }
    Promise.all(images)
    .then((images)=>renderImages(images,width, height, pad, size, textureCanvas, referenceCanvas))
}

export {Render}