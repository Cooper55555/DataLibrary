const gunData = [
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/b/bd/Gun-smg_grey.png/",
    rarity: "COMMON",
    name: "SMG-GRAY",
    damage: "+10",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/1/16/Gun-smg_orange.png/",
    rarity: "COMMON",
    name: "SMG-ORANGE",
    damage: "+10",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/3/3c/Gun-smg_green.png/",
    rarity: "COMMON",
    name: "SMG-GREEN",
    damage: "+10",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/c/cd/Gun-smg_blue.png/",
    rarity: "UNCOMMON",
    name: "SMG-BLUE",
    damage: "+12",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/f/fe/Gun-smg_red.png/",
    rarity: "UNCOMMON",
    name: "SMG-RED",
    damage: "+12",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/0/05/Gun-smg_purple.png/",
    rarity: "UNCOMMON",
    name: "SMG-PURPLE",
    damage: "+12",
    type: "SMG",
  },
    {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/a/af/Gun-smg_yellow.png/",
    rarity: "RARE",
    name: "SMG-RARE",
    damage: "+14",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/c/c2/Gun-smg_pink.png/",
    rarity: "RARE",
    name: "SMG-RARE",
    damage: "+14",
    type: "SMG",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/8/8a/White_SMG.png/",
    rarity: "EPIC",
    name: "SMG-EPIC",
    damage: "+14",
    type: "SMG",
  },
];

const chrData = [
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/0/06/Char-fox.png/",
    rarity: "COMMON",
    name: "SUPER FOX",
    tube: 0,
    serum: 0,
    type: "FOX",
  },
  {
    img: "https://static.wikia.nocookie.net/animalroyale_gamepedia_en/images/7/77/Char-fox-red.png/",
    rarity: "UNCOMMON",
    name: "SUPER MAROON FOX",
    tube: 80,
    serum: 15,
    type: "FOX",
  },
];

// ----- SECTION NAVIGATION -----

const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionId = button.getAttribute("data-section");

    // Toggle active class
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Show/hide sections
    sections.forEach((section) => {
      section.style.display = section.id === sectionId ? "block" : "none";
    });

    // Switch data based on section
    if (sectionId === "first-section") {
      createCard(gunData);
    } else if (sectionId === "second-section") {
      createCard(chrData);
    }
  });
});

// ----- SETTINGS MODAL -----
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

// Close modal with the × button

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

function createCard(selectedData) {
  const cardContainer = document.querySelectorAll(".card-container");

  // Group data by type
  const groupedData = selectedData.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  // Clear and render in both card containers
  cardContainer.forEach((container) => (container.innerHTML = ""));

  for (const type in groupedData) {
    const defaultItem = groupedData[type][0];
    const card = document.createElement("div");
    card.classList.add("card");
    const rarityClass = defaultItem.rarity.toLowerCase();
    let style;

    if (selectedData == gunData) {
      card.innerHTML = `
         <div class="card-bg">
              <div class="img-bg ${rarityClass}">
            <img src="${defaultItem.img}" alt="${defaultItem.name}" />
          </div>
          <div class="info">
            <p><img src="../svg/festive-shiny-christmas-ornament-xmas-svgrepo-com.svg" alt="rarity" /><span>${defaultItem.rarity}</span></p>
            <p><img src="../svg/tag.svg" alt="tag" /><span>${defaultItem.name}</span></p>
            <p><img src="../svg/damage-kinetic-1-svgrepo-com.svg" alt="damage" /><span>${defaultItem.damage}</span></p>
          </div>
         </div>
        `;

      style = `
       .card:hover .img-bg img {
       animation: glow 800ms ease-in-out 1;
       border-radius: 50%;
      }
        `;
    } else if (selectedData == chrData) {
      card.innerHTML = `
         <div class="card-bg">
              <div class="img-bg ${rarityClass}">
            <img src="${defaultItem.img}" alt="${defaultItem.name}" />
          </div>
          <div class="info">
            <p><img src="../svg/festive-shiny-christmas-ornament-xmas-svgrepo-com.svg" alt="rarity" /><span>${defaultItem.rarity}</span></p>
            <p><img src="../svg/tag.svg" alt="tag" /><span>${defaultItem.name}</span></p>
            <div class="evolve-box">
            <div><img src="../svg/test-tube.png" alt="damage" /><span>${defaultItem.tube}</span> </div>
            <div><img src="../svg/Super_serum.png" alt="damage" /><span>${defaultItem.serum}</span> </div>
            </div>
          </div>
         </div>
        `;

      style = `
       .card:hover .img-bg img {
       animation: glow 800ms ease-in-out 1;
       border-radius: 50%;
      }
      `;
    }

    const styleTag = document.createElement("style");
    styleTag.textContent = style;
    document.head.appendChild(styleTag);

    card.addEventListener("click", () =>
      showPopup(type, card, groupedData, selectedData)
    );

    // Decide which section is visible to insert cards
    const currentSection = document.querySelector(
      ".section:not([style*='display: none'])"
    );
    currentSection.querySelector(".card-container").appendChild(card);
  }
}

// ----- CARD POPUP -----
function showPopup(type, parentCard, groupedData, selectedData) {
  const existingPopup = document.querySelector(".popup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.classList.add("popup");

  groupedData[type].forEach((item) => {
    const option = document.createElement("div");

    option.classList.add("popup-option");
    option.classList.add(item.rarity.toLowerCase()); // important!

    option.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <span>${item.name}</span>
    `;
  
    const closeButton = document.createElement("button");
closeButton.textContent = "✕";
closeButton.classList.add("popup-close-btn");
closeButton.addEventListener("click", () => {
  popup.remove();
});

popup.appendChild(closeButton);

    option.addEventListener("click", () => {
      const imgBg = parentCard.querySelector(".img-bg");

      // Update rarity background class
      imgBg.className = "img-bg"; // remove all previous classes
      imgBg.classList.add(item.rarity.toLowerCase());

      // Update image
      imgBg.querySelector("img").src = item.img;

      if (selectedData == gunData) {
        parentCard.querySelector(".info").innerHTML = `
    <p><img src="../svg/festive-shiny-christmas-ornament-xmas-svgrepo-com.svg" alt="rarity" /><span>${item.rarity}</span></p>
    <p><img src="../svg/tag.svg" alt="tag" /><span>${item.name}</span></p>
    <p><img src="../svg/damage-kinetic-1-svgrepo-com.svg" alt="damage" /><span>${item.damage}</span></p>
  `;
      } else if (selectedData == chrData) {
        parentCard.querySelector(".info").innerHTML = `
    <p><img src="../svg/festive-shiny-christmas-ornament-xmas-svgrepo-com.svg" alt="rarity" /><span>${item.rarity}</span></p>
    <p><img src="../svg/tag.svg" alt="tag" /><span>${item.name}</span></p>
    <div class="evolve-box">
    <div><img src="../svg/test-tube.png" alt="damage" /><span>${item.tube}</span> </div>
    <div><img src="../svg/Super_serum.png" alt="damage" /><span>${item.serum}</span> </div>
    </div>
  `;
      }

      popup.remove();
    });

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        popup.remove();
      });
    });

    popup.appendChild(option);
  });

  document.body.appendChild(popup);
}

// Initial render
createCard(gunData);


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