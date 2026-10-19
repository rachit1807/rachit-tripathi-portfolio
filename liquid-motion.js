import { clamp, contain, collide, spring, disturb } from "./liquid-physics.mjs";

// GSAP owns the render clock when available; the same simulation has a native fallback.
class MotionClock {
  constructor(render) {
    this.render = render;
    this.running = false;
    this.frame = 0;
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.engine = window.gsap;
    this.last = performance.now();
    this.tick = () => {
      if (!this.running) return;
      const now = performance.now();
      this.render(Math.min((now - this.last) / 1000, 1 / 30), now / 1000);
      this.last = now;
      if (!this.engine) this.frame = requestAnimationFrame(this.tick);
    };
    if (this.engine) this.engine.ticker.add(this.tick);
    else this.frame = requestAnimationFrame(this.tick);
  }
  stop() {
    this.running = false;
    if (this.engine && this.tick) this.engine.ticker.remove(this.tick);
    cancelAnimationFrame(this.frame);
  }
}

class WaterLight {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.wakes = [];
    this.resize();
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Rasterize soft shafts once per resize, then drift the cached light layer.
    this.rays = document.createElement("canvas");
    this.rays.width = Math.ceil((this.width + 160) * 0.5);
    this.rays.height = Math.ceil((this.height + 80) * 0.5);
    const c = this.rays.getContext("2d");
    if (!c) return;
    c.scale(0.5, 0.5);
    c.filter = "blur(22px)";
    const w = this.width + 160,
      h = this.height + 80;
    for (let i = 0; i < 6; i++) {
      const x = w * (0.02 + i * 0.2);
      const fade = c.createLinearGradient(x, 0, x + w * 0.12, h);
      fade.addColorStop(0, "rgba(185,222,204,.045)");
      fade.addColorStop(0.6, "rgba(131,196,172,.012)");
      fade.addColorStop(1, "rgba(131,196,172,0)");
      c.fillStyle = fade;
      c.beginPath();
      c.moveTo(x - 10, -40);
      c.lineTo(x + 10, -40);
      c.lineTo(x + w * 0.35, h);
      c.lineTo(x - w * 0.06, h);
      c.closePath();
      c.fill();
    }
  }
  wake(x, y, speed) {
    this.wakes.push({ x, y, age: 0, strength: Math.min(speed / 18, 1) });
    if (this.wakes.length > 20) this.wakes.shift();
  }
  draw(dt, time) {
    const c = this.ctx,
      w = this.width,
      h = this.height;
    if (!c) return;
    c.clearRect(0, 0, w, h);
    const glow = c.createRadialGradient(
      w * 0.55,
      -h * 0.1,
      0,
      w * 0.55,
      0,
      w * 0.8,
    );
    glow.addColorStop(0, "rgba(158,229,199,.09)");
    glow.addColorStop(1, "rgba(158,229,199,0)");
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);
    c.drawImage(
      this.rays,
      -80 + Math.sin(time * 0.13) * 24,
      -20,
      w + 160,
      h + 80,
    );
    this.wakes = this.wakes.filter((wake) => (wake.age += dt) < 1.6);
    for (const wake of this.wakes) {
      const radius = 12 + wake.age * 80;
      c.strokeStyle = `rgba(161,222,201,${(1 - wake.age / 1.6) * 0.12 * wake.strength})`;
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(wake.x, wake.y, radius, radius * 0.55, -0.25, 0, Math.PI * 2);
      c.stroke();
    }
  }
  clear() {
    this.wakes.length = 0;
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }
}

