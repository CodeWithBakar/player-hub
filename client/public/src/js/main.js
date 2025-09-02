// This file handles all DOM interactions and event listeners.
import {
  getPlayers,
  registerPlayer,
  verifyCaptcha,
  getEvents,
  getEventById,
  createCheckoutSession,
} from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Page Initializers ---
  initNavbar();

  if (document.querySelector(".hero")) initHomePage();
  if (document.getElementById("register-form")) initRegisterPage();
  if (document.getElementById("player-table")) initPlayersPage();
  if (document.getElementById("contact-form")) initContactPage();
  if (document.getElementById("events-page")) initEventsPage();
  if (document.getElementById("event-detail-page")) initEventDetailPage();
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

// --- Home Page Logic (Videos) ---
function initHomePage() {
  const videoGrid = document.querySelector(".video-grid");
  const modal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("video-player");
  const closeButton = document.querySelector(".close-button");

  if (!videoGrid || !modal) return;

  const videoIds = [
    "1CB_xGYibQU",
    "IHbPUpn26x0",
    "lA-i7pVTtdQ",
    "cWrPe1t5V2g",
    "Bj_1GpQtsgI",
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

// --- Registration Page Logic with Captcha ---
function initRegisterPage() {
  const form = document.getElementById("register-form");
  const messageEl = document.getElementById("form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Verifying...";
    messageEl.className = "";

    const captchaToken = form.querySelector("[name=h-captcha-response]").value;
    if (!captchaToken) {
      messageEl.textContent = "Please complete the captcha.";
      messageEl.className = "error";
      return;
    }

    const captchaResult = await verifyCaptcha(captchaToken);
    if (!captchaResult.success) {
      messageEl.textContent = "Captcha verification failed. Please try again.";
      messageEl.className = "error";
      return;
    }

    messageEl.textContent = "Registering...";
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
    if (!players || players.length === 0) {
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

// --- Contact Page Logic with Captcha ---
function initContactPage() {
  const form = document.getElementById("contact-form");
  const messageEl = document.getElementById("contact-form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Verifying...";
    messageEl.className = "";

    const captchaToken = form.querySelector("[name=h-captcha-response]").value;
    if (!captchaToken) {
      messageEl.textContent = "Please complete the captcha.";
      messageEl.className = "error";
      return;
    }

    const captchaResult = await verifyCaptcha(captchaToken);
    if (!captchaResult.success) {
      messageEl.textContent = "Captcha verification failed. Please try again.";
      messageEl.className = "error";
      return;
    }

    messageEl.textContent = "Sending message...";
    emailjs.sendForm("service_shzvdwh", "template_jztob5m", form).then(
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

// --- Events Page Logic ---
async function initEventsPage() {
  const eventsGrid = document.getElementById("events-grid");
  if (!eventsGrid) return;
  eventsGrid.innerHTML = "<p>Loading events...</p>";

  try {
    const events = await getEvents();
    if (!events || events.length === 0) {
      eventsGrid.innerHTML = "<p>No upcoming events at this time.</p>";
      return;
    }

    eventsGrid.innerHTML = events
      .map(
        (event) => `
            <a href="event-detail.html?id=${event.id}" class="event-card">
                <img src="${
                  event.image_url ||
                  "https://placehold.co/600x400/4F46E5/FFFFFF?text=Event"
                }" alt="${event.name}">
                <div class="event-card-content">
                    <p class="event-card-date">${new Date(
                      event.date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                    <h2>${event.name}</h2>
                </div>
            </a>
        `
      )
      .join("");
  } catch (error) {
    eventsGrid.innerHTML =
      "<p>Could not load events. Please try again later.</p>";
    console.error("Failed to load events:", error);
  }
}

// --- Event Detail Page Logic ---
async function initEventDetailPage() {
  const eventContent = document.getElementById("event-content");
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  if (!eventId) {
    eventContent.innerHTML =
      "<h2>Event not found</h2><p>No event ID was provided.</p>";
    return;
  }

  try {
    const event = await getEventById(eventId);
    const eventDate = new Date(event.date);

    // Render event details and ticket form into the two-column layout
    eventContent.innerHTML = `
            <div class="event-detail-layout">
                <div class="event-detail-info">
                    <img src="${
                      event.image_url ||
                      "https://placehold.co/1200x400/4F46E5/FFFFFF?text=Event"
                    }" alt="${event.name}" class="event-banner">
                    <h1>${event.name}</h1>
                    <div class="event-meta">
                        <div class="event-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span><strong>Date:</strong> ${eventDate.toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}</span>
                        </div>
                        <div class="event-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span><strong>Location:</strong> ${
                              event.location || "TBA"
                            }</span>
                        </div>
                    </div>
                    <p class="event-description">${event.description}</p>
                </div>
                <div class="event-registration-card">
                    <h3>Register for this Event</h3>
                    <form id="ticket-form" class="styled-form">
                        <div class="form-group">
                            <label for="ticket-type">Ticket Type</label>
                            <select id="ticket-type" name="ticketId" required>
                                ${
                                  event.tickets && event.tickets.length > 0
                                    ? event.tickets
                                        .map(
                                          (t) =>
                                            `<option value="${t.id}">${
                                              t.name
                                            } - $${(t.price / 100).toFixed(
                                              2
                                            )}</option>`
                                        )
                                        .join("")
                                    : "<option disabled>No tickets available</option>"
                                }
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required placeholder="your.email@example.com">
                        </div>
                        <div class="form-group">
                            <label for="quantity">Quantity</label>
                            <input type="number" id="quantity" name="quantity" value="1" min="1" max="10" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Proceed to Payment</button>
                        <p id="payment-message"></p>
                    </form>
                </div>
            </div>
        `;

    const form = document.getElementById("ticket-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const messageEl = document.getElementById("payment-message");
      messageEl.textContent = "Redirecting to payment...";

      const formData = new FormData(form);
      const ticketId = formData.get("ticketId");
      const quantity = formData.get("quantity");
      const email = formData.get("email");

      // IMPORTANT: Replace with your actual Stripe Publishable Key
      const STRIPE_PUBLISHABLE_KEY =
        "pk_test_51S2uVp1gv0SAsxCtM0dRzi1awwOt9Y7JSW4FeXNztX7kKkV9SebGMPL1n7jSzu5IFmrgL23NBrprIIzwzFPwcFuE00doTRd1tn";

      if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
        messageEl.textContent =
          "Stripe is not configured. Please add your Publishable Key.";
        messageEl.className = "error";
        return;
      }

      try {
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        const session = await createCheckoutSession(ticketId, quantity, email);

        if (session.id) {
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          if (result.error) {
            messageEl.textContent = result.error.message;
            messageEl.className = "error";
          }
        } else {
          messageEl.textContent =
            session.error || "Could not create a payment session.";
          messageEl.className = "error";
        }
      } catch (error) {
        messageEl.textContent = "Could not initiate payment. Please try again.";
        messageEl.className = "error";
        console.error("Payment initiation error:", error);
      }
    });
  } catch (error) {
    eventContent.innerHTML =
      "<h2>Error</h2><p>Could not load event details.</p>";
    console.error("Failed to load event details:", error);
  }
}
