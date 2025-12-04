// Change this if your backend uses a different port
const API_BASE_URL = "http://localhost:3000";

// Change this if your login route is different
const LOGIN_ENDPOINT = "/api/auth/login";

let token = localStorage.getItem("token") || null;
let currentUser = null;

// DOM elements
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const resultContainer = document.getElementById("result-container");
const resultMeta = document.getElementById("result-meta");
const resultStatusPill = document.getElementById("result-status-pill");
const contentTitle = document.getElementById("content-title");
const topRightArea = document.getElementById("top-right-area");

const navButtons = document.querySelectorAll(".nav-btn");
const messagesForm = document.getElementById("messages-consultation-form");
const consultationIdInput = document.getElementById("consultationIdInput");

const STATUS_MESSAGES = {
  0: "Could not reach server.",
  200: "OK – Request succeeded.",
  201: "Created – Resource has been created.",
  400: "Bad request.",
  401: "Unauthorized – Please login.",
  403: "Forbidden.",
  404: "Not found.",
  500: "Internal server error.",
};

// ------------ Helpers ------------

function setStatus(type, statusCode) {
  resultStatusPill.style.display = "inline-flex";
  resultStatusPill.className = "status-pill";

  if (type === "loading") {
    resultStatusPill.classList.add("status-loading");
    resultStatusPill.textContent = "Loading...";
  } else if (type === "error") {
    resultStatusPill.classList.add("status-error");
    resultStatusPill.textContent =
      STATUS_MESSAGES[statusCode] || `Error (${statusCode})`;
  } else if (type === "success") {
    resultStatusPill.classList.add("status-ok");
    resultStatusPill.textContent =
      STATUS_MESSAGES[statusCode] || `Success (${statusCode})`;
  }
}

function updateTopRight() {
  if (token && currentUser) {
    topRightArea.innerHTML = `
      <span class="pill">${currentUser.email || "User"}</span>
      <span class="pill">${currentUser.role || "Role"}</span>
      <button class="btn btn-outline" id="logout-btn">Logout</button>
    `;
    document
      .getElementById("logout-btn")
      .addEventListener("click", handleLogout);
  } else {
    topRightArea.innerHTML = `
      <span class="pill">Not signed in</span>
    `;
  }
}

function updateUI() {
  if (token) {
    loginSection.style.display = "none";
    appSection.style.display = "block";
  } else {
    loginSection.style.display = "flex";
    appSection.style.display = "none";
  }
  updateTopRight();
}

function buildUrl(path) {
  return API_BASE_URL + path;
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(buildUrl(path), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = null;
  }

  if (!res.ok) {
    throw { status: res.status, body, endpoint: path };
  }

  return { status: res.status, body, endpoint: path };
}

// ------------ Rendering (NO JSON) ------------

function formatValue(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  // for arrays/objects we don't show raw JSON
  return "[More details]";
}

function renderKeyValueCard(title, obj, options = {}) {
  const ignore = options.ignoreKeys || [];
  const preferred = options.preferredOrder || [];
  const wrapper = document.createElement("div");
  wrapper.className = "card-item";

  const header = document.createElement("div");
  header.className = "card-item-header";

  const titleEl = document.createElement("div");
  titleEl.className = "card-item-title";
  titleEl.textContent = title;

  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = options.chipText || "Summary";

  header.appendChild(titleEl);
  header.appendChild(chip);
  wrapper.appendChild(header);

  const dl = document.createElement("dl");

  if (!obj || Object.keys(obj).length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No data.";
    wrapper.appendChild(empty);
    return wrapper;
  }

  const keys = Object.keys(obj);
  const orderedKeys = [
    ...preferred.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !preferred.includes(k)),
  ];

  orderedKeys.forEach((key) => {
    if (ignore.includes(key)) return;
    const dt = document.createElement("dt");
    dt.textContent = key;

    const dd = document.createElement("dd");
    dd.textContent = formatValue(obj[key]);

    dl.appendChild(dt);
    dl.appendChild(dd);
  });

  wrapper.appendChild(dl);
  return wrapper;
}

function renderArray(title, arr, options = {}) {
  const container = document.createElement("div");

  if (!Array.isArray(arr) || arr.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No items found.";
    container.appendChild(empty);
    return container;
  }

  arr.forEach((item, index) => {
    const card = renderKeyValueCard(
      `${title} #${index + 1}`,
      item,
      options
    );
    container.appendChild(card);
  });

  return container;
}

