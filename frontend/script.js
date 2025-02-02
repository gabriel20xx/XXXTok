let page = 1; // Track the page number for fetching images
let currentIndex = 0; // Track the current visible image
let isTransitioning = false; // Flag for transition state
let isLoading = false; // Flag to prevent multiple fetches at once
const webpContainer = document.getElementById("webp-container");
const images = [];

// Load the first image and preload the next one
loadMoreContent(page);

// Function to load content
function loadMoreContent(page) {
  if (isLoading) return; // Prevent fetching while loading
  isLoading = true;

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

      // Add the image to the images array
      images.push(imgElement);

      // Append the first image to the container
      webpContainer.appendChild(imgElement);

      // Preload the next image
      preloadNextImage(page + 1);

      // Increment page after the image has been loaded
      page++;

      // Allow further interaction once the image is loaded
      isLoading = false;
    })
    .catch(error => {
      console.error("Error loading images:", error);
      isLoading = false;
    });
}

// Function to preload the next image without showing it
function preloadNextImage(nextPage) {
  let number = String(nextPage).padStart(5, "0");
  fetch(`https://xxxtok.gfranz.ch/media/ComfyUI_${number}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to preload next image");
      return response.blob();
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");
      imgElement.src = objectURL;
      imgElement.classList.add("webp", "preload");
      webpContainer.appendChild(imgElement); // Preload image in background
    })
    .catch(error => {
      console.error("Error preloading next image:", error);
    });
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
  if (isTransitioning || isLoading) return; // Prevent interaction during transition or fetch

  isTransitioning = true;

  // Hide current active image (if any)
  const currentImage = images[currentIndex];
  if (currentImage) {
    currentImage.classList.remove("active");
  }

  // Increment to show next image
  currentIndex++;
  
  if (currentIndex >= images.length) {
    // If we're at the last image, load the next image
    loadMoreContent(page);
  }

  // Show the next image
  const nextImage = images[currentIndex];
  if (nextImage) {
    nextImage.classList.add("active");
  }

  // Scroll to the next image immediately
  if (nextImage) {
    nextImage.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(() => {
    isTransitioning = false;
  }, 500); // Duration of the transition
}
