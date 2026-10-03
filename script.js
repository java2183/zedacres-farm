const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mobileNavigation = window.matchMedia("(max-width: 900px)");

function closeMenu(returnFocus = false) {
  if (!menuToggle || !navigation) return;
  navigation.dataset.open = "false";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && navigation) {
  navigation.dataset.open = "false";

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    navigation.dataset.open = String(!isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a") && mobileNavigation.matches) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  mobileNavigation.addEventListener("change", () => closeMenu());
}

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const videoCards = document.querySelectorAll(".video-card");

for (const card of videoCards) {
  const video = card.querySelector(".gallery-video");
  const playButton = card.querySelector(".video-play-button");
  const poster = card.querySelector(".video-frame > img");
  const source = card.dataset.videoSrc?.trim();

  if (!video || !playButton || !poster || !source) continue;

  playButton.disabled = false;
  playButton.setAttribute("aria-label", `Watch ${video.getAttribute("aria-label")}`);
  playButton.querySelector(".video-status")?.remove();
  video.src = source;

  playButton.addEventListener("click", () => {
    poster.hidden = true;
    playButton.hidden = true;
    video.hidden = false;
    video.focus();
  });
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    }

    for (const item of galleryItems) {
      const matchesFilter = filter === "all"
        || (filter === "videos"
          ? item.classList.contains("video-card")
          : !item.classList.contains("video-card") && item.dataset.category === filter);
      item.hidden = !matchesFilter;
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());
