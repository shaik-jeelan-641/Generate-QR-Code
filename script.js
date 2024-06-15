const container = document.querySelector(".container");
const userInput = document.getElementById("placement");
const submitBtn = document.getElementById("generate");
const downloadBtn = document.getElementById("download-btn");
const sizeOptions = document.querySelector(".size");
const BGColor = document.getElementById("Color1");
const FGColor = document.getElementById("color2");

// Variables
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

  // Generate QR code on a temporary canvas
  const tempContainer = document.createElement("div");
  const QR_Code = await new QRCode(tempContainer, {
    text: userInput.value,
    width: sizeChoice,
    height: sizeChoice,
    colorDark: FGColorChoice,
    colorLight: BGColorChoice,
  });

  // Wait for QR code to render
  setTimeout(() => {
    const qrCanvas = tempContainer.querySelector("canvas");
    const qrSize = qrCanvas.width;
    const finalSize = qrSize * 1.2; // Increase size by 20%
    const offset = (finalSize - qrSize) / 2;

    // Create final canvas with white background
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalSize;
    finalCanvas.height = finalSize;
    const ctx = finalCanvas.getContext("2d");

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalSize, finalSize);

    // Draw QR code onto the white canvas
    ctx.drawImage(qrCanvas, offset, offset);

    // Append final canvas to container
    container.appendChild(finalCanvas);

    // Set url for download
    const src = finalCanvas.toDataURL("image/png");
    downloadBtn.href = src;

    // Set download button properties
    let userValue = userInput.value;
    try {
      userValue = new URL(userValue).hostname;
    } catch (_) {
      userValue = inputFormatter(userValue);
    }
    downloadBtn.download = `${userValue}QR`;
    downloadBtn.classList.remove("hide");
  }, 100);
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
