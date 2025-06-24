document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const sectionToShow = btn.dataset.section;

      sections.forEach((section) => {
        if (section.id === sectionToShow) {
          section.style.display = "";
          section.classList.add("section-active");
        } else {
          section.style.display = "none";
          section.classList.remove("section-active");
        }
      });

      if (sectionToShow === "third-section") {
      }
    });
  });

  const links = [
    {
      name: "Pokemon",
      url: "https://cooper55555.github.io/PokeLibrary/",
      description: "Explore an big Pokémon checklist with loads of functions!",
      image:
        "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcNFbsImBQ3y2IjHBuQge6ub_gvMHy5Gmv6A-PCzDGStQSmXq0f7fnYF04TMTlavmhAX5dsy3Bz3XrVaO6VLPK5lU7CSKFOR2g8udlhCzsoqDpPgjXh9cOx66bHtRPvLo1-c_Bq7Q?key=2W8eZpCKkz-n-CtGI6rZFUNp",
      keywords: ["Checklist"],
    },
    {
      name: "Roblox",
      url: "https://cooper55555.github.io/RobloxLibrary/",
      description: "Dive into Roblox games and info about that game!",
      image:
        "https://assets.telkomsel.com/public/2025-02/Serba-Serbi-Game-Roblox-Favorit-Anak-Jaman-Sekarang.jpg?VersionId=WgO11X.SaRD1R2umpzAMOCG6jnkJftFQ",
      keywords: ["Information"],
    },
    {
      name: "Valorant",
      url: "https://cooper55555.github.io/ValorLibrary/",
      description: "Get the latest Valorant agent stats and weapon info!",
      image: "https://wallpapers.com/images/featured/valorant-agents-39zhmexxi0mmhhk9.jpg",
      keywords: ["Information"],
    },
    {
      name: "Minecraft",
      url: "https://cooper55555.github.io/MineLibrary/",
      description: "Discover all the minecraft profiles and servers!",
      image: "https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg?w=640",
      keywords: ["Information"],
    },
  ];

  const app = document.getElementById("app");
  const searchInput = document.getElementById("search");
  const keywordSelect = document.getElementById("keywordFilter");
  const filterBtn = document.getElementById("filterBtn");

  const container = document.createElement("div");
  container.className = "card-container";
  app.appendChild(container);

  let appliedKeyword = "";

  function renderCards(searchTerm = "", keyword = "") {
    container.innerHTML = "";

    const filtered = links.filter((link) => {
      const matchSearch = link.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKeyword = keyword === "" || link.keywords.includes(keyword);
      return matchSearch && matchKeyword;
    });

    if (filtered.length === 0) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }

    filtered.forEach(({ name, url, description, image }, index) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.style.animationDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <div class="card-glow"></div>
        <img src="${image}" alt="${name}" class="game-image" style="width:100%; max-width:300px; border-radius:8px"/>
        <h2 class="game-title">${name}</h2>
        <p class="game-description">${description}</p>
        <a href="${url}" target="_blank" class="game-link">
          <span>Visit ${name}</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      `;
      container.appendChild(card);
    });
  }

  renderCards();

  searchInput.addEventListener("input", () => {
    renderCards(searchInput.value, "");
  });

  filterBtn.addEventListener("click", () => {
    appliedKeyword = keywordSelect.value;
    renderCards(searchInput.value, appliedKeyword);
  });

  // === Stats Animation ===
  function animateStats() {
    // Removed since about section is now "coming soon" for the admin/owner to modify if wanted!
  }

  // === Add floating animation to team members ===
  const teamMembers = document.querySelectorAll('.team-member');
  teamMembers.forEach((member, index) => {
    member.style.animationDelay = `${index * 0.2}s`;
  });
});

// Modal toggle and dark mode logic remain unchanged
function toggleSectionVisibility(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = show ? "" : "none";
}

function toggleTCGSettingsModal() {
  const modal = document.getElementById("settings-modal-tcg");
  modal.classList.toggle("hidden");

  if (!modal.classList.contains("hidden")) {
    syncToggleWithDarkMode();
  }
}

const darkModeToggleModal = document.getElementById("darkModeToggleModal");

const savedDarkMode = localStorage.getItem("darkMode") === "enabled";
if (savedDarkMode) {
  document.body.classList.add("dark-mode");
  if (darkModeToggleModal) darkModeToggleModal.checked = true;
} else {
  if (darkModeToggleModal) darkModeToggleModal.checked = false;
}

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

function syncToggleWithDarkMode() {
  if (darkModeToggleModal) {
    darkModeToggleModal.checked = document.body.classList.contains("dark-mode");
  }
}