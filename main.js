const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const result = document.getElementById('result');
let code_data;

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.play();
            scanWithJsQR();
        });
    } catch (err) {
        console.error("Error accssing camera: ", err);
    }
}

async function scanWithJsQR() {
    try {
        while (video.readyState === video.HAVE_ENOUGH_DATA) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                code_data = code.data;
                addContent(code_data);
                stopVideoStream();
                redirect(code_data);
                return;
            }
            await new Promise(requestAnimationFrame); 
        }
    } catch (err) {
        console.error("Error detecting QR code with jsQR: ", err);
        await new Promise(requestAnimationFrame); 
        await scanWithJsQR(); 
    }
}

function redirect(code_data) {
    const data = code_data.slice(0, 4);
    if (data === "http") {
        window.open(code_data);
    }
}


function stopVideoStream() {
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
}


function addContent(content) {
    const qrcontent = document.getElementById("qrcontent");
    const qrcontentAdd = document.querySelector(".qrcontent-js");
    qrcontent.style.display = "block";
    qrcontentAdd.innerHTML = `<h3>${content}</h3>`; 
}


document.addEventListener('DOMContentLoaded', () => {
    initCamera();
});

document.querySelector(".scanning").addEventListener("click", () => {
    console.log("Scanner");
    document.getElementById("qrcontent").style.display = "none";
    initCamera();
});


document.querySelector(".closebtn").addEventListener("click", () => {
    document.getElementById("qrcontent").style.display = "none";
});


document.querySelector(".uploading").addEventListener("click", () => {
    console.log("upload");
    document.querySelector(".imgupload").click();
});

document.querySelector(".imgupload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        stopVideoStream(); 
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
             
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);

              
                try {
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

                    if (qrCode) {
                        code_data = qrCode.data;
                        addContent(code_data);
                    } else {
                        document.getElementById("qrcontent").style.display = "none";
                        console.log("No QR Code found in the image.");
                        alert("No QR Code Found");
                    }
                } catch (err) {
                    console.error("Error processing the image data:", err);
                    alert("Error processing the image data");
                }
            };

            img.onerror = function() {
                console.error("Error loading the image.");
                alert("Error loading the image");
            };
        };

        reader.onerror = function() {
            console.error("Error reading the file.");
            alert("Error reading the file");
        };

        reader.readAsDataURL(file);
    }
});

