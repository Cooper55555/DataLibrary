document.addEventListener("DOMContentLoaded", () => {
  let allTanks = [];

  ["search-name", "filter-nation", "filter-type", "filter-tier"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", applyFilters);
  });

  document.addEventListener("click", (event) => {
    const detailsContainer = document.getElementById("module-details");
    if (
      detailsContainer &&
      detailsContainer.style.display === "block" &&
      !detailsContainer.contains(event.target) &&
      event.target.id !== "module-close"
    ) {
      detailsContainer.style.display = "none";
    }
  });

  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-section');
      if (!target) return;

      if (target === 'settings-section') {
        document.getElementById("settings-overlay").classList.remove("hidden");
        return;
      }

      document.querySelectorAll('.nav-btn, .settings-icon').forEach(btn => btn.classList.remove('active'));
      e.currentTarget.classList.add('active');

      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
      });

      const section = document.getElementById(target);
      if (section) {
        section.classList.add('active');
        section.classList.remove('hidden');
      }

      const labelMap = {
        "tanks-section": "Tanks",
        "maps-section": "Maps",
        "settings-section": "Settings",
      };

      const label = document.getElementById("active-section-label");
      if (label && labelMap[target]) {
        label.textContent = `Section: ${labelMap[target]}`;
      }
    });
  });

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }

  const tanksContainer = document.getElementById('tanks-container');
  const API_KEY = '2a61e0e70034f49f3cbe1258efaab810';
  const REGION = 'eu';
  const LANGUAGE = 'en';
  const TANKS_API_URL = `https://api.worldoftanks.${REGION}/wot/encyclopedia/vehicles/?application_id=${API_KEY}&language=${LANGUAGE}`;

  async function loadTanks() {
    const backdrop = document.getElementById("loading-backdrop");
    const loader = document.getElementById("loading-screen");
    if (loader) loader.style.display = "flex";

    try {
      const response = await fetch(TANKS_API_URL);
      const data = await response.json();

      if (data.status !== 'ok') throw new Error("API error");

      allTanks = Object.values(data.data).sort((a, b) => a.name.localeCompare(b.name));
      populateFilters(allTanks);
      renderTanks(allTanks);
    } catch (err) {
      tanksContainer.innerHTML = `<p style="color:red;">Failed to load tanks: ${err.message}</p>`;
      console.error(err);
    } finally {
      if (loader) loader.style.display = "none";
      if (backdrop) backdrop.style.display = "none";
    }
  }

  function populateFilters(tanks) {
    const nations = new Set();
    const types = new Set();
    const tiers = new Set();

    tanks.forEach(t => {
      nations.add(t.nation);
      types.add(t.type);
      tiers.add(t.tier);
    });

    addOptions("filter-nation", nations, formatNation);
    addOptions("filter-type", types, formatType);
    addOptions("filter-tier", [...tiers].sort((a, b) => a - b), v => v);
  }

  function addOptions(id, values, formatter = v => v) {
    const select = document.getElementById(id);
    if (!select) return;
    values = [...values].sort();
    values.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = formatter(v);
      select.appendChild(opt);
    });
  }

  function formatNation(n) {
    return (n === 'usa' || n === 'ussr') ? n.toUpperCase() : n.charAt(0).toUpperCase() + n.slice(1);
  }

  function formatType(t) {
    switch (t) {
      case "lightTank": return "Light Tank";
      case "mediumTank": return "Medium Tank";
      case "heavyTank": return "Heavy Tank";
      case "SPG": case "selfpropelledgun": return "Artillery";
      case "AT-SPG": case "at-spg": return "Tank Destroyer";
      default: return t;
    }
  }

  function renderTanks(tanks) {
    tanksContainer.innerHTML = "";

    if (!tanks.length) {
      tanksContainer.innerHTML = `<p style="color: orange;">No tanks found.</p>`;
      return;
    }

    tanks.forEach(tank => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${tank.images?.small_icon}" alt="${tank.name}">
        <h3>${tank.name}</h3>
        <p><strong>Nation:</strong> ${formatNation(tank.nation)}</p>
        <p><strong>Tier:</strong> ${tank.tier}</p>
        <p><strong>Type:</strong> ${formatType(tank.type)}</p>
      `;
      card.addEventListener("click", () => openTankOverlay(tank));
      tanksContainer.appendChild(card);
    });
  }

  function applyFilters() {
    const name = document.getElementById("search-name").value.toLowerCase();
    const nation = document.getElementById("filter-nation").value;
    const type = document.getElementById("filter-type").value;
    const tier = document.getElementById("filter-tier").value;

    const filtered = allTanks.filter(tank =>
      (!name || tank.name.toLowerCase().includes(name)) &&
      (!nation || tank.nation === nation) &&
      (!type || tank.type === type) &&
      (!tier || tank.tier.toString() === tier)
    );

    renderTanks(filtered);
  }

  function findTankById(id) {
    return allTanks.find(t => t.tank_id === id);
  }

  function armorString(armor) {
    return armor ? `${armor.front}/${armor.sides}/${armor.rear}` : "N/A";
  }

  function openTankOverlay(tank) {
    const overlay = document.getElementById("tank-overlay");
    const body = document.getElementById("overlay-body");
    const info = document.getElementById("tank-info");
    const modules = document.getElementById("modules-tree");
    const details = document.getElementById("module-details");
    const content = document.getElementById("module-content");

    if (!overlay || !info || !modules || !details || !content) return;

    info.innerHTML = `
      <img src="${tank.images?.big_icon}" alt="${tank.name}">
      <h2>${tank.name}</h2>
      <p><strong>Nation:</strong> ${formatNation(tank.nation)}</p>
      <p><strong>Tier:</strong> ${tank.tier}</p>
      <p><strong>Type:</strong> ${formatType(tank.type)}</p>
      <p><strong>HP:</strong> ${tank.default_profile.hp}</p>
      <p><strong>Speed:</strong> ${tank.default_profile.speed_forward} / -${tank.default_profile.speed_backward} km/h</p>
      <p><strong>Armor Hull (F/S/R):</strong> ${armorString(tank.default_profile.armor?.hull)}</p>
      <p><strong>Armor Turret (F/S/R):</strong> ${armorString(tank.default_profile.armor?.turret)}</p>
    `;

    modules.innerHTML = `<p style="margin-top: 1rem;">Loading modules...</p>`;
    content.innerHTML = ``;
    details.style.display = "none";
    overlay.classList.remove("hidden");

    requestAnimationFrame(() => renderModulesTree(tank));
  }

  window.openTankOverlay = openTankOverlay;
  window.findTankById = findTankById;

  function renderModulesTree(tank) {
    const container = document.getElementById("modules-tree");
    const details = document.getElementById("module-details");
    const content = document.getElementById("module-content");
    const closeBtn = document.getElementById("module-close");

    if (!container || !details || !content || !closeBtn) return;

    container.innerHTML = "";
    details.style.display = "none";

    const modulesTree = tank.modules_tree;
    if (!modulesTree || Object.keys(modulesTree).length === 0) {
      container.innerHTML = "<p>No module tree available.</p>";
      return;
    }

    const roots = findRootModules(modulesTree);
    const ul = document.createElement("ul");

    roots.forEach(id => {
      ul.appendChild(renderModuleNode(modulesTree[id], modulesTree));
    });

    container.appendChild(ul);

    closeBtn.onclick = () => {
      details.style.display = "none";
    };

    function renderModuleNode(mod, tree) {
      const li = document.createElement("li");
      li.className = "module-node";
      li.textContent = mod.name;

      li.addEventListener("click", e => {
        e.stopPropagation();
        showModuleDetails(mod);
      });

      if (mod.next_modules?.length) {
        const nestedUl = document.createElement("ul");
        mod.next_modules.forEach(id => {
          if (tree[id]) nestedUl.appendChild(renderModuleNode(tree[id], tree));
        });
        li.appendChild(nestedUl);
      }

      return li;
    }

    function showModuleDetails(mod) {
      content.innerHTML = `
        <h3>${mod.name}</h3>
        <p><strong>Type:</strong> ${mod.type}</p>
        <p><strong>XP:</strong> ${mod.price_xp}</p>
        <p><strong>Credits:</strong> ${mod.price_credit}</p>
      `;
      details.style.display = "block";
    }
  }

  function findRootModules(tree) {
    const all = Object.keys(tree);
    const children = new Set();

    all.forEach(id => {
      const mod = tree[id];
      mod.next_modules?.forEach(next => children.add(String(next)));
    });

    return all.filter(id => !children.has(id));
  }

  document.getElementById("overlay-close")?.addEventListener("click", () => {
    document.getElementById("tank-overlay").classList.add("hidden");
  });
  
  document.getElementById("settings-close")?.addEventListener("click", () => {
    document.getElementById("settings-overlay").classList.add("hidden");
  });

  document.getElementById("reset-filters")?.addEventListener("click", () => {
    ["search-name", "filter-nation", "filter-type", "filter-tier"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    applyFilters();
  });

  loadTanks();
});

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