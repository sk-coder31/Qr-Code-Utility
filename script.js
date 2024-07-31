let val = '';
document.getElementById("input").addEventListener("input", function(e) {
    val = e.target.value;
    console.log("Input value changed:", val);
});
document.getElementById("get-data-url").addEventListener("click", function() {
    if (val.trim()) {
        QRCode.toCanvas(document.getElementById('qrcode-canvas'), val, function (error) {
            if (error) {
                console.error("QR code generation error:", error);
                alert('Failed to generate QR code');
                return;
            }
            console.log('QR code generated!');
            const canvas = document.getElementById('qrcode-canvas');
            const dataURL = canvas.toDataURL('image/png');
            console.log('Data URL:', dataURL);
            document.getElementById('qrcode-image').src = dataURL; 
        });
    } else {
        console.log('Please enter text to generate QR code.');
        alert('Please enter text to generate QR code.');
    }
});
const btn = document.querySelector(".qr-code-btn");
btn.addEventListener("click", function() {
    const dropdown = document.getElementById("displayover");
    dropdown.style.display = "block";
});
const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", function() {
    const dropdown = document.getElementById("displayover");
    dropdown.style.display = "none";
});

/////////// barcode section----------------------

const barcode = document.querySelector(".barcode-btn");
barcode.addEventListener("click", function() {
    const dropdown = document.getElementById("displayoverbarcode");
    dropdown.style.display = "block";
});
const closeBtnbarcode = document.querySelector(".close-btn-barcode");
closeBtnbarcode.addEventListener("click", function() {
    const dropdown = document.getElementById("displayoverbarcode");
    dropdown.style.display = "none";
});

document.getElementById('barcodeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const barcodeData = document.getElementById('barcodeData').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (barcodeData.trim() === "") {
        errorMessage.textContent = "Input cannot be empty. Please enter valid data.";
        return;
    }
    
    try {
        JsBarcode("#barcodeCanvas", barcodeData);
        errorMessage.textContent = ""; 
    } catch (error) {

    }
});

document.getElementById('download-barcode').addEventListener('click', function() {
    const canvas = document.getElementById('barcodeCanvas');
    const pngUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'barcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});





document.getElementById("download-qr").addEventListener("click", function() {
    const canvas = document.getElementById('qrcode-canvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'qrcode.png';
    link.click();
});
