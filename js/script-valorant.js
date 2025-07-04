const navButtons = document.querySelectorAll(".nav-btn");
const settingsIcon = document.querySelector(".settings-icon");

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

document.addEventListener("DOMContentLoaded", () => {
  const agentGrid = document.getElementById("agentGrid");
  const agentDetails = document.getElementById("agentDetails");
  const backButton = document.getElementById("backButton");
  const pageTitle = document.getElementById("pageTitle");

  backButton.addEventListener("click", () => {
    agentDetails.classList.add("hidden");
    agentGrid.classList.remove("hidden");
    backButton.classList.add("hidden");
    pageTitle.classList.remove("hidden");

    // Show nav buttons again
    navButtons.forEach(btn => btn.classList.remove("hidden"));
  });

  function showAgentDetails(agent) {
    agentGrid.classList.add("hidden");
    agentDetails.classList.remove("hidden");
    backButton.classList.remove("hidden");
    pageTitle.classList.add("hidden");

    // Hide nav buttons but keep settings visible
    navButtons.forEach(btn => btn.classList.add("hidden"));

    agentDetails.innerHTML = "";

    const img = document.createElement("img");
    img.src = agent.fullPortrait;
    img.alt = agent.displayName;
    agentDetails.appendChild(img);

    const name = document.createElement("h2");
    name.textContent = agent.displayName;
    agentDetails.appendChild(name);

    const infoBlock = document.createElement("div");
    infoBlock.className = "agent-info-block";

    const roleTitle = document.createElement("div");
    roleTitle.className = "section-title";
    roleTitle.textContent = "Role";
    infoBlock.appendChild(roleTitle);

    const role = document.createElement("p");
    role.innerHTML = `<strong>${agent.role.displayName}</strong> - ${agent.role.description}`;
    infoBlock.appendChild(role);

    const descTitle = document.createElement("div");
    descTitle.className = "section-title";
    descTitle.textContent = "Biography";
    infoBlock.appendChild(descTitle);

    const desc = document.createElement("p");
    desc.textContent = agent.description;
    infoBlock.appendChild(desc);

    const abilitiesTitle = document.createElement("div");
    abilitiesTitle.className = "section-title";
    abilitiesTitle.textContent = "Abilities";
    infoBlock.appendChild(abilitiesTitle);

    agent.abilities.forEach(ab => {
      if (!ab.displayIcon) return;

      const wrapper = document.createElement("div");
      wrapper.className = "ability-wrapper";

      const icon = document.createElement("img");
      icon.src = ab.displayIcon;
      icon.alt = ab.displayName;
      icon.className = "ability-icon";
      wrapper.appendChild(icon);

      const text = document.createElement("div");
      text.className = "ability-text";

      const title = document.createElement("div");
      title.className = "ability-name";
      title.textContent = ab.displayName;
      text.appendChild(title);

      const description = document.createElement("div");
      description.className = "ability-desc";
      description.textContent = ab.description;
      text.appendChild(description);

      wrapper.appendChild(text);
      infoBlock.appendChild(wrapper);
    });

    agentDetails.appendChild(infoBlock);
  }

  fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
    .then(res => res.json())
    .then(data => {
      data.data.forEach(agent => {
        if (!agent.fullPortrait) return;

        const card = document.createElement("div");
        card.className = "agent-card";
        card.onclick = () => showAgentDetails(agent);

        const img = document.createElement("img");
        img.src = agent.fullPortrait;
        img.alt = agent.displayName;
        card.appendChild(img);

        const name = document.createElement("h2");
        name.textContent = agent.displayName;
        card.appendChild(name);

        const role = document.createElement("p");
        role.textContent = agent.role ? agent.role.displayName : "No Role";
        card.appendChild(role);

        agentGrid.appendChild(card);
      });
    })
    .catch(err => {
      const error = document.createElement("p");
      error.textContent = "Failed to load agents.";
      error.style.color = "red";
      document.body.appendChild(error);
      console.error(err);
    });
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