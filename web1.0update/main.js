import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";
import { enableLinkNavigation } from "./linkHandler.js";
import { pushHistory } from "./history.js";

const viewer = document.getElementById("viewer");
const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");

// Enable link handling once
enableLinkNavigation(viewer);

async function loadPage() {
  let url = input.value.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    pushHistory(url);

    const rawHTML = await fetchPage(url);
    const cleanHTML = sanitizeHTML(rawHTML);
    renderPage(cleanHTML);
  } catch (err) {
    alert("Failed to load page.");
    console.error(err);
  }
}

// Event listeners
button.addEventListener("click", loadPage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loadPage();
  }
});