class BuoyantContent {
  constructor() {
    const selectors =
      ".navbar,.hero-left,.hero-right,.hero-footer,.hero-buttons > *, .hero-social > a,.section-title,.section-heading,.project-card,.project-card .project-tags > *, .timeline-item,.skill-card,.about-image,.about-content,.about-content li,.certificate-card,.education-card,.achievement-card,.resume-card,.resume-actions > *, .contact-info,.contact-item,.contact-direct,.tool-pool-heading,.tool-orb,.chapter-nav > a,footer";
    this.bodies = [...document.querySelectorAll(selectors)].map((el, i) => {
      el.classList.add("liquid-body");
      return { el, x: 0, y: 0, vx: 0, vy: 0, phase: i * 1.81, visible: false };
    });
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          this.bodies.find((body) => body.el === entry.target).visible =
            entry.isIntersecting;
      },
      { rootMargin: "70px" },
    );
    this.bodies.forEach((body) => this.observer.observe(body.el));
  }
  wake(x, y, speed) {
    for (const body of this.bodies) {
      if (!body.visible || body.el.hidden || body.el.matches(":focus-within"))
        continue;
      const rect = body.el.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - x,
        dy = rect.top + rect.height / 2 - y;
      const nearX = clamp(x, rect.left, rect.right),
        nearY = clamp(y, rect.top, rect.bottom);
      if (Math.hypot(x - nearX, y - nearY) > 100) continue;
      const distance = Math.hypot(dx, dy) || 1;
      const impulse = Math.min(speed * 0.35, 6);
      body.vx += (dx / distance) * impulse;
      body.vy += (dy / distance) * impulse;
    }
  }
  update(dt, time) {
    for (const body of this.bodies) {
      if (!body.visible || body.el.hidden) continue;
      const focused =
        body.el.matches(":focus-within") ||
        document.body.classList.contains("modal-open");
      const x = focused ? 0 : Math.sin(time * 0.36 + body.phase) * 1.3;
      const y = focused ? 0 : Math.cos(time * 0.43 + body.phase) * 2;
      spring(body, x, y, dt, 12, 7);
      body.x = clamp(body.x, -7, 7);
      body.y = clamp(body.y, -7, 7);
      body.el.style.setProperty("--drift-x", `${body.x.toFixed(2)}px`);
      body.el.style.setProperty("--drift-y", `${body.y.toFixed(2)}px`);
      body.el.style.setProperty(
        "--sway",
        `${focused ? 0 : Math.sin(time * 0.3 + body.phase) * 0.09}deg`,
      );
    }
  }
  reset() {
    for (const body of this.bodies) {
      body.x = body.y = body.vx = body.vy = 0;
      body.el.style.removeProperty("--drift-x");
      body.el.style.removeProperty("--drift-y");
      body.el.style.removeProperty("--sway");
    }
  }
}

class ToolPool {
  constructor(pool) {
    this.pool = pool;
    this.enabled = false;
    this.bodies = [...pool.querySelectorAll(".tool-orb")].map((el, i) => ({
      el,
      phase: i * 2.1,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 36,
      dragging: false,
    }));
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(pool);
    this.bodies.forEach((body) => this.bind(body));
    this.visible = false;
    new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;
    }).observe(pool);
  }
  resize() {
    this.width = this.pool.clientWidth;
    this.height = this.pool.clientHeight;
    const diameter = this.bodies[0].el.offsetWidth;
    const cols = Math.min(
      6,
      Math.max(1, Math.floor((this.width - 16) / (diameter + 16))),
    );
    const rows = Math.ceil(this.bodies.length / cols);
    this.bodies.forEach((body, i) => {
      body.r = diameter / 2;
      body.homeX = (this.width * ((i % cols) + 0.5)) / cols;
      body.homeY = (this.height * (Math.floor(i / cols) + 0.5)) / rows;
      body.x = body.homeX;
      body.y = body.homeY;
      body.vx = body.vy = 0;
      body.dragging = false;
      this.paint(body);
    });
  }
  paint(body) {
    body.el.style.setProperty("--orb-x", `${(body.x - body.r).toFixed(2)}px`);
    body.el.style.setProperty("--orb-y", `${(body.y - body.r).toFixed(2)}px`);
  }
  bind(body) {
    let pointer = null,
      lastX = 0,
      lastY = 0,
      moved = 0;
    body.el.addEventListener("pointerdown", (event) => {
      if (!this.enabled || event.button !== 0) return;
      pointer = event.pointerId;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      body.dragging = true;
      body.vx = body.vy = 0;
      body.el.setPointerCapture(pointer);
      body.el.classList.add("is-dragging");
    });
    body.el.addEventListener("pointermove", (event) => {
      if (pointer !== event.pointerId) return;
      const dx = event.clientX - lastX,
        dy = event.clientY - lastY;
      moved += Math.hypot(dx, dy);
      body.x += dx;
      body.y += dy;
      body.vx = clamp(dx * 12, -140, 140);
      body.vy = clamp(dy * 12, -140, 140);
      contain(body, this.width, this.height);
      this.paint(body);
      lastX = event.clientX;
      lastY = event.clientY;
    });
    const release = (event) => {
      if (pointer !== event.pointerId) return;
      body.dragging = false;
      pointer = null;
      body.el.classList.remove("is-dragging");
      if (body.el.hasPointerCapture(event.pointerId))
        body.el.releasePointerCapture(event.pointerId);
    };
    body.el.addEventListener("pointerup", release);
    body.el.addEventListener("pointercancel", release);
    body.el.addEventListener("lostpointercapture", () => {
      pointer = null;
      body.dragging = false;
      body.el.classList.remove("is-dragging");
    });
    body.el.addEventListener("click", () => {
      if (!this.enabled || moved > 5) {
        moved = 0;
        return;
      }
      body.vx += Math.cos(body.phase) * 100;
      body.vy -= 110;
    });
    body.el.addEventListener("keydown", (event) => {
      const impulse = {
        ArrowLeft: [-110, 0],
        ArrowRight: [110, 0],
        ArrowUp: [0, -110],
        ArrowDown: [0, 110],
      }[event.key];
      if (!this.enabled || !impulse) return;
      event.preventDefault();
      body.vx += impulse[0];
      body.vy += impulse[1];
    });
  }
  wake(x, y, speed) {
    if (!this.visible) return;
    const rect = this.pool.getBoundingClientRect();
    for (const body of this.bodies)
      disturb(
        body,
        x - rect.left,
        y - rect.top,
        130,
        Math.min(speed * 1.5, 35),
      );
  }
  update(dt, time) {
    if (!this.visible) return;
    for (const body of this.bodies)
      spring(
        body,
        body.homeX + Math.sin(time * 0.45 + body.phase) * 13,
        body.homeY + Math.cos(time * 0.55 + body.phase) * 15,
        dt,
        1.7,
        1.8,
      );
    // Two positional passes resolve packed clusters without an expensive general solver.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < this.bodies.length; i++)
        for (let j = i + 1; j < this.bodies.length; j++)
          collide(this.bodies[i], this.bodies[j]);
      for (const body of this.bodies) contain(body, this.width, this.height);
    }
    this.bodies.forEach((body) => this.paint(body));
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    this.pool.classList.toggle("is-liquid", enabled);
    if (!enabled) this.resize();
  }
}

