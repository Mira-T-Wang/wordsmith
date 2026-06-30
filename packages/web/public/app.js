const state = {
  streakDays: 12,
  cardsDue: 14,
};

document.getElementById("streak-line").textContent =
  `Your ${state.streakDays}-day streak is waiting. Don't break the chain.`;

// View switching: show one auth view, hide the others
const views = {
  login: document.getElementById("view-login"),
  signup: document.getElementById("view-signup"),
  forgot: document.getElementById("view-forgot"),
};

function showView(name) {
  Object.values(views).forEach((v) => v.classList.add("hidden"));
  views[name].classList.remove("hidden");
}

document.getElementById("signup").addEventListener("click", () => showView("signup"));
document.getElementById("forgot").addEventListener("click", () => showView("forgot"));
document.getElementById("to-login").addEventListener("click", () => showView("login"));
document.getElementById("to-login-2").addEventListener("click", () => showView("login"));

// ---- Showcase slides
const slides = [
  {
    eyebrow: "Type to learn",
    title: "Learn words by<br>typing them.",
    body: "Every review is a typing drill. The faster and more accurately you recall a word, the better you know it.",
    visual: "leaderboard",
  },
  {
    eyebrow: "How it works",
    title: "See the meaning,<br>type the word.",
    body: "We show you a definition; you type the word from memory. Speed and accuracy both feed your score.",
    visual: "flow",
  },
  {
    eyebrow: "Levels & themes",
    title: "Climb from<br>Starter to Pro.",
    body: "Themed decks — fruits, emotions, law, and more — each with words tuned to your level.",
    visual: "tiers",
  },
  {
    eyebrow: "Build the habit",
    title: "Don't break<br>the chain.",
    body: "A daily goal keeps your streak alive. Miss a day? A quick rescue session saves it.",
    visual: "streak",
  },
  {
    eyebrow: "Compete",
    title: "Race the fastest<br>learners.",
    body: "Weekly leaderboards rank you on speed and recall together — not just how fast you can type.",
    visual: "leaderboard",
  },
];

// ---- Visual builders (the little graphic inside each slide)
const leaderboard = [
  { rank: 1, name: "kira_types", wpm: 96, color: "#b23a2e" },
  { rank: 2, name: "devansh",    wpm: 91, color: "#3a7ca5" },
  { rank: 3, name: "maya",       wpm: 82, color: "#e3a23c", you: true },
  { rank: 4, name: "lukefox",    wpm: 78, color: "#5c6b4f" },
];

const tiers = [
  { label: "Starter", status: "done" },
  { label: "Beginner", status: "done" },
  { label: "Intermediate", status: "current" },
  { label: "Advanced", status: "locked" },
  { label: "Pro", status: "locked" },
];

function visualLeaderboard() {
  const rows = leaderboard.map((u) => `
    <li class="board__row ${u.you ? "is-you" : ""}">
      <span class="board__rank">${u.rank}</span>
      <span class="board__avatar" style="background:${u.color}">${u.name.charAt(0).toUpperCase()}</span>
      <span class="board__name">${u.name}</span>
      <span class="board__wpm">${u.wpm}<span>wpm</span></span>
    </li>`).join("");
  return `<div class="board"><div class="board__head"><span>Leaderboard</span><span class="board__filter">This week</span></div><ul class="board__list">${rows}</ul></div>`;
}

function visualTiers() {
  const dots = tiers.map((t) => `
    <div class="tier is-${t.status}"><span class="tier__dot"></span><span class="tier__label">${t.label}</span></div>`).join("");
  return `<div class="tiers"><div class="tiers__track"><div class="tiers__line"></div>${dots}</div></div>`;
}

function visualStreak() {
  return `<div class="streak-badge">
      <span class="streak-badge__icon" aria-hidden="true">🔥</span>
      <div class="streak-badge__main"><strong>${state.streakDays} days</strong><span>Current streak</span></div>
      <div class="streak-badge__due"><strong>${state.cardsDue}</strong><span>cards due</span></div>
    </div>`;
}

function visualFlow() {
  return `<div class="flow">
      <div class="flow__card flow__card--def">"occurring by happy chance"</div>
      <div class="flow__arrow" aria-hidden="true">↓</div>
      <div class="flow__card flow__card--type">seren<span class="flow__caret"></span></div>
    </div>`;
}

const visuals = {
  leaderboard: visualLeaderboard,
  tiers: visualTiers,
  streak: visualStreak,
  flow: visualFlow,
};

// ---- Slideshow engine 
const SLIDE_MS = 5000;
const slidesEl = document.getElementById("slides");
const dotsEl = document.getElementById("dots");
let current = 0;
let timer = null;

