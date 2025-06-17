const links = [
  { name: "Pokemon", url: "https://cooper55555.github.io/PokeLibrary/" },
  { name: "Roblox", url: "https://cooper55555.github.io/RobloxLibrary/" },
  { name: "Valorant", url: "https://cooper55555.github.io/ValorLibrary/" },
];

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const sectionId = btn.getAttribute("data-section");
      document.querySelectorAll(".section").forEach(section => {
        section.style.display = (section.id === sectionId) ? "" : "none";
        section.classList.toggle("active", section.id === sectionId);
      });
    });
  });

// Grab the main container
const app = document.getElementById("app");

// Get the search input from the HTML
const searchInput = document.getElementById("search");

// Create the button container
const container = document.createElement("div");
container.className = "region-buttons-container";

// Function to render buttons based on filter text
function renderButtons(filter = "") {
  container.innerHTML = ""; // clear existing buttons
  const filteredLinks = links.filter(({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );
  filteredLinks.forEach(({ name, url }) => {
    const button = document.createElement("button");
    button.className = "region-button";
    button.textContent = name;
    button.addEventListener("click", () => {
      if (url) window.location.href = url;
    });
    container.appendChild(button);
  });
}

// Initial render of all buttons
renderButtons();

// Listen for search input and update buttons in real-time
searchInput.addEventListener("input", (e) => {
  renderButtons(e.target.value);
});

// Append buttons container to app (search bar is already in HTML)
app.appendChild(container);

// Helper function to toggle visibility of a section by ID
function toggleSectionVisibility(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = show ? "" : "none";
}

// Modal toggle function
function toggleTCGSettingsModal() {
  const modal = document.getElementById("settings-modal-tcg");
  modal.classList.toggle("hidden");

  if (!modal.classList.contains("hidden")) {
    // Sync toggles or initialize modal state here
    syncToggleWithDarkMode();
  }
}

// Grab the dark mode toggle switch inside the modal
const darkModeToggleModal = document.getElementById("darkModeToggleModal");

// Initialize toggle based on saved preference
const savedDarkMode = localStorage.getItem("darkMode") === "enabled";
if (savedDarkMode) {
  document.body.classList.add("dark-mode");
  if (darkModeToggleModal) darkModeToggleModal.checked = true;
} else {
  if (darkModeToggleModal) darkModeToggleModal.checked = false;
}

// Listen for changes on the modal toggle and update dark mode accordingly
if (darkModeToggleModal) {
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

// Update modal toggle when opening modal to stay in sync
function syncToggleWithDarkMode() {
  if (darkModeToggleModal) {
    darkModeToggleModal.checked = document.body.classList.contains("dark-mode");
  }
}