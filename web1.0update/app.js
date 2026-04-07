const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const viewer = document.getElementById("viewer");

const proxy = "https://api.allorigins.win/raw?url=";

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
    const res = await fetch(proxy + encodeURIComponent(url));
    let html = await res.text();

    // 🔥 Strip everything except structural HTML

    // Remove scripts
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // Remove styles (internal + external)
    html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<link[\s\S]*?rel=["']?stylesheet["']?[\s\S]*?>/gi, "");

    // Remove images
    html = html.replace(/<img[\s\S]*?>/gi, "");

    // Remove iframes
    html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");

    // Remove inline styles
    html = html.replace(/style="[^"]*"/gi, "");

    // Remove JS event handlers
    html = html.replace(/on\w+="[^"]*"/gi, "");

    // Optional: strip all attributes (ultra-pure mode)
    html = html.replace(/<(\w+)[^>]*>/g, "<$1>");

    // Render cleaned HTML
    const blob = new Blob([html], { type: "text/html" });
    const blobURL = URL.createObjectURL(blob);

    viewer.src = blobURL;
  } catch (err) {
    alert("Failed to load page.");
    console.error(err);
  }
}
