const container = document.querySelector(".container");
const userInput = document.getElementById("placement");
const submitBtn = document.getElementById("generate");
const downloadBtn = document.getElementById("download-btn");
const sizeOptions = document.querySelector(".size");
const BGColor = document.getElementById("Color1");
const FGColor = document.getElementById("color2");

// Variables
let QR_Code;
let sizeChoice = 100;
let BGColorChoice = "#000000";
let FGColorChoice = "#ffffff";

// Event listeners
sizeOptions.addEventListener("change", () => {
  sizeChoice = sizeOptions.value;
});

BGColor.addEventListener("input", () => {
  BGColorChoice = BGColor.value;
});

FGColor.addEventListener("input", () => {
  FGColorChoice = FGColor.value;
});

userInput.addEventListener("input", () => {
  if (userInput.value.trim().length < 1) {
    submitBtn.disabled = true;
    downloadBtn.href = "";
    downloadBtn.classList.add("hide");
  } else {
    submitBtn.disabled = false;
  }
});

// Functions
const inputFormatter = (value) => {
  value = value.replace(/[^a-z0-9A-Z]+/g, "");
  return value;
};

const generateQRCode = async () => {
  // Clear container
  container.innerHTML = "";

  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Calculate the new size (10% larger)
  const newSize = sizeChoice * 1.10;

  // Set canvas dimensions
  canvas.width = newSize;
  canvas.height = newSize;

  // Draw white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newSize, newSize);

  // Generate QR code
  const qrCanvas = document.createElement("canvas");
  new QRCode(qrCanvas, {
    text: userInput.value,
    width: sizeChoice,
    height: sizeChoice,
    colorDark: FGColorChoice,
    colorLight: BGColorChoice,
  });

  // Wait for QR code to be drawn
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Draw QR code onto the main canvas
  const qrImage = qrCanvas.querySelector("img");
  if (qrImage) {
    qrImage.onload = () => {
      ctx.drawImage(qrImage, (newSize - sizeChoice) / 2, (newSize - sizeChoice) / 2, sizeChoice, sizeChoice);

      // Append canvas to container
      container.appendChild(canvas);

      // Set url for download
      const src = canvas.toDataURL("image/png");
      downloadBtn.href = src;

      // Set download button properties
      let userValue = userInput.value;
      try {
        userValue = new URL(userValue).hostname;
      } catch (_) {
        userValue = inputFormatter(userValue);
      }
      downloadBtn.download = `${userValue}QR.png`;
      downloadBtn.classList.remove("hide");
    };
  } else {
    // Fallback for browsers that do not support canvas image generation
    const qrImageData = qrCanvas.toDataURL("image/png");
    const imgElement = document.createElement("img");
    imgElement.src = qrImageData;
    imgElement.onload = () => {
      ctx.drawImage(imgElement, (newSize - sizeChoice) / 2, (newSize - sizeChoice) / 2, sizeChoice, sizeChoice);

      // Append canvas to container
      container.appendChild(canvas);

      // Set url for download
      const src = canvas.toDataURL("image/png");
      downloadBtn.href = src;

      // Set download button properties
      let userValue = userInput.value;
      try {
        userValue = new URL(userValue).hostname;
      } catch (_) {
        userValue = inputFormatter(userValue);
      }
      downloadBtn.download = `${userValue}QR.png`;
      downloadBtn.classList.remove("hide");
    };
  }
};

// Initialize page
window.onload = () => {
  container.innerHTML = "";
  sizeOptions.value = sizeChoice;
  userInput.value = "";
  BGColor.value = BGColorChoice;
  FGColor.value = FGColorChoice;
  downloadBtn.classList.add("hide");
  submitBtn.disabled = true;
};

// Event listener for submit button
submitBtn.addEventListener("click", generateQRCode);
