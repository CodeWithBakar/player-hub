// For local development, use: 'http://localhost:5000/api'
const API_BASE_URL = "https://player-hub-production.up.railway.app/api";

// --- Player API ---
export async function getPlayers() {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.players || [];
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return [];
  }
}

export async function registerPlayer(playerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });
    const result = await response.json();
    return { ok: response.ok, ...result };
  } catch (error) {
    console.error("Failed to register player:", error);
    return {
      ok: false,
      error: "The server is not responding. Please try again later.",
    };
  }
}

// --- Captcha API ---
export async function verifyCaptcha(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to verify captcha:", error);
    return {
      success: false,
      message: "Failed to connect to the server for captcha verification.",
    };
  }
}

// --- Event API ---
export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}
export async function getEventById(id) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// --- Payment API ---
export async function createCheckoutSession(ticketId, quantity, email) {
  const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId, quantity, email }),
  });
  return await response.json();
}