function renderDashboardLinks(linksObj, label) {
  const container = document.createElement("div");
  const titleCard = document.createElement("div");
  titleCard.className = "card-item";
  const header = document.createElement("div");
  header.className = "card-item-header";

  const t = document.createElement("div");
  t.className = "card-item-title";
  t.textContent = label;

  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = "API links";

  header.appendChild(t);
  header.appendChild(chip);
  titleCard.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "links-grid";

  Object.entries(linksObj || {}).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "link-row";

    const left = document.createElement("div");
    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = key;

    const pathSpan = document.createElement("span");
    pathSpan.className = "path";
    pathSpan.textContent = value;

    left.appendChild(nameSpan);
    left.appendChild(document.createElement("br"));
    left.appendChild(pathSpan);

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "GET";

    row.appendChild(left);
    row.appendChild(badge);

    grid.appendChild(row);
  });

  titleCard.appendChild(grid);
  container.appendChild(titleCard);

  return container;
}

function renderAdminStatistics(body) {
  const frag = document.createDocumentFragment();

  // Totals
  if (body.totals) {
    const totalsCard = renderKeyValueCard("System totals", body.totals, {
      preferredOrder: [
        "users",
        "patients",
        "doctors",
        "consultations",
        "workshops",
        "healthGuides",
        "publicAlerts",
      ],
      chipText: "Counts",
    });
    frag.appendChild(totalsCard);
  }

  // Consultations by status
  if (body.consultationsByStatus) {
    const statusCard = renderKeyValueCard(
      "Consultations by status",
      body.consultationsByStatus,
      {
        chipText: "Grouped",
      }
    );
    frag.appendChild(statusCard);
  }

  // Upcoming workshops
  if (Array.isArray(body.upcomingWorkshops)) {
    const w = renderArray("Upcoming workshop", body.upcomingWorkshops, {
      chipText: "Workshop",
    });
    frag.appendChild(w);
  }

  // Latest users
  if (Array.isArray(body.latestUsers)) {
    const u = renderArray("Latest user", body.latestUsers, {
      chipText: "User",
      preferredOrder: ["id", "email", "role", "createdAt"],
    });
    frag.appendChild(u);
  }

  // Latest consultations
  if (Array.isArray(body.latestConsultations)) {
    const c = renderArray("Latest consultation", body.latestConsultations, {
      chipText: "Consultation",
    });
    frag.appendChild(c);
  }

  // Active alerts
  if (Array.isArray(body.activeAlerts)) {
    const a = renderArray("Active alert", body.activeAlerts, {
      chipText: "Alert",
    });
    frag.appendChild(a);
  }

  return frag;
}

function renderFriendly(endpoint, body) {
  resultContainer.innerHTML = "";

  // Simple text
  if (typeof body === "string") {
    const div = document.createElement("div");
    div.className = "card-item";
    div.textContent = body;
    resultContainer.appendChild(div);
    return;
  }

  if (body === null || body === undefined) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No response body.";
    resultContainer.appendChild(empty);
    return;
  }

  // Dashboards (user/admin) => dashboard.links + optional stats
  if (
    endpoint.includes("/dashboard") &&
    typeof body === "object" &&
    body.dashboard
  ) {
    const dash = body.dashboard;
    const frag = document.createDocumentFragment();

    if (dash.stats) {
      const statsCard = renderKeyValueCard("Dashboard statistics", dash.stats, {
        chipText: "Stats",
      });
      frag.appendChild(statsCard);
    }

    if (dash.links) {
      const linksBlock = renderDashboardLinks(
        dash.links,
        "Dashboard links"
      );
      frag.appendChild(linksBlock);
    }

    resultContainer.appendChild(frag);
    return;
  }

  // Admin statistics endpoint
  if (endpoint.includes("/api/admin/statistics")) {
    const frag = renderAdminStatistics(body);
    resultContainer.appendChild(frag);
    return;
  }

  // User profile
  if (body && body.email && body.role) {
    const card = renderKeyValueCard("User profile", body, {
      preferredOrder: ["id", "name", "email", "role", "createdAt"],
      chipText: "Account",
    });
    resultContainer.appendChild(card);
    return;
  }

  // Arrays: consultations, workshops, messages, guides, alerts...
  if (Array.isArray(body)) {
    const title = endpoint.includes("consultations")
      ? "Consultation"
      : endpoint.includes("workshops")
      ? "Workshop"
      : endpoint.includes("messages")
      ? "Message"
      : endpoint.includes("guides")
      ? "Guide"
      : endpoint.includes("alerts")
      ? "Alert"
      : "Item";

    const block = renderArray(title, body);
    resultContainer.appendChild(block);
    return;
  }

  // Generic object => key/value card
  if (typeof body === "object") {
    const card = renderKeyValueCard("Details", body);
    resultContainer.appendChild(card);
    return;
  }

  const fallback = document.createElement("div");
  fallback.className = "card-item";
  fallback.textContent =
    "Response received but could not be displayed in a structured way.";
  resultContainer.appendChild(fallback);
}

