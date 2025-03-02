const API_KEY = "AHrpFbKEyFsgN4ga537F9ZMn";

const preview = document.getElementsByClassName("image-placeholder")[0];
const Imgview = document.getElementById("imgview");
const loading = document.getElementById("load");

function uploader() {
  const fileInput = document.getElementById("fileupload");
  fileInput.click();

  fileInput.onchange = function () {
    const file = fileInput.files[0];
    let text = document.getElementsByClassName("upload-button")[0];

    if (fileInput.files.length == 0) {
      text.innerHTML = "Upload Image";
    } else {
      text.innerHTML = "Image Uploaded Successfully!";
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        sessionStorage.setItem("originalImage", reader.result);
        sessionStorage.setItem("imageSrc", URL.createObjectURL(file));
        window.location.href = "page2.html";
      };
    }
  };
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("page2")) {
    const savedImageSrc = sessionStorage.getItem("imageSrc");
    const originalImage = sessionStorage.getItem("originalImage");
    const page2ImgView = document.getElementById("imgview");
    const loadingIndicator = document.getElementById("load");
    const downloadButton = document.querySelector(".download-button");
    
    if (savedImageSrc && page2ImgView) {
      page2ImgView.src = savedImageSrc;
      page2ImgView.classList.remove("hide");
      page2ImgView.classList.add("show");
      
      if (originalImage) {
        if (loadingIndicator) {
          loadingIndicator.style.display = "block";
        }
        removeBackground(originalImage);
      }
    }
    
    if (downloadButton) {
      downloadButton.addEventListener("click", function() {
        downloadImage();
      });
    }
  }
});

function removeBackground(imageData) {
  const base64Data = imageData.split(',')[1];
  const apiUrl = "https://api.remove.bg/v1.0/removebg";
  const formData = new FormData();
  formData.append("image_file_b64", base64Data);
  formData.append("size", "auto");
  formData.append("format", "auto");
  
  const loadingIndicator = document.getElementById("load");
  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }
  
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY
    },
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.blob();
  })
  .then(blob => {
    const resultImageUrl = URL.createObjectURL(blob);
    sessionStorage.setItem("resultImage", resultImageUrl);
    const imgView = document.getElementById("imgview");
    if (imgView) {
      imgView.src = resultImageUrl;
    }
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
  })
  .catch(error => {
    console.error("Error removing background:", error);
    if (loadingIndicator) {
      loadingIndicator.style.display = "none";
    }
    alert("Failed to remove background. Please try again.");
  });
}

function downloadImage() {
  const resultImage = sessionStorage.getItem("resultImage");
  
  if (resultImage) {
    const downloadLink = document.createElement("a");
    downloadLink.href = resultImage;
    downloadLink.download = "removed-background.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    alert("No processed image available for download.");
  }
}
