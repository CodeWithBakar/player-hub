// This file handles all DOM interactions and event listeners.
import { getPlayers, registerPlayer } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Page Initializers ---
  initNavbar();

  if (document.querySelector(".hero")) {
    initVideoPage();
  }
  if (document.getElementById("register-form")) {
    initRegisterPage();
  }
  if (document.getElementById("player-table")) {
    initPlayersPage();
  }
  if (document.getElementById("contact-form")) {
    initContactPage();
  }
});

// --- Navbar Logic ---
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
  const videoGrid = document.getElementById("video-grid");
  const modal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("video-player");
  const closeButton = document.querySelector(".close-button");

  // Only run if the video grid exists on the page
  if (!videoGrid) return;

  // Your list of video IDs
  const videoIds = [
    "oSIDK_qMxqM",
    "LavH7audJww",
    "AlXgSXIpchc",
    "X918VVC1NTA",
    "Dw4L6qR46ik",
    "SdTTEhOlsu0",
    "tAlSp2yTvAA",
    "iEvhfCx1u2A",
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

  // Event listener to open the modal when a thumbnail is clicked
  videoGrid.addEventListener("click", (e) => {
    const thumbnail = e.target.closest(".video-thumbnail");
    if (thumbnail) {
      const videoId = thumbnail.dataset.videoId;
      videoPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      modal.style.display = "flex";
    }
  });

  // Logic to close the video modal
  const closeModal = () => {
    modal.style.display = "none";
    videoPlayer.innerHTML = "";
  };

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());
}

// --- Registration Page Logic ---
function initRegisterPage() {
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
  const tableBody = document.getElementById("player-table-body");
  const searchInput = document.getElementById("search-input");
  let allPlayers = [];

  const renderPlayers = (players) => {
    tableBody.innerHTML = "";
    if (players.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">No players have been registered yet.</td></tr>`;
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
  const form = document.getElementById("contact-form");
  const messageEl = document.getElementById("contact-form-message");

  const SERVICE_ID = "service_shzvdwh";
  const TEMPLATE_ID = "template_jztob5m";
  const PUBLIC_KEY = "GCIhbffBCa1ptr9-9";

  if (typeof emailjs === "undefined") return;
  emailjs.init(PUBLIC_KEY);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
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