// ------------ Events ------------

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    loginError.textContent = "Please enter both email and password.";
    return;
  }

  setStatus("loading", 0);

  try {
    const { status, body } = await apiRequest(LOGIN_ENDPOINT, {
      method: "POST",
      body: { email, password },
    });

    // Typical shape: { token, user }
    token = body.token;
    currentUser = body.user || null;

    if (!token) {
      throw { status, body };
    }

    localStorage.setItem("token", token);
    updateUI();
    setStatus("success", status);
    resultMeta.textContent =
      "Login successful. Choose an endpoint from the sidebar.";
    resultContainer.innerHTML = `
      <div class="empty">
        Welcome ${currentUser?.name || currentUser?.email || ""}!<br/>
        Use the sidebar to load dashboards and resources.
      </div>
    `;
  } catch (err) {
    console.error(err);
    token = null;
    currentUser = null;
    localStorage.removeItem("token");
    updateUI();
    setStatus("error", err.status || 0);
    loginError.textContent =
      (err.body && err.body.message) ||
      "Login failed. Check credentials or login endpoint.";
  }
});

function handleLogout() {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  updateUI();
  resultStatusPill.style.display = "none";
  resultMeta.textContent = "Logged out.";
  resultContainer.innerHTML = `
    <div class="empty">
      You have been logged out.
    </div>
  `;
  navButtons.forEach((btn) => btn.classList.remove("active"));
}

// Sidebar buttons: generic endpoints
navButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (!token) {
      resultMeta.textContent = "Please login first.";
      setStatus("error", 401);
      return;
    }

    const endpoint = btn.dataset.endpoint;
    const method = btn.dataset.method || "GET";
    const title = btn.dataset.title || "Result";

    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    contentTitle.textContent = title;
    resultMeta.textContent = `${method} ${endpoint}`;
    setStatus("loading", 0);

    resultContainer.innerHTML = `
      <div class="empty">
        Fetching data...
      </div>
    `;

    try {
      const { status, body } = await apiRequest(endpoint, { method });
      setStatus("success", status);
      renderFriendly(endpoint, body);
    } catch (err) {
      console.error(err);
      setStatus("error", err.status || 0);
      resultMeta.textContent = `${method} ${endpoint}`;
      renderFriendly(err.endpoint || endpoint, err.body || { message: "Request failed." });
    }
  });
});

// Messages by consultationId
if (messagesForm) {
  messagesForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!token) {
      resultMeta.textContent = "Please login first.";
      setStatus("error", 401);
      return;
    }

    const id = consultationIdInput.value.trim();
    if (!id) {
      resultMeta.textContent = "Please enter a consultation ID.";
      setStatus("error", 400);
      return;
    }

    const endpoint = `/api/messages/${id}`;
    const method = "GET";
    const title = `Messages for consultation #${id}`;

    navButtons.forEach((b) => b.classList.remove("active"));

    contentTitle.textContent = title;
    resultMeta.textContent = `${method} ${endpoint}`;
    setStatus("loading", 0);

    resultContainer.innerHTML = `
      <div class="empty">
        Fetching messages for consultation ${id}...
      </div>
    `;

    try {
      const { status, body } = await apiRequest(endpoint, { method });
      setStatus("success", status);
      renderFriendly(endpoint, body);
    } catch (err) {
      console.error(err);
      setStatus("error", err.status || 0);
      renderFriendly(err.endpoint || endpoint, err.body || { message: "Request failed." });
    }
  });
}

// On page load: if we have a stored token, try /api/users/me
async function bootstrap() {
  if (!token) {
    updateUI();
    return;
  }

  setStatus("loading", 0);

  try {
    const { body } = await apiRequest("/api/users/me", {
      method: "GET",
    });
    currentUser = body;
    updateUI();
    setStatus("success", 200);
    resultMeta.textContent =
      "Restored session from stored token. Use the sidebar to load endpoints.";
    resultContainer.innerHTML = `
      <div class="empty">
        Welcome back ${currentUser?.name || currentUser?.email || ""}!<br/>
        Use the sidebar to explore dashboards and data.
      </div>
    `;
  } catch (err) {
    console.error(err);
    token = null;
    currentUser = null;
    localStorage.removeItem("token");
    updateUI();
    resultStatusPill.style.display = "none";
    resultContainer.innerHTML = `
      <div class="empty">
        Session expired or invalid token.<br/>
        Please login again.
      </div>
    `;
  }
}

bootstrap();
updateUI();
