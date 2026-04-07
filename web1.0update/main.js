import { fetchPage } from "./fetcher.js";
import { sanitizeHTML } from "./sanitizer.js";
import { renderPage } from "./renderer.js";
import { enableLinkNavigation } from "./linkHandler.js";
import { pushHistory, goBack, goForward } from "./history.js";
import { saveBookmark, getBookmarks } from "./bookmarks.js";
import { toPlainText } from "./textMode.js";

const viewer = document.getElementById("viewer");
const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");

// NEW UI elements
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
const bookmarkBtn = document.getElementById("bookmarkBtn");
const bookmarksBar = document.getElementById("bookmarksBar");
const statusBar = document.getElementById("statusBar");
const textToggle = document.getElementById("textModeToggle");

// Enable link handling once
enableLinkNavigation(viewer);

async function loadPage() {
  let url = input.value.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    pushHistory(url);
    statusBar.textContent = "Loading...";

    const rawHTML = await fetchPage(url);
    let cleanHTML = sanitizeHTML(rawHTML);

    // Text-only mode
    if (textToggle && textToggle.checked) {
      cleanHTML = toPlainText(cleanHTML);
    }

    renderPage(cleanHTML);
    statusBar.textContent = "Done";
  } catch (err) {
    statusBar.textContent = "Error";
    alert("Failed to load page.");
    console.error(err);
  }
}

// ===== Event listeners =====
button.addEventListener("click", loadPage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loadPage();
  }
});

// ===== Back / Forward =====
if (backBtn) {
  backBtn.onclick = () => {
    const url = goBack();
    if (url) {
      input.value = url;
      loadPage();
    }
  };
}

if (forwardBtn) {
  forwardBtn.onclick = () => {
    const url = goForward();
    if (url) {
      input.value = url;
      loadPage();
    }
  };
}

// ===== Bookmarks =====
if (bookmarkBtn) {
  bookmarkBtn.onclick = () => {
    saveBookmark(input.value);
    renderBookmarks();
  };
}

function renderBookmarks() {
  if (!bookmarksBar) return;

  bookmarksBar.innerHTML = "";

  getBookmarks().forEach(url => {
    const btn = document.createElement("button");
    btn.textContent = url;

    btn.onclick = () => {
      input.value = url;
      loadPage();
    };

    bookmarksBar.appendChild(btn);
  });
}

// Load bookmarks on start
renderBookmarks();
