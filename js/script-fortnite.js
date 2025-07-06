// ── CONFIG ──────────────────────────────────────────────────────
const config = {
  first: {
    sectionId: "first-section",
    containerId: "cosmetics-container",
    searchId: "search-br",
    typeId: "type-br",
    sortId: "sort-br",
    url: "https://fortnite-api.com/v2/cosmetics/br",
  },
  second: {
    sectionId: "second-section",
    containerId: "cosmetics-container-cars",
    searchId: "search-cars",
    typeId: "type-cars",
    sortId: "sort-cars",
    url: "https://fortnite-api.com/v2/cosmetics/cars",
  },
  third: {
    sectionId: "third-section",
    containerId: "cosmetics-container-beans",
    searchId: "search-beans",
    typeId: "type-beans",
    sortId: "sort-beans",
    url: "https://fortnite-api.com/v2/cosmetics/beans",
  },
};

// ── ADAPTIVE BATCH SIZE ─────────────────────────────────────────
const effectiveType = navigator.connection?.effectiveType || "";
const saveData = navigator.connection?.saveData;
const deviceMemory = navigator.deviceMemory || 4;

function computeBatchSize() {
  let base = 50;
  if (saveData || effectiveType.includes("2g")) base = 10;
  else if (effectiveType.includes("3g")) base = 20;
  const memFactor = deviceMemory < 2 ? 0.5 : deviceMemory < 4 ? 0.75 : 1;
  return Math.max(5, Math.floor(base * memFactor));
}

let batchSize = computeBatchSize();

// ── STATE ───────────────────────────────────────────────────────
let currentSection = "first";
let allData = { first: [], second: [], third: [] };
let filteredData = { first: [], second: [], third: [] };
let pageIndex = { first: 0, second: 0, third: 0 };

// ── DOM REFS ───────────────────────────────────────────────────
const navButtons = document.querySelectorAll(".nav-btn");
const loading = document.getElementById("loading-screen");

// ── NAV HANDLER ────────────────────────────────────────────────
navButtons.forEach((btn) => btn.addEventListener("click", onNavClick));

async function onNavClick(e) {
  // determine currentSection key
  const secDomId = e.currentTarget.dataset.section;
  currentSection = Object.keys(config).find(
    (k) => config[k].sectionId === secDomId
  );

  // active nav styling
  navButtons.forEach((b) =>
    b.classList.toggle("active", b === e.currentTarget)
  );

  // show/hide sections & controls
  Object.values(config).forEach((cfg) => {
    const sectionEl = document.getElementById(cfg.sectionId);
    const isActive = cfg.sectionId === secDomId;
    sectionEl.style.display = isActive ? "block" : "none";
    sectionEl.querySelector(".controls").style.display = isActive
      ? "flex"
      : "none";
  });

  // ** DO NOT CALL initSettingsModal() here! It should only run once. **

  // lazy‐fetch data with skeleton placeholders
  if (allData[currentSection].length === 0) {
    showSkeletons(currentSection);
    allData[currentSection] = await fetchData(config[currentSection].url);
    populateTypeFilter(currentSection);
  }

  resetAndRender(currentSection);
}

// ── SETTINGS MODAL + DARK MODE ─────────────────────────────────
// ** Initialize modal once at page load **
function initSettingsModal() {
  const modal = document.getElementById("settings-modal-tcg");
  const darkToggle = document.getElementById("darkModeToggleModal");
  const icons = document.querySelectorAll(".settings-icon");
  const closeBtn = document.querySelector(".close-button");

  function toggleModal() {
    modal.classList.toggle("hidden");
    if (!modal.classList.contains("hidden")) {
      darkToggle.checked = document.body.classList.contains("dark-mode");
    }
  }
  icons.forEach((i) => i.addEventListener("click", toggleModal));
  closeBtn?.addEventListener("click", toggleModal);

  const saved = localStorage.getItem("darkMode") === "enabled";
  if (saved) document.body.classList.add("dark-mode");
  if (darkToggle) {
    darkToggle.checked = saved;
    darkToggle.addEventListener("change", () => {
      if (darkToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }
}

// ── SKELETON UI ────────────────────────────────────────────────
function showSkeletons(section) {
  const container = document.getElementById(config[section].containerId);
  container.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (let i = 0; i < batchSize; i++) {
    const s = document.createElement("div");
    s.className = "cosmetic-card skeleton";
    s.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-info">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>`;
    frag.appendChild(s);
  }
  container.appendChild(frag);
}

// ── FETCH ─────────────────────────────────────────────────────
async function fetchData(url) {
  loading.classList.remove("hidden"); // show
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    loading.classList.add("hidden"); // hide
  }
}

// ── TYPE FILTER POPULATOR ─────────────────────────────────────
function populateTypeFilter(section) {
  const sel = document.getElementById(config[section].typeId);
  sel.innerHTML = '<option value="all">All Types</option>';
  new Set(allData[section].map((c) => c.type?.value).filter(Boolean)).forEach(
    (t) => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      sel.appendChild(o);
    }
  );
}

// ── FILTER & RESET ────────────────────────────────────────────
function resetAndRender(section) {
  filteredData[section] = allData[section].slice();
  pageIndex[section] = 0;
  document.getElementById(config[section].containerId).innerHTML = "";
  applyFilters(section);
}

// debounce helper
function debounce(fn, delay = 300) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), delay);
  };
}

