// Legacy page loader (Web 1.0 friendly)
const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const viewer = document.getElementById("viewer");
const statusBar = document.getElementById("statusBar"); // optional

const proxy = "https://api.allorigins.win/raw?url=";

// Optional: history support
const historyStack = [];
let historyIndex = -1;

// Event listeners
button.addEventListener("click", () => loadPage(input.value));
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loadPage(input.value);
});

// Optional back/forward
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");

if (backBtn) backBtn.addEventListener("click", () => navigateHistory(-1));
if (forwardBtn) forwardBtn.addEventListener("click", () => navigateHistory(1));

// Main loader
async function loadPage(url) {
  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  // Update input
  input.value = url;

  // Push history
  pushHistory(url);

  try {
    if (statusBar) statusBar.textContent = "Loading...";
    const res = await fetch(proxy + encodeURIComponent(url));
    let html = await res.text();

    // 🔥 Strip everything except structural HTML

    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[\s\S]*?rel=["']?stylesheet["']?[\s\S]*?>/gi, "");
    html = html.replace(/<img[\s\S]*?>/gi, "");
    html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
    html = html.replace(/style="[^"]*"/gi, "");
    html = html.replace(/on\w+="[^"]*"/gi, "");
    html = html.replace(/<(\w+)[^>]*>/g, "<$1>");

    // Render
    const blob = new Blob([html], { type: "text/html" });
    const blobURL = URL.createObjectURL(blob);
    viewer.src = blobURL;

    if (statusBar) statusBar.textContent = "Done";
  } catch (err) {
    if (statusBar) statusBar.textContent = "Error";
    alert("Failed to load page.");
    console.error(err);
  }
}

// ===== History helpers =====
function pushHistory(url) {
  // Trim forward history if any
  historyStack.splice(historyIndex + 1);
  historyStack.push(url);
  historyIndex = historyStack.length - 1;
}

function navigateHistory(offset) {
  const newIndex = historyIndex + offset;
  if (newIndex >= 0 && newIndex < historyStack.length) {
    historyIndex = newIndex;
    loadPage(historyStack[historyIndex]);
  }
}
