const state = {
  streakDays: 12,
  cardsDue: 14,
  tiers: [
    { label: "Starter",      status: "done" },
    { label: "Beginner",     status: "done" },
    { label: "Intermediate", status: "current" },
    { label: "Advanced",     status: "locked" },
    { label: "Pro",          status: "locked" },
  ],
  leaderboard: [
    { rank: 1, name: "kira_types", wpm: 96, color: "#b23a2e", you: false },
    { rank: 2, name: "devansh",    wpm: 91, color: "#3a7ca5", you: false },
    { rank: 3, name: "maya",       wpm: 82, color: "#e3a23c", you: true  },
    { rank: 4, name: "lukefox",    wpm: 78, color: "#5c6b4f", you: false },
  ],
};

function initial(name) {
  return name.charAt(0).toUpperCase();
}

function renderStreak() {
  document.getElementById("streak-days").textContent = state.streakDays + " days";
  document.getElementById("cards-due").textContent = state.cardsDue;
  document.getElementById("streak-line").textContent =
    `Your ${state.streakDays}-day streak is waiting. Don't break the chain.`;
}

function renderLeaderboard() {
  const list = document.getElementById("board-list");
  list.innerHTML = state.leaderboard.map((u) => `
    <li class="board__row ${u.you ? "is-you" : ""}">
      <span class="board__rank">${u.rank}</span>
      <span class="board__avatar" style="background:${u.color}">${initial(u.name)}</span>
      <span class="board__name">${u.you ? "maya" : u.name}</span>
      <span class="board__wpm">${u.wpm}<span>wpm</span></span>
    </li>
  `).join("");
}

function renderTiers() {
  const wrap = document.getElementById("tiers");
  const dots = state.tiers.map((t) => `
    <div class="tier is-${t.status}">
      <span class="tier__dot"></span>
      <span class="tier__label">${t.label}</span>
    </div>
  `).join("");
  wrap.innerHTML = `<div class="tiers__track"><div class="tiers__line"></div>${dots}</div>`;
}

function render() {
  renderStreak();
  renderLeaderboard();
  renderTiers();
}

const emailEl = document.getElementById("email");
const pwEl = document.getElementById("password");

function setError(field, msg) {
  const input = document.getElementById(field);
  const err = document.querySelector(`[data-error-for="${field}"]`);
  if (msg) {
    input.classList.add("is-invalid");
    err.textContent = msg;
    err.classList.add("show");
  } else {
    input.classList.remove("is-invalid");
    err.textContent = "";
    err.classList.remove("show");
  }
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validate() {
  let ok = true;
  if (!validEmail(emailEl.value)) {
    setError("email", "Enter a valid email address.");
    ok = false;
  } else setError("email", "");

  if (pwEl.value.length < 8) {
    setError("password", "Password must be at least 8 characters.");
    ok = false;
  } else setError("password", "");

  return ok;
}

emailEl.addEventListener("input", () => { if (emailEl.classList.contains("is-invalid")) setError("email", ""); });
pwEl.addEventListener("input", () => { if (pwEl.classList.contains("is-invalid")) setError("password", ""); });

document.getElementById("toggle-pw").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const showing = pwEl.type === "text";
  pwEl.type = showing ? "password" : "text";
  btn.textContent = showing ? "Show" : "Hide";
  btn.setAttribute("aria-pressed", String(!showing));
});

// Auth stubs — not real yet. This is the one place that changes when we wire real login.
function handleLogin() {
  if (!validate()) return;
  const payload = {
    email: emailEl.value.trim(),
    remember: document.getElementById("remember").checked,
  };
  console.log("[stub] handleLogin →", payload);
  alert("Login is stubbed for now — form is valid. Real auth comes later.");
}

function handleOAuth(provider) {
  console.log("[stub] handleOAuth →", provider);
  alert(`${provider} sign-in is stubbed for now.`);
}

document.getElementById("submit").addEventListener("click", handleLogin);
document.querySelectorAll("[data-provider]").forEach((b) =>
  b.addEventListener("click", () => handleOAuth(b.dataset.provider))
);
document.getElementById("forgot").addEventListener("click", () => console.log("[stub] forgot password"));
document.getElementById("signup").addEventListener("click", () => console.log("[stub] start free / signup"));

[emailEl, pwEl].forEach((el) =>
  el.addEventListener("keydown", (e) => { if (e.key === "Enter") handleLogin(); })
);

render();