class LiquidPortfolio {
  constructor() {
    this.canvas = document.querySelector("#liquid-canvas");
    this.button = document.querySelector("#motion-toggle");
    this.media = matchMedia("(prefers-reduced-motion: reduce)");
    this.light = new WaterLight(this.canvas);
    this.content = new BuoyantContent();
    this.tools = new ToolPool(document.querySelector("#tool-pool"));
    this.clock = new MotionClock((dt, time) => {
      this.light.draw(dt, time);
      this.content.update(dt, time);
      this.tools.update(dt, time);
    });
    this.paused = false;
    this.lastPointer = null;
    this.lastWake = 0;
    this.button.hidden = false;
    this.button.addEventListener("click", () => {
      this.paused = !this.paused;
      this.sync();
    });
    this.media.addEventListener("change", () => this.sync());
    document.addEventListener("visibilitychange", () => this.sync());
    window.addEventListener("resize", () => this.light.resize(), {
      passive: true,
    });
    window.addEventListener("pointermove", (event) => this.pointer(event), {
      passive: true,
    });
    document.documentElement.addEventListener("pointerleave", () => {
      this.lastPointer = null;
    });
    this.sync();
  }
  pointer(event) {
    if (
      !this.enabled ||
      event.pointerType !== "mouse" ||
      document.body.classList.contains("modal-open")
    )
      return;
    const now = performance.now();
    if (now - this.lastWake < 32) return;
    const previous = this.lastPointer;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.lastWake = now;
    if (!previous) return;
    const speed = Math.hypot(
      event.clientX - previous.x,
      event.clientY - previous.y,
    );
    if (speed < 1) return;
    this.light.wake(event.clientX, event.clientY, speed);
    this.content.wake(event.clientX, event.clientY, speed);
    this.tools.wake(event.clientX, event.clientY, speed);
  }
  sync() {
    this.enabled = !this.paused && !this.media.matches && !document.hidden;
    this.button.disabled = this.media.matches;
    this.button.textContent = this.media.matches
      ? "Reduced motion enabled"
      : this.paused
        ? "Resume motion"
        : "Pause motion";
    this.button.setAttribute(
      "aria-pressed",
      String(this.paused || this.media.matches),
    );
    this.canvas.hidden = !this.enabled;
    this.tools.setEnabled(this.enabled);
    if (this.enabled) this.clock.start();
    else {
      this.clock.stop();
      this.content.reset();
      this.light.clear();
      this.lastPointer = null;
    }
  }
}
new LiquidPortfolio();
