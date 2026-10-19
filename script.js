"use strict";
document.documentElement.classList.add("js");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionBehavior = () => (reducedMotion.matches ? "instant" : "smooth");
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
function setMenuOpen(open, returnFocus = false) {
  navLinks.classList.toggle("active", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu",
  );
  menuBtn.firstElementChild.textContent = open ? "✕" : "☰";
  if (returnFocus) menuBtn.focus();
}
menuBtn.addEventListener("click", () =>
  setMenuOpen(menuBtn.getAttribute("aria-expanded") !== "true"),
);
navLinks
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".navbar")) setMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuBtn.getAttribute("aria-expanded") === "true"
  )
    setMenuOpen(false, true);
});
window
  .matchMedia("(min-width: 801px)")
  .addEventListener("change", () => setMenuOpen(false));

const topBtn = document.querySelector("#topBtn");
const progressBar = document.querySelector("#progress-bar");
const sections = [...document.querySelectorAll("main > section[id]")];
const navItems = [...navLinks.querySelectorAll("a")];
const chapterProgress = [...document.querySelectorAll(".chapter-progress")].map(
  (bar) => ({
    bar,
    section: document.getElementById(bar.dataset.section),
    seen: 0,
  }),
);
let scrollFrame = 0;
function updateScrollState() {
  scrollFrame = 0;
  topBtn.hidden = window.scrollY < 400;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  let current = "home";
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top < 150) current = section.id;
  });
  navItems.forEach((link) => {
    const active = link.hash === `#${current}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  // Adapted from the reference's sectionProgress hook: actual viewing only.
  chapterProgress.forEach((item) => {
    const r = item.section.getBoundingClientRect();
    const seen =
      (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.25);
    item.seen = Math.max(item.seen, Math.min(1, Math.max(0, seen)));
    item.bar.style.width = `${item.seen * 100}%`;
  });
}
function scheduleScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
}
window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollUpdate);
updateScrollState();
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: motionBehavior() });
  document.querySelector(".brand").focus({ preventScroll: true });
});

// Native scrolling and boundary controls adapted from the reference RailButtons.
const rail = document.getElementById("project-rail");
const railPrev = document.getElementById("rail-prev");
const railNext = document.getElementById("rail-next");
function updateRail() {
  railPrev.disabled = rail.scrollLeft < 8;
  railNext.disabled =
    rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
}
function pageRail(direction) {
  const card = rail.querySelector(".project-card:not([hidden])");
  rail.scrollBy({
    left: direction * (card.getBoundingClientRect().width + 25),
    behavior: motionBehavior(),
  });
}
railPrev.addEventListener("click", () => pageRail(-1));
railNext.addEventListener("click", () => pageRail(1));
rail.addEventListener("scroll", updateRail, { passive: true });
window.addEventListener("resize", updateRail);
rail.addEventListener("keydown", (event) => {
  if (event.target !== rail || !["ArrowLeft", "ArrowRight"].includes(event.key))
    return;
  event.preventDefault();
  pageRail(event.key === "ArrowRight" ? 1 : -1);
});
const projectCards = [...rail.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    projectCards.forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.genre !== button.dataset.filter;
    });
    rail.scrollTo({ left: 0, behavior: "instant" });
    const count = projectCards.filter((card) => !card.hidden).length;
    document.getElementById("filter-status").textContent =
      button.dataset.filter === "all"
        ? `Showing all ${count} projects`
        : `Showing ${count} projects`;
    requestAnimationFrame(updateRail);
  }),
);
updateRail();

const projectDialog = document.getElementById("project-dialog");
const introDialog = document.getElementById("intro-dialog");
const content = document.getElementById("project-dialog-content");
let dialogTrigger = null;
function openDialog(dialog, trigger) {
  dialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add("modal-open");
  dialog.scrollTop = 0;
}
[projectDialog, introDialog].forEach((dialog) => {
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const r = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    dialogTrigger?.focus({ preventScroll: true });
  });
});
projectCards.forEach((card) => {
  const summary = card.querySelector("summary");
  summary.setAttribute("aria-haspopup", "dialog");
  summary.setAttribute("aria-controls", "project-dialog");
  summary.addEventListener("click", (event) => {
    if (!projectDialog.showModal) return;
    event.preventDefault();
    content.replaceChildren();
    const kicker = card.querySelector(".project-kicker").cloneNode(true);
    const title = document.createElement("h2");
    title.id = "project-dialog-title";
    title.textContent = card.querySelector("h3").textContent;
    const description = card
      .querySelector(":scope > p:not(.project-kicker)")
      .cloneNode(true);
    const stack = card.querySelector(".project-tech").cloneNode(true);
    const study = card.querySelector(".case-study-content").cloneNode(true);
    const links = card.querySelector(".project-links").cloneNode(true);
    content.append(kicker, title, description, stack, study, links);
    openDialog(projectDialog, summary);
  });
});
// A direct project anchor reveals the right card even after filtering.
function revealHashProject() {
  const card = projectCards.find((item) => `#${item.id}` === location.hash);
  if (!card) return;
  if (card.hidden) filterButtons[0].click();
  const offset = card.offsetLeft - rail.offsetLeft;
  rail.scrollTo({ left: offset, behavior: "instant" });
  card.scrollIntoView({
    block: "nearest",
    inline: "nearest",
    behavior: motionBehavior(),
  });
}
window.addEventListener("hashchange", revealHashProject);
revealHashProject();

const slides = [...document.querySelectorAll(".intro-slide")];
let slideIndex = 0;
const introPrev = document.getElementById("intro-prev");
const introNext = document.getElementById("intro-next");
function showSlide(index) {
  slideIndex = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    slide.hidden = i !== slideIndex;
    slide.querySelector("h2").removeAttribute("id");
  });
  slides[slideIndex].querySelector("h2").id = "intro-title";
  introPrev.disabled = slideIndex === 0;
  introNext.disabled = slideIndex === slides.length - 1;
  document.getElementById("intro-status").textContent =
    `0${slideIndex + 1} / 03`;
}
document.getElementById("play-intro").addEventListener("click", (event) => {
  showSlide(0);
  openDialog(introDialog, event.currentTarget);
});
introPrev.addEventListener("click", () => showSlide(slideIndex - 1));
introNext.addEventListener("click", () => showSlide(slideIndex + 1));
introDialog.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    showSlide(slideIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
document
  .getElementById("intro-explore")
  .addEventListener("click", () => introDialog.close());

const portrait = document.querySelector(".profile-card");
portrait.addEventListener("click", () => {
  if (reducedMotion.matches) return;
  portrait.classList.remove("is-orbiting");
  void portrait.offsetWidth;
  portrait.classList.add("is-orbiting");
});
portrait.addEventListener("animationend", () =>
  portrait.classList.remove("is-orbiting"),
);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-title,.section-heading,.timeline-item,.skill-card",
    )
    .forEach((item) => observer.observe(item));
}
