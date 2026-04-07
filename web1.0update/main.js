import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";
import { enableLinkNavigation } from "./linkHandler.js";
import { pushHistory } from "./history.js";


async function loadPage() {
  let url = input.value.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  pushHistory(url);

  const rawHTML = await fetchPage(url);
  const cleanHTML = sanitizeHTML(rawHTML);
  renderPage(cleanHTML);

const viewer = document.getElementById("viewer");
enableLinkNavigation(viewer);
const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");

button.addEventListener("click", loadPage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loadPage();
});

async function loadPage() {
  let url = input.value.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    const rawHTML = await fetchPage(url);
    const cleanHTML = sanitizeHTML(rawHTML);
    renderPage(cleanHTML);
  } catch (err) {
    alert("Failed to load page.");
    console.error(err);
  }
}
