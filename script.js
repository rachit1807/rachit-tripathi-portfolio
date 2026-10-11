const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");

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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navLinks.classList.contains("active")) {
            setMenuOpen(false);
            menuBtn.focus();
        }
    });
}

const topBtn = document.getElementById("topBtn");
const progressBar = document.getElementById("progress-bar");

function updateScrollState() {
    if (topBtn) topBtn.style.display = window.scrollY > 300 ? "block" : "none";
    if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 12);

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

const profileCard = document.querySelector(".profile-card");
profileCard?.addEventListener("click", () => {
    if (reducedMotion) return;
    profileCard.classList.remove("is-orbiting");
    void profileCard.offsetWidth;
    profileCard.classList.add("is-orbiting");
});
profileCard?.addEventListener("animationend", (event) => {
    if (event.animationName === "portrait-orbit") profileCard.classList.remove("is-orbiting");
});

const lightningTargets = ".profile-card,.about-image,.about-content,.info-box,.skill-card,.timeline-content,.project-card,.certificate-card,.education-card,.achievement-card,.contact-info,.contact-form";
const strikeTimers = new WeakMap();
const svgNamespace = "http://www.w3.org/2000/svg";

function makeLightningPath(svg, points, className) {
    const path = document.createElementNS(svgNamespace, "path");
    const d = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "100");
    path.setAttribute("class", className);
    svg.append(path);
}

function strikeBox(target, event) {
    const previousTimer = strikeTimers.get(target);
    if (previousTimer) clearTimeout(previousTimer);
    target.querySelector(":scope > .lightning-strike")?.remove();
    target.classList.remove("lightning-struck", "lightning-static");

    if (reducedMotion) {
        target.classList.add("lightning-static");
        strikeTimers.set(target, setTimeout(() => target.classList.remove("lightning-static"), 650));
        return;
    }

    const bounds = target.getBoundingClientRect();
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const originX = clamp(event.clientX - bounds.left, 4, width - 4);
    const originY = clamp(event.clientY - bounds.top, 4, height - 4);
    const horizontal = originX < width / 2 ? 1 : -1;
    const vertical = originY < height / 2 ? 1 : -1;
    const point = (x, y) => [clamp(x, 2, width - 2), clamp(y, 2, height - 2)];
    const bolt = [
        point(originX, originY),
        point(originX + horizontal * width * .13, originY + vertical * height * .17),
        point(originX + horizontal * width * .04, originY + vertical * height * .31),
        point(originX + horizontal * width * .2, originY + vertical * height * .45),
        point(originX + horizontal * width * .1, originY + vertical * height * .61),
        point(originX - horizontal * width * .03, originY + vertical * height * .83)
    ];
    const branchOne = [bolt[1], point(bolt[1][0] - horizontal * width * .15, bolt[1][1] + vertical * height * .09), point(bolt[1][0] - horizontal * width * .12, bolt[1][1] + vertical * height * .19)];
    const branchTwo = [bolt[3], point(bolt[3][0] + horizontal * width * .14, bolt[3][1] + vertical * height * .08), point(bolt[3][0] + horizontal * width * .18, bolt[3][1] + vertical * height * .18)];

    const flash = document.createElement("span");
    flash.className = "lightning-strike";
    flash.setAttribute("aria-hidden", "true");
    flash.style.setProperty("--strike-x", `${originX}px`);
    flash.style.setProperty("--strike-y", `${originY}px`);

    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    makeLightningPath(svg, bolt, "bolt-glow");
    makeLightningPath(svg, bolt, "bolt-core");
    makeLightningPath(svg, branchOne, "bolt-glow");
    makeLightningPath(svg, branchOne, "bolt-core");
    makeLightningPath(svg, branchTwo, "bolt-glow");
    makeLightningPath(svg, branchTwo, "bolt-core");
    flash.append(svg);
    target.append(flash);

    target.classList.remove("lightning-struck");
    void target.offsetWidth;
    target.classList.add("lightning-struck");

    const cleanup = () => {
        if (target.querySelector(":scope > .lightning-strike") === flash) flash.remove();
        target.classList.remove("lightning-struck");
        strikeTimers.delete(target);
    };
    flash.addEventListener("animationend", (animationEvent) => {
        if (animationEvent.target === flash && animationEvent.animationName === "lightning-wash") cleanup();
    });
    strikeTimers.set(target, setTimeout(cleanup, 800));
}

document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest(lightningTargets) : null;
    if (target) strikeBox(target, event);
});

if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                currentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll("main > .section,.project-card,.skill-card,.timeline-item,.certificate-card,.education-card,.achievement-card").forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
        element.classList.add("hidden");
        observer.observe(element);
    });
}

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero?.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        hero.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
    }, { passive: true });

    document.querySelectorAll(".project-card,.skill-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
            card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
        }, { passive: true });
        card.addEventListener("pointerleave", () => {
            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");
        });
    });
}
