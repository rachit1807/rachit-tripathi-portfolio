// ===========================================
// Cursor Glow
// ===========================================

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

// ===========================================
// Scroll Progress Bar
// ===========================================

const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";

});

// ===========================================
// Mobile Navigation
// ===========================================

const menuBtn = document.querySelector(".menu-btn");

const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {

        menuBtn.innerHTML = '<i class="fas fa-times"></i>';

    } else {

        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    }

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    });

});

// ===========================================
// Active Navbar
// ===========================================

const sections = document.querySelectorAll("section");

const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;

        const height = section.clientHeight;

        if (pageYOffset >= top) {

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ===========================================
// Back To Top Button
// ===========================================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// ===========================================
// Counter Animation
// ===========================================

const counters = document.querySelectorAll(".counter");

const speed = 100;

const runCounter = () => {

    counters.forEach(counter => {

        const target = +counter.dataset.target;

        const count = +counter.innerText;

        const increment = Math.ceil(target / speed);

        if (count < target) {

            counter.innerText = count + increment;

            setTimeout(runCounter, 20);

        } else {

            counter.innerText = target;

        }

    });

};

const stats = document.querySelector(".stats");

if (stats) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                runCounter();

                observer.disconnect();

            }

        });

    });

    observer.observe(stats);

}

// ===========================================
// Fade Up Animation
// ===========================================

const fadeElements = document.querySelectorAll(

".about, .skills, .stats, .projects, .education, .experience, .certificates, .achievements, .contact"

);

const fadeObserver = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{threshold:.15});

fadeElements.forEach(section=>{

section.classList.add("fade-up");

fadeObserver.observe(section);

});

// ===========================================
// Current Year
// ===========================================

const year = new Date().getFullYear();

const copyright = document.querySelector(".copyright");

if(copyright){

copyright.innerHTML=`© ${year} Rachit Tripathi. All Rights Reserved.`;

}

// ===========================================
// Contact Form
// ===========================================

const form = document.querySelector("form");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

alert("Thank you! Your message has been received.");

form.reset();

});

}