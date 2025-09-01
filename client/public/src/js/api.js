const API_BASE_URL = "/api";

/**
 * Fetches all players from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of players.
 */
export async function getPlayers() {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.players || [];
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return [];
  }
}

/**
 * Registers a new player.
 * @param {object} playerData - The player data from the form.
 * @returns {Promise<object>} A promise that resolves to the server's response.
 */
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
