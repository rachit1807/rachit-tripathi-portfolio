const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

function setMenuOpen(open) {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    const icon = menuBtn.querySelector("i");
    if (icon) {
        icon.classList.toggle("fa-bars", !open);
        icon.classList.toggle("fa-xmark", open);
    }
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        setMenuOpen(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });
}

const topBtn = document.getElementById("topBtn");
const progressBar = document.getElementById("progress-bar");

function updateScrollState() {
    if (topBtn) topBtn.style.display = window.scrollY > 300 ? "block" : "none";

    if (progressBar) {
        const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

const sections = document.querySelectorAll("main > section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });

    navItems.forEach((link) => {
        const active = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
}, { passive: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".section,.project-card,.skill-card,.timeline-item,.certificate-card,.education-card,.achievement-card").forEach((element) => {
        element.classList.add("hidden");
        observer.observe(element);
    });
}
