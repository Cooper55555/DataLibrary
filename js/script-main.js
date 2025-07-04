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
      url: "html/index-pokemon.html",
      description: "Explore an big Pokémon checklist with loads of functions!",
      image:
        "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcNFbsImBQ3y2IjHBuQge6ub_gvMHy5Gmv6A-PCzDGStQSmXq0f7fnYF04TMTlavmhAX5dsy3Bz3XrVaO6VLPK5lU7CSKFOR2g8udlhCzsoqDpPgjXh9cOx66bHtRPvLo1-c_Bq7Q?key=2W8eZpCKkz-n-CtGI6rZFUNp",
      keywords: ["Checklist"],
    },
    {
      name: "Roblox",
      url: "html/index-roblox.html",
      description: "Dive into Roblox games and info about that game!",
      image:
        "https://assets.telkomsel.com/public/2025-02/Serba-Serbi-Game-Roblox-Favorit-Anak-Jaman-Sekarang.jpg?VersionId=WgO11X.SaRD1R2umpzAMOCG6jnkJftFQ",
      keywords: ["Information"],
    },
    {
      name: "Valorant",
      url: "html/index-valorant.html",
      description: "Get the latest Valorant agent stats and weapon info!",
      image: "https://wallpapers.com/images/featured/valorant-agents-39zhmexxi0mmhhk9.jpg",
      keywords: ["Information"],
    },
    {
      name: "Minecraft",
      url: "html/index-minecraft.html",
      description: "Discover all the minecraft profiles and servers!",
      image: "https://staticg.sportskeeda.com/editor/2025/01/8827f-17376979472538-1920.jpg?w=640",
      keywords: ["Information"],
    },
    {
      name: "World Of Tanks",
      url: "html/index-wot.html",
      description: "Get more information about the tanks, maps and way more of the game!",
      image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1407200/e648ae1371233ebdd917a7917b66963a80cff0ae/capsule_616x353.jpg?t=1750951866",
      keywords: ["Information"],
    },
    {
      name: "Super Animal Royale",
      url: "html/index-sar.html",
      description: "Discover the awesome information of weapons, character prices and way more!",
      image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000030578/0044e12000898466f4f61a21a43d8343f68f976dd1d9ec784815a6862cfd311b",
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

const teamData = {
  lxzy: {
    name: "Lxzy",
    role: "Full Stack Dev",
    avatar: "https://cdn.discordapp.com/avatars/1233363061440512011/32ef183dcb2201179f442c77e8b8b7d8.webp?size=80",
    bio: "I'm a developer who builds modern web applications.",
    projects: ["DataLibrary Developer"],
    socials: {
      discord: "https://discord.com/users/1233363061440512011",
      github: "https://github.com/lxzyme?tab=repositories",
      project: "https://lxzy.dev"
    }
  },
  cooper: {
    name: "Cooper",
    role: "Full Stack Dev",
    avatar: "https://cdn.discordapp.com/avatars/1262336556966871101/702dde19270f61624786d9b89715bc48.webp?size=80",
    bio: "Founder of DataLibrary and dedicated to grow DataLibrary big.",
    projects: ["DataLibrary", "Fetch Websites", "Information Websites"],
    socials: {
      discord: "https://discord.gg/t5BGDzzSXg",
    }
  },
  bravo: {
    name: "Bravo",
    role: "Full Stack Dev",
    avatar: "https://cdn.discordapp.com/avatars/767630233926762526/db41dcad4626d6448477887e4b7f39d1.webp?size=80",
    bio: "Full Stack Dev crafting seamless web experiences with HTML, CSS, and JS. Always learning, always improving.",
    projects: ["API Fetcher", "Order Manager"],
    socials: {
      discord: "https://discord.com/users/767630233926762526",
    }
  },
  ampired: {
    name: "Ampired",
    role: "Frontend Dev",
    avatar: "https://cdn.discordapp.com/avatars/954342432416358420/8669e174f4e7595868723679806ad5e4.webp?size=80",
    bio: "Building responsive web interfaces with growing skills, creativity, and dedication to improvement.",
    projects: ["E-com Page", "CSS Animated Websites"],
    socials: {
      discord: "https://discord.com/users/954342432416358420",
      github: "https://github.com/ADGitLab?tab=repositories",
      project: "https://adgitlab.github.io/E-commercial-page-design-/"
    }
  },
  cpu: {
    name: "Cpu",
    role: "Frontend Dev",
    avatar: "https://cdn.discordapp.com/avatars/1173038204140650588/e9f3e7b938493b28477962783c3c6f0a.webp?size=80",
    bio: "C++ and Frontend developer",
    projects: ["Portfolio", "Forum", "ImGui Spoofer", "Counter Strike 2 Cheat"],
    socials: {
      discord: "https://discord.gg/watching",
      github: "https://github.com/maybecpu?tab=repositories"
    }
  },
  pepper: {
    name: "Pepper",
    role: "Frontend Dev",
    avatar: "https://cdn.discordapp.com/avatars/779231982470168597/40da386e0ad70596edfc3c14cc0dcc8a.webp?size=80",
    bio: "Bio coming soon...",
    projects: ["Checklist Website"],
    socials: {
      discord: "https://discord.com/users/779231982470168597",
    }
  },
  sugar: {
    name: "Sugar",
    role: "Frontend Dev",
    avatar: "https://cdn.discordapp.com/avatars/1383395562333929482/bba4a5cc613f32736a89b9902cc408bd.webp?size=80",
    bio: "Bio coming soon...",
    projects: ["API Fetcher"],
    socials: {
      discord: "https://discord.com/users/1383395562333929482",
    }
  }
};

function openTeamModal(memberId) {
  const member = teamData[memberId];
  if (!member) return;
  
  document.getElementById('modal-avatar').src = member.avatar;
  document.getElementById('modal-name').textContent = member.name;
  document.getElementById('modal-role').textContent = member.role;
  document.getElementById('modal-bio').textContent = member.bio;
  
  const projectsContainer = document.getElementById('modal-projects');
  projectsContainer.innerHTML = '';
  member.projects.forEach(project => {
    const tag = document.createElement('span');
    tag.className = 'project-tag';
    if (project === 'lxzy.dev') {
      const link = document.createElement('a');
      link.href = 'https://lxzy.dev';
      link.target = '_blank';
      link.textContent = project;
      link.style.color = 'white';
      link.style.textDecoration = 'underline';
      tag.appendChild(link);
    } else {
      tag.textContent = project;
    }
    projectsContainer.appendChild(tag);
  });
  
const socialsContainer = document.getElementById('modal-socials');
socialsContainer.innerHTML = '';

const iconMap = {
  discord: { prefix: 'fab', icon: 'discord' },
  github: { prefix: 'fab', icon: 'github' },
  project: { prefix: 'fa-solid', icon: 'code' },
};

Object.entries(member.socials).forEach(([platform, url]) => {
  const { prefix, icon } = iconMap[platform] || { prefix: 'fab', icon: platform };
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.className = `social-link ${platform}`;
  link.innerHTML = `<i class="${prefix} fa-${icon}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
  socialsContainer.appendChild(link);
});
  
  document.getElementById('team-modal').classList.remove('hidden');
}

function closeTeamModal() {
  document.getElementById('team-modal').classList.add('hidden');
}

window.onclick = function(event) {
  const modal = document.getElementById('team-modal');
  if (event.target === modal) {
    closeTeamModal();
  }
}

let count = localStorage.getItem('visitorCount');
if (!count) {
    count = 0;
}

// Convert to number and increment
count = Number(count) + 1;

// Save the new count back to localStorage
localStorage.setItem('visitorCount', count);

// Show count on the page
document.getElementById('visitor-count').textContent = count;