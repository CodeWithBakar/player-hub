// This file handles all DOM interactions and event listeners.
import { getPlayers, registerPlayer } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname;

  // --- Page Initializers ---
  initNavbar();

  if (page.includes("index.html") || page === "/") {
    initVideoPage();
  }
  if (page.includes("register.html")) {
    initRegisterPage();
  }
  if (page.includes("players.html")) {
    initPlayersPage();
  }
  if (page.includes("contact.html")) {
    initContactPage();
  }
});

// --- NEW: Navbar Logic ---
function initNavbar() {
  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  }
}

// --- Video Page Logic ---
function initVideoPage() {
  document
    .querySelector("h1")
    .insertAdjacentHTML(
      "afterend",
      '<p class="page-subtitle">Curated highlights and tutorials from the best in the game.</p>'
    );

  const videoGrid = document.getElementById("video-grid");
  const modal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("video-player");
  const closeButton = document.querySelector(".close-button");

  const videoIds = [
    "a18py61_F_w",
    "u5UIU55Ctoo",
    "cC9eRT6anfk",
    "tExc5EOZ1DY",
    "3wG79nMMcDI",
    "fL80SYLNY5A",
    "PqdmKQYSizA",
    "ZcrxNdpABPc",
  ];

  videoGrid.innerHTML = videoIds
    .map(
      (id) => `
        <div class="video-thumbnail" data-video-id="${id}">
            <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="Video Thumbnail">
            <div class="play-icon">&#9658;</div>
        </div>
    `
    )
    .join("");

  videoGrid.addEventListener("click", (e) => {
    const thumbnail = e.target.closest(".video-thumbnail");
    if (thumbnail) {
      const videoId = thumbnail.dataset.videoId;
      videoPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      modal.style.display = "flex";
    }
  });

  const closeModal = () => {
    modal.style.display = "none";
    videoPlayer.innerHTML = "";
  };

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());
}

// --- Registration Page Logic ---
function initRegisterPage() {
  document
    .querySelector("h1")
    .insertAdjacentHTML(
      "afterend",
      '<p class="page-subtitle">Join our community and get listed on the official roster.</p>'
    );

  const form = document.getElementById("register-form");
  const messageEl = document.getElementById("form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await registerPlayer(data);

    if (result.ok) {
      messageEl.textContent = result.message || "Registration successful!";
      messageEl.className = "success";
      form.reset();
    } else {
      messageEl.textContent = `Error: ${
        result.error || "An unknown error occurred."
      }`;
      messageEl.className = "error";
    }
  });
}

// --- Player List Page Logic ---
function initPlayersPage() {
  document
    .querySelector("h1")
    .insertAdjacentHTML(
      "afterend",
      '<p class="page-subtitle">Browse and search for all registered community members.</p>'
    );

  const tableBody = document.getElementById("player-table-body");
  const searchInput = document.getElementById("search-input");
  let allPlayers = [];

  const renderPlayers = (players) => {
    tableBody.innerHTML = "";
    if (players.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No players found matching your search.</td></tr>`;
      return;
    }
    players.forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.email}</td>
                <td>${p.team || "N/A"}</td>
                <td>${p.position || "N/A"}</td>
            `;
      tableBody.appendChild(row);
    });
  };

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPlayers = allPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.team && p.team.toLowerCase().includes(searchTerm))
    );
    renderPlayers(filteredPlayers);
  });

  getPlayers().then((players) => {
    allPlayers = players;
    renderPlayers(allPlayers);
  });
}

// --- Contact Page Logic ---
function initContactPage() {
  document
    .querySelector("h1")
    .insertAdjacentHTML(
      "afterend",
      '<p class="page-subtitle">Have questions or feedback? We’d love to hear from you.</p>'
    );

  const form = document.getElementById("contact-form");
  const messageEl = document.getElementById("contact-form-message");

  const SERVICE_ID = "service_shzvdwh";
  const TEMPLATE_ID = "template_jztob5m";
  const PUBLIC_KEY = "GCIhbffBCa1ptr9-9";

  if (typeof emailjs === "undefined") return;
  emailjs.init(PUBLIC_KEY);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (SERVICE_ID === "YOUR_SERVICE_ID") {
      messageEl.textContent =
        "EmailJS is not configured. Add your IDs in js/main.js.";
      messageEl.className = "error";
      return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form).then(
      () => {
        messageEl.textContent = "Message sent successfully!";
        messageEl.className = "success";
        form.reset();
      },
      (error) => {
        messageEl.textContent = `Failed to send. Error: ${JSON.stringify(
          error
        )}`;
        messageEl.className = "error";
      }
    );
  });
}