// wire up filters
Object.entries(config).forEach(([sec, cfg]) => {
  document.getElementById(cfg.searchId).addEventListener(
    "input",
    debounce(() => applyFilters(sec))
  );
  document
    .getElementById(cfg.typeId)
    .addEventListener("change", () => applyFilters(sec));
  document
    .getElementById(cfg.sortId)
    .addEventListener("change", () => applyFilters(sec));
});

function applyFilters(section) {
  const { searchId, typeId, sortId } = config[section];
  const q = document.getElementById(searchId).value.trim().toLowerCase();
  const tv = document.getElementById(typeId).value;
  const sv = document.getElementById(sortId).value;

  let arr = allData[section].filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const typeMatch = tv === "all" || c.type?.value === tv;
    return nameMatch && typeMatch;
  });

  if (sv === "newest") {
    arr.sort((a, b) => Date.parse(b.added) - Date.parse(a.added));
  } else if (sv === "oldest") {
    arr.sort((a, b) => Date.parse(a.added) - Date.parse(b.added));
  } else if (sv === "random") {
    arr.sort(() => Math.random() - 0.5);
  }

  filteredData[section] = arr;
  pageIndex[section] = 0;
  document.getElementById(config[section].containerId).innerHTML = "";
  scheduleRenderBatch(section);
}

// ── CHUNKED RENDER + PREFETCH ─────────────────────────────────
function scheduleRenderBatch(section) {
  requestAnimationFrame(() => renderBatch(section));
}

function renderBatch(section) {
  const cfg = config[section];
  const container = document.getElementById(cfg.containerId);
  const start = pageIndex[section] * batchSize;
  const end = Math.min(start + batchSize, filteredData[section].length);
  const frag = document.createDocumentFragment();

  for (let i = start; i < end; i++) {
    frag.appendChild(createCard(filteredData[section][i], section));
  }
  container.appendChild(frag);

  pageIndex[section]++;
  // small delay to pre-render next batch offscreen
  if (end < filteredData[section].length) {
    setTimeout(() => scheduleRenderBatch(section), 200);
  }
}

// ── CREATE CARD w/ IMAGE FADE-IN ───────────────────────────────
function createCard(cos) {
  const imgSrc =
    cos.images?.icon ||
    cos.images?.smallIcon ||
    cos.images?.featured ||
    cos.images?.large ||
    cos.images?.small ||
    "";

  const genderLine = cos.gender
    ? `<h6>Gender: ${cos.gender.substring(19)}</h6>`
    : "";

  const card = document.createElement("div");
  card.className = "cosmetic-card";
  card.innerHTML = `
    <img src="${imgSrc}" alt="${cos.name}" loading="lazy" />
    <div class="cosmetic-info">
      <h3>${cos.name}</h3>
      <h2 class="${(cos.rarity?.displayValue || "").replace(/\s+/g, "")}">
        ${cos.rarity?.displayValue || ""}
      </h2>
      <h6>${cos.introduction?.text || ""}</h6>
      <p>${cos.description || ""}</p>
      ${genderLine}
      <h5>${cos.set?.text || ""}</h5>
      <h6>ADDED: ${(cos.added || "").split("T")[0]}</h6>
    </div>`;
  return card;
}

// ── ON PAGE LOAD ────────────────────────────────────────────────
window.addEventListener("load", async () => {
  initSettingsModal();
  // trigger initial nav load (first tab)
  document.querySelector(".nav-btn").click();
});

// ── INITIAL LAUNCH ──────────────────────────────────────────────
document.querySelector(".nav-btn.active").click();

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