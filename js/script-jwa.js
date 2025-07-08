document.addEventListener("DOMContentLoaded", () => {

  loadCaughtStatus();
  applyDarkMode();

  const lastViewKey = localStorage.getItem("lastViewKey");
  const lastViewFilter = localStorage.getItem("lastViewFilter") || "all";

  if (lastViewKey && dinosaurs[lastViewKey]) {
    renderCollection(lastViewKey, lastViewFilter);
  } else {
    goHome();
  }
});

function insertRegionTitles(dinosaur, regionBreaks) {
  const clonedData = [...dinosaur.data];
  regionBreaks
    .filter(({ index }) => index <= clonedData.length)
    .slice()
    .reverse()
    .forEach(({ name, index }) => {
      clonedData.splice(index, 0, {
        name: `${name} Region`,
        number: "",
        img: "",
        isRegionTitle: true,
      });
    });
  dinosaur.data = clonedData;
}

const currentFilter = {};
const currentSearch = {};
const selectedRegion = {};

function goHome() {
  localStorage.removeItem("lastViewKey");
  localStorage.removeItem("lastViewFilter");

  const app = document.getElementById("app");

  app.innerHTML = `
    <nav class="navbar">
      <a href="https://www.datalibrary.online/" class="navbar-logo">
        <div class="logo-container">
          <i class="fas fa-database logo-icon"></i>
          <span class="logo-text">DataLibrary</span>
        </div>
      </a>
      <div class="navbar-links">
        <button class="nav-btn active" data-section="pogo">
          <i class="fas fa-solid fa-hippo"></i>
          <span>DINO</span>
        </button>
        <i class="fas fa-cog settings-icon" onclick="toggleModal()"></i>
      </div>
    </nav>
    
    <div id="pogo" class="section">
      <div class="hero-section">
        <h1 class="main-title">Jurassic World Alive Collection</h1>
        <p class="hero-subtitle">Track your dinosaur journey across all regions and forms</p>
      </div>

      <div class="collections">
        ${Object.entries(dinosaurs).map(([key, dex]) => `
          <div class="collection-card" onclick="renderCollection('${key}')">
            <div class="card-glow"></div>
            <div class="card-icon">🦖</div>
            <div class="card-content">
              <h2>${dex.title}</h2>
              <p>${getCaughtCount(dex.data)} / ${dex.total} (${getPercentage(dex.data)}%)</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="copyright-container">
      <h5>© 2025 DataLibrary. This website has been made by Cooper.</h5>
    </div>

    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <span class="close-button" onclick="toggleModal()">×</span>
        <h2>Settings</h2>

        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" class="dark-mode-toggle" onchange="toggleDarkMode()">
            <span class="slider"></span>
          </label>
          <span>Dark Mode</span>
        </div>

        <div class="social-button-container">
          <a href="https://discord.gg/t5BGDzzSXg" target="_blank" class="social-button discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://median.co/share/pkbddj#apk" target="_blank" class="social-button android">
            <i class="fab fa-android"></i>
          </a>
        </div>

        <div class="counter-container">
          <h5 class="countertext">Your Visitor Counter:</h5>
          <div id="visitor-count">0</div>
        </div>
      </div>
    </div>
  `;

  let count = localStorage.getItem('visitorCount');
  if (!count) count = 0;
  count = Number(count) + 1;
  localStorage.setItem('visitorCount', count);

  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    visitorCountEl.textContent = count;
  }

  setupNavigation();
  applyDarkMode();
}

function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const sectionToShow = btn.getAttribute("data-section");
      document.querySelectorAll(".section").forEach(section => {
        section.style.display = (section.id === sectionToShow) ? "" : "none";
      });
    });
  });
}

function renderCollection(key, filter = "all") {
  const collection = dinosaurs[key];
  if (!collection) return;

  localStorage.setItem("lastViewKey", key);
  localStorage.setItem("lastViewFilter", filter);

  const app = document.getElementById("app");
  currentFilter[key] = filter;
  const searchTerm = currentSearch[key]?.toLowerCase() || "";

  const filteredList = collection.data.filter(item => {
    if (item.isRegionTitle) return true;
    const matchesFilter = 
      filter === "have" ? item.caught :
      filter === "need" ? !item.caught :
      filter === "favorite" ? item.favorite :
      true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                         (item.number && item.number.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  app.innerHTML = `
    <nav class="navbar">
      <a href="https://www.datalibrary.online/" class="navbar-logo">
        <div class="logo-container">
          <i class="fas fa-database logo-icon"></i>
          <span class="logo-text">DataLibrary</span>
        </div>
      </a>
      <div class="navbar-links">
        <button class="back-button" onclick="goHome()">
          <i class="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <i class="fas fa-cog settings-icon" onclick="toggleModal()"></i>
      </div>
    </nav>
    
    <div class="hero-section">
      <h1 class="main-title">${collection.title}</h1>
      <h2 class="collection-counter">(${getCaughtCount(collection.data)} / ${collection.total})</h2>
    </div>
    
    <div class="filter-bar">
      <button class="${filter === 'all' ? 'active' : ''}" onclick="renderCollection('${key}', 'all')">All</button>
      <button class="${filter === 'have' ? 'active' : ''}" onclick="renderCollection('${key}', 'have')">Have</button>
      <button class="${filter === 'need' ? 'active' : ''}" onclick="renderCollection('${key}', 'need')">Need</button>
      <button class="${filter === 'favorite' ? 'active' : ''}" onclick="renderCollection('${key}', 'favorite')">Favorite</button>
    </div>
    
    <div class="search-bar">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input id="search-${key}" type="text" placeholder="Search Dinosaur..." />
      </div>
    </div>
    
    <div class="collection-grid">
      ${filteredList.map((item) => {
        if (item.isRegionTitle) {
          return `<div class="region-title">${item.name}</div>`;
        }

        return `
          <div class="item-card ${item.caught ? 'caught' : ''}" onclick="toggleCaught('${key}', '${item.number}', this)">
            <img src="${item.img}" alt="${item.name}" loading="lazy" />
            <div class="item-name">${item.name}</div>
            <div class="item-number">${item.number || ''}</div>
            <div class="checkmark ${item.caught ? '' : 'hidden'}"><i class="fas fa-check"></i></div>
            <div class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite('${key}', '${item.number}', this)">
              <i class="${item.favorite ? 'fas fa-star' : 'far fa-star'}"></i>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="copyright-container">
      <h5>© 2025 DataLibrary. This website has been made by Cooper.</h5>
    </div>

    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <span class="close-button" onclick="toggleModal()">×</span>
        <h2>Settings</h2>
        <button class="download-button" onclick="downloadPDF('${key}')">
          <i class="fas fa-download"></i>
          Download PDF
        </button>
      </div>
    </div>
  `;

  setupSearch(key);
  updateCounter(collection);
}

function setupSearch(key) {
  const searchInput = document.getElementById(`search-${key}`);
  if (!searchInput) return;

  searchInput.value = currentSearch[key] || "";

  searchInput.addEventListener("input", (e) => {
    currentSearch[key] = e.target.value;
    updateFilteredItems(key);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
}

function updateFilteredItems(key) {
  const collection = dinosaurs[key];
  if (!collection) return;

  const searchTerm = (currentSearch[key] || "").toLowerCase();
  const filter = currentFilter[key] || "all";

  const filteredList = collection.data.filter(item => {
    if (item.isRegionTitle) return true;
    const matchesFilter =
      filter === "have" ? item.caught :
      filter === "need" ? !item.caught :
      filter === "favorite" ? item.favorite :
      true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                          (item.number && item.number.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const grid = document.querySelector(".collection-grid");
  if (!grid) return;

  grid.innerHTML = filteredList.map(item => {
    if (item.isRegionTitle) {
      return `<div class="region-title">${item.name}</div>`;
    }

    return `
      <div class="item-card ${item.caught ? 'caught' : ''}" onclick="toggleCaught('${key}', '${item.number}', this)">
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
        <div class="item-name">${item.name}</div>
        <div class="item-number">${item.number || ''}</div>
        ${item.caught ? '<div class="checkmark"><i class="fas fa-check"></i></div>' : ''}
        <div class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite('${key}', '${item.number}', this)">
          <i class="${item.favorite ? 'fas fa-star' : 'far fa-star'}"></i>
        </div>
      </div>
    `;
  }).join('');
}

function toggleCaught(key, id, cardElement) {
  const dex = dinosaurs[key];
  if (!dex) return;

  const item = dex.data.find(d => d.number === id);
  if (!item) return;

  item.caught = !item.caught;
  saveCaughtStatus();

  cardElement.classList.toggle("caught", item.caught);

  const checkmark = cardElement.querySelector(".checkmark");
  if (checkmark) {
    checkmark.classList.toggle("hidden", !item.caught);
  }

  updateCounter(dex);
}

function updateCounter(collection) {
  const counterEl = document.querySelector(".collection-counter");
  if (!counterEl) return;

  const caughtCount = getCaughtCount(collection.data);
  counterEl.textContent = `(${caughtCount} / ${collection.total})`;
}

function toggleFavorite(key, id, iconElement) {
  const dex = dinosaurs[key];
  if (!dex) return;

  const item = dex.data.find(d => d.number === id);
  if (!item) return;

  item.favorite = !item.favorite;
  iconElement.innerHTML = item.favorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  saveCaughtStatus();
}

function getCaughtCount(data) {
  return data.filter(item => item.caught).length;
}

function getPercentage(data) {
  return Math.round((getCaughtCount(data) / data.length) * 100);
}

function saveCaughtStatus() {
  const status = {};
  for (const [key, dex] of Object.entries(dinosaurs)) {
    status[key] = {};
    dex.data.forEach(item => {
      if (item.number) {
        status[key][item.number] = {
          caught: item.caught || false,
          favorite: item.favorite || false,
        };
      }
    });
  }
  localStorage.setItem("caughtStatus", JSON.stringify(status));
}

function loadCaughtStatus() {
  const status = JSON.parse(localStorage.getItem("caughtStatus") || "{}");
  for (const [key, dex] of Object.entries(dinosaurs)) {
    if (status[key]) {
      dex.data.forEach(item => {
        if (item.number && status[key][item.number]) {
          item.caught = status[key][item.number].caught;
          item.favorite = status[key][item.number].favorite;
        }
      });
    }
  }
}

function applyDarkMode() {
  const darkModeEnabled = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", darkModeEnabled);

  const toggle = document.querySelector(".dark-mode-toggle");
  if (toggle) toggle.checked = darkModeEnabled;
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark);
}

function toggleModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  modal.classList.toggle("hidden");
}

function downloadPDF(key) {
  const collection = dinosaurs[key];
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text(`${collection.title} Collection`, 10, y);
  y += 10;

  collection.data.forEach(p => {
    if (p.isRegionTitle) {
      doc.setFontSize(14);
      doc.text(p.name, 10, y);
      y += 8;
    } else {
      let line = `#${p.number} ${p.name}`;
      const tags = [];
      if (p.caught) tags.push("[Caught]");
      if (p.favorite) tags.push("[Favorite]");
      if (tags.length) line += ` ${tags.join(" ")}`;

      doc.setFontSize(12);
      doc.text(line, 10, y);
      y += 6;
    }

    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save(`${collection.title}.pdf`);
}