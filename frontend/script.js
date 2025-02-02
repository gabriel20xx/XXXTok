let page = 1; // Track the page number for fetching images
let currentIndex = 0; // Track the current visible image
let isTransitioning = false;
const webpContainer = document.getElementById("webp-container");

// Load the first image
loadInitialContent();

function loadInitialContent {
  let number = 00001;
  fetch(`https://xxxtok.gfranz.ch/media/ComfyUI_${number}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load image");
      return response.blob();
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");

      imgElement.src = objectURL;
      imgElement.classList.add("webp");

      // Add the first image as visible
      if (webpContainer.children.length === 0) {
        imgElement.classList.add("active"); // First image should be visible
      }

      webpContainer.appendChild(imgElement);
      loadMoreContent(page+1);
    })
    .catch(error => console.error("Error loading images:", error));
}

function loadMoreContent(page) {
  let number = String(page).padStart(5, "0");
  fetch(`https://xxxtok.gfranz.ch/media/ComfyUI_${number}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to load image");
      return response.blob();
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");

      imgElement.src = objectURL;
      imgElement.classList.add("webp");

      webpContainer.appendChild(imgElement);
    })
    .catch(error => console.error("Error loading images:", error));
}

// Handle swipe & scroll
let startY = 0;

window.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
  let endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) showNextImage(); // Swipe up detected
});

window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") showNextImage();
});

window.addEventListener("wheel", e => {
  if (e.deltaY > 0) showNextImage();
});

function showNextImage() {
  if (isTransitioning) return;
  isTransitioning = true;

  const images = document.querySelectorAll(".webp");

  // If there are more images loaded, show the next one
  if (currentIndex < images.length - 1) {
    images[currentIndex].classList.remove("active");
    currentIndex++;
    images[currentIndex].classList.add("active");
    // Load the next image and increment the page number
    page++; // Increment the page number after loading the next image
    loadMoreContent(page);
  }

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}
