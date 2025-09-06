const API_BASE = "http://localhost:5000"; // change if needed
let urlData = [];

// Load data from backend on page load
window.onload = () => {
  fetchUrls();
};

document.getElementById("shortenBtn").addEventListener("click", shortenUrl);

async function shortenUrl() {
  const urlInput = document.getElementById("urlInput").value.trim();
  const output = document.getElementById("output");

  if (urlInput === "") {
    output.textContent = "Please enter a URL.";
    output.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ longurl: urlInput })
    });

    const data = await res.json();

    output.textContent = `Short URL: ${API_BASE}/${data.shorturl}`;
    output.style.color = "green";

    document.getElementById("urlInput").value = "";
    fetchUrls(); // reload table
  } catch (err) {
    console.error("Error:", err);
    output.textContent = "Something went wrong!";
    output.style.color = "red";
  }
}

async function fetchUrls() {
  try {
    const res = await fetch(`${API_BASE}/urls`);
    urlData = await res.json();
    updateTable();
  } catch (err) {
    console.error("Error fetching URLs:", err);
  }
}

async function updateTable() {
  const tbody = document.getElementById("urlTableBody");
  tbody.innerHTML = "";
  urlData.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><a href="${item.url}" target="_blank">${item.url}</a></td>
      <td><a href="${API_BASE}/${item.shorturl}" class="short-link" target="_blank">
          ${window.location.origin}/${item.shorturl}
      </a></td>
      <td>${item.count || 0}</td>
      <td><button class="delete-btn" onclick="deleteUrl('${item.id}')">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

async function deleteUrl(id) {
  if (!confirm("Are you sure you want to delete this URL?")) return;

  try {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchUrls(); // refresh table
  } catch (err) {
    console.error("Error deleting:", err);
  }
}
