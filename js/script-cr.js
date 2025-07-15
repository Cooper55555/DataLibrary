import { deck } from "../data/deck.js";

// ----- SECTION NAVIGATION -----
const navButtons = document.querySelectorAll(".nav-btn");
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const sectionId = btn.getAttribute("data-section");
    document.querySelectorAll(".section").forEach((section) => {
      section.style.display = section.id === sectionId ? "" : "none";
      section.classList.toggle("active", section.id === sectionId);
    });
  });
});

// ----- SETTINGS MODAL -----
const settingsIcons = document.querySelectorAll(".settings-icon");
const modal = document.getElementById("settings-modal-tcg");
const darkModeToggleModal = document.getElementById("darkModeToggleModal");

// Open/Close modal
function toggleTCGSettingsModal() {
  modal.classList.toggle("hidden");
  if (!modal.classList.contains("hidden")) {
    syncToggleWithDarkMode();
  }
}

// Sync toggle with current dark mode
function syncToggleWithDarkMode() {
  if (darkModeToggleModal) {
    darkModeToggleModal.checked = document.body.classList.contains("dark-mode");
  }
}

// Attach modal toggle to icon clicks
settingsIcons.forEach((icon) => {
  icon.addEventListener("click", toggleTCGSettingsModal);
});

// Close modal with the × button
const closeButton = document.querySelector(".close-button");
if (closeButton) {
  closeButton.addEventListener("click", toggleTCGSettingsModal);
}

// Dark mode handling
const savedDarkMode = localStorage.getItem("darkMode") === "enabled";
if (savedDarkMode) {
  document.body.classList.add("dark-mode");
}
if (darkModeToggleModal) {
  darkModeToggleModal.checked = savedDarkMode;

  darkModeToggleModal.addEventListener("change", () => {
    if (darkModeToggleModal.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

// ----- CARD CREATION -----
const cardContainer = document.querySelector(".card-container");

// Create pop-up Modal
const mod = document.createElement("div");
mod.className = "mod";
mod.innerHTML = `
  <div class="mod-content">
    <span class="close-btn">&times;</span>
    <div class="card-list"></div>
  </div>
`;
document.body.appendChild(mod);

const closeBtn = mod.querySelector(".close-btn");
const cardList = mod.querySelector(".card-list");

closeBtn.addEventListener("click", () => {
  mod.classList.remove("active");
});

// Create initial cards
function createCard() {
  cardContainer.innerHTML = deck
    .map(
      (data, index) => `
      <div class="card" data-index="${index}">
        <img src="${data.img}" alt="${data.name}" />
        <div class="info"><p>${data.name}</p></div>
      </div>
    `
    )
    .join(" ");

  // Add click event listeners
  document.querySelectorAll(".card").forEach((cardEl) => {
    cardEl.addEventListener("click", () => {
      const deckIndex = cardEl.dataset.index;
      const selectedDeck = deck[deckIndex];

      cardList.innerHTML = selectedDeck.cards
        .map(
          (card) => `
          <div class="popup-card">
            <img src="${card.pic}" alt="${card.title}" />
            <h3>${card.level}</h3>
            <div class="info">
             <p class="pop-up-title">${card.title}</p>
             <div><img src="${card.dmgImg}" alt="${card.title}" />+${card.dmg}</div>
            </div>
          </div>
        `
        )
        .join("");

      mod.classList.add("active");
    });
  });
}

// ----- INIT -----
createCard();