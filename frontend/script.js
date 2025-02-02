let page = 1;
let currentIndex = 0;
let isTransitioning = false;
const webpContainer = document.getElementById("webp-container");

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
      imgElement.style.transform = `translateY(${100 * currentIndex}vh)`;

      webpContainer.appendChild(imgElement);
      currentIndex++;
      page++;
    })
    .catch(error => console.error("Error loading images:", error));
}

// Load the first image
loadMoreContent(page);

// Swipe & Scroll Handling
let startY = 0;

window.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
  let endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) showNextImage(); // Swipe up
});

window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") showNextImage();
});

window.addEventListener("wheel", e => {
  if (e.deltaY > 0) showNextImage();
});

function showNextImage() {
  if (isTransitioning) return; // Prevent spam clicks
  isTransitioning = true;

  const images = document.querySelectorAll(".webp");

  if (currentIndex < images.length) {
    images.forEach((img, i) => {
      img.style.transform = `translateY(-${100 * currentIndex}vh)`;
    });

    if (currentIndex === images.length - 1) {
      loadMoreContent(page);
    }

    currentIndex++;
  }

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}
