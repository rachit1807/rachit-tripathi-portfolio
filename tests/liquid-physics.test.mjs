import test from "node:test";
import assert from "node:assert/strict";
import { contain, collide, spring, disturb } from "../liquid-physics.mjs";
const body = (x, y, vx = 0, vy = 0) => ({
  x,
  y,
  vx,
  vy,
  r: 30,
  dragging: false,
});

test("walls contain a thrown icon and reduce its rebound velocity", () => {
  const icon = body(-12, 390, -100, 80);
  contain(icon, 300, 350);
  assert.equal(icon.x, 30);
  assert.equal(icon.y, 320);
  assert.ok(icon.vx > 0 && icon.vx < 100);
  assert.ok(icon.vy < 0 && icon.vy > -80);
});
test("overlapping icons separate and bounce when approaching", () => {
  const a = body(80, 80, 60),
    b = body(120, 80, -60);
  collide(a, b);
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= 63 - 1e-8);
  assert.ok(a.vx < 0 && b.vx > 0);
});
test("a dragged icon pushes neighbours without being displaced by them", () => {
  const a = body(80, 80),
    b = body(100, 80);
  a.dragging = true;
  collide(a, b);
  assert.equal(a.x, 80);
  assert.ok(b.x >= 143);
});
test("coincident centres resolve without NaN values", () => {
  const a = body(80, 80),
    b = body(80, 80);
  collide(a, b);
  assert.ok(Number.isFinite(a.x) && Number.isFinite(b.x));
  assert.ok(Math.abs(a.x - b.x) >= 63);
});
test("a wake pushes nearby icons outwards and leaves distant ones alone", () => {
  const near = body(70, 50),
    far = body(300, 50);
  disturb(near, 50, 50, 100, 30);
  disturb(far, 50, 50, 100, 30);
  assert.ok(near.vx > 0);
  assert.equal(far.vx, 0);
});
test("damped springs return to equilibrium consistently across frame rates", () => {
  for (const fps of [30, 60, 120]) {
    const icon = body(170, 20, 120, -90);
    for (let i = 0; i < fps * 12; i++)
      spring(icon, 100, 100, 1 / fps, 1.7, 1.8);
    assert.ok(Math.hypot(icon.x - 100, icon.y - 100) < 0.03);
  }
});
test("packed icons remain finite and inside the pool after repeated disturbances", () => {
  const icons = Array.from({ length: 12 }, (_, i) =>
    body(45 + (i % 3) * 85, 50 + Math.floor(i / 3) * 95),
  );
  for (let frame = 0; frame < 600; frame++) {
    icons.forEach((icon, i) => {
      disturb(icon, 130, 200, 180, frame % 30 === 0 ? 35 : 0);
      spring(
        icon,
        45 + (i % 3) * 85,
        50 + Math.floor(i / 3) * 95,
        1 / 60,
        1.7,
        1.8,
      );
    });
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < icons.length; i++)
        for (let j = i + 1; j < icons.length; j++) collide(icons[i], icons[j]);
      icons.forEach((icon) => contain(icon, 276, 430));
    }
    icons.forEach((icon) => {
      assert.ok(Number.isFinite(icon.x + icon.y + icon.vx + icon.vy));
      assert.ok(icon.x >= 30 && icon.x <= 246 && icon.y >= 30 && icon.y <= 400);
    });
  }
});