function renderSlides() {
  slidesEl.innerHTML = slides.map((s, i) => `
    <article class="slide" data-index="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
      <p class="slide__eyebrow">${s.eyebrow}</p>
      <h2 class="slide__title">${s.title}</h2>
      <p class="slide__body">${s.body}</p>
      <div class="slide__visual">${visuals[s.visual] ? visuals[s.visual]() : ""}</div>
    </article>`).join("");

  dotsEl.innerHTML = slides.map((_, i) => `
    <button class="dot ${i === 0 ? "is-active" : ""}" data-dot="${i}" role="tab"
      aria-label="Slide ${i + 1}" aria-selected="${i === 0 ? "true" : "false"}"></button>`).join("");
}

function goTo(index) {
  current = (index + slides.length) % slides.length;
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  [...slidesEl.children].forEach((el, i) =>
    el.setAttribute("aria-hidden", String(i !== current)));
  [...dotsEl.children].forEach((el, i) => {
    el.classList.toggle("is-active", i === current);
    el.setAttribute("aria-selected", String(i === current));
  });
}

function next() { goTo(current + 1); }

function startTimer() { stopTimer(); timer = setInterval(next, SLIDE_MS); }
function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

function initShowcase() {
  renderSlides();
  goTo(0);
  startTimer();

  dotsEl.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-dot]");
    if (!dot) return;
    goTo(Number(dot.dataset.dot));
    startTimer(); // reset the clock after a manual jump
  });

  const showcase = document.getElementById("showcase");
  showcase.addEventListener("mouseenter", stopTimer);
  showcase.addEventListener("mouseleave", startTimer);
}

// ---- Form: validation + interactions 
const emailEl = document.getElementById("email");
const pwEl = document.getElementById("password");

function setError(field, msg) {
  const input = document.getElementById(field);
  const err = document.querySelector(`[data-error-for="${field}"]`);
  if (msg) { input.classList.add("is-invalid"); err.textContent = msg; err.classList.add("show"); }
  else { input.classList.remove("is-invalid"); err.textContent = ""; err.classList.remove("show"); }
}

function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function validate() {
  let ok = true;
  if (!validEmail(emailEl.value)) { setError("email", "Enter a valid email address."); ok = false; } else setError("email", "");
  if (pwEl.value.length < 8) { setError("password", "Password must be at least 8 characters."); ok = false; } else setError("password", "");
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

// Auth stubs — not real yet
function handleLogin() {
  if (!validate()) return;
  console.log("[stub] handleLogin", { email: emailEl.value.trim(), remember: document.getElementById("remember").checked });
  alert("Login is stubbed for now — form is valid. Real auth comes later.");
}
function handleOAuth(provider) { console.log("[stub] handleOAuth", provider); alert(`${provider} sign-in is stubbed for now.`); }

document.getElementById("submit").addEventListener("click", handleLogin);
document.querySelectorAll("[data-provider]").forEach((b) => b.addEventListener("click", () => handleOAuth(b.dataset.provider)));
[emailEl, pwEl].forEach((el) => el.addEventListener("keydown", (e) => { if (e.key === "Enter") handleLogin(); }));

// Signup form
const suName = document.getElementById("su-name");
const suEmail = document.getElementById("su-email");
const suPw = document.getElementById("su-password");

function validateSignup() {
  let ok = true;
  if (suName.value.trim().length < 2) { setError("su-name", "Tell us your name."); ok = false; } else setError("su-name", "");
  if (!validEmail(suEmail.value)) { setError("su-email", "Enter a valid email address."); ok = false; } else setError("su-email", "");
  if (suPw.value.length < 8) { setError("su-password", "Password must be at least 8 characters."); ok = false; } else setError("su-password", "");
  return ok;
}

function handleSignup() {
  if (!validateSignup()) return;
  console.log("[stub] handleSignup", { name: suName.value.trim(), email: suEmail.value.trim() });
  alert("Signup is stubbed for now — form is valid. Real account creation comes later.");
}

document.getElementById("su-submit").addEventListener("click", handleSignup);
document.getElementById("su-toggle-pw").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const showing = suPw.type === "text";
  suPw.type = showing ? "password" : "text";
  btn.textContent = showing ? "Show" : "Hide";
  btn.setAttribute("aria-pressed", String(!showing));
});

[suName, suEmail, suPw].forEach((el) =>
  el.addEventListener("input", () => { if (el.classList.contains("is-invalid")) setError(el.id, ""); }));

// Forgot-password form
const fpEmail = document.getElementById("fp-email");

function handleForgot() {
  if (!validEmail(fpEmail.value)) { setError("fp-email", "Enter a valid email address."); return; }
  setError("fp-email", "");
  console.log("[stub] handleForgot", { email: fpEmail.value.trim() });
  alert("Reset link is stubbed for now — form is valid. Real email sending comes later.");
}

document.getElementById("fp-submit").addEventListener("click", handleForgot);
fpEmail.addEventListener("input", () => { if (fpEmail.classList.contains("is-invalid")) setError("fp-email", ""); });

initShowcase();