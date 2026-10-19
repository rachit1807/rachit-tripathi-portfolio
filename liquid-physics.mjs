// Pure, time-based physics shared by the page and its regression tests.
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function contain(body, width, height) {
  for (const [axis, velocity, limit] of [
    ["x", "vx", width],
    ["y", "vy", height],
  ]) {
    const edge = Math.max(body.r, limit - body.r);
    if (body[axis] < body.r) {
      body[axis] = body.r;
      body[velocity] = Math.abs(body[velocity]) * 0.45;
    } else if (body[axis] > edge) {
      body[axis] = edge;
      body[velocity] = -Math.abs(body[velocity]) * 0.45;
    }
  }
}

export function collide(a, b) {
  let dx = b.x - a.x,
    dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const overlap = a.r + b.r + 3 - distance;
  if (overlap <= 0 || (a.dragging && b.dragging)) return;
  if (!distance) {
    dx = 1;
    dy = 0;
  }
  const nx = dx / (distance || 1),
    ny = dy / (distance || 1);
  const aWeight = a.dragging ? 0 : b.dragging ? 1 : 0.5;
  const bWeight = b.dragging ? 0 : a.dragging ? 1 : 0.5;
  a.x -= nx * overlap * aWeight;
  a.y -= ny * overlap * aWeight;
  b.x += nx * overlap * bWeight;
  b.y += ny * overlap * bWeight;
  const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (closing < 0) {
    const impulse = -closing * 1.35;
    a.vx -= impulse * nx * aWeight;
    a.vy -= impulse * ny * aWeight;
    b.vx += impulse * nx * bWeight;
    b.vy += impulse * ny * bWeight;
  }
}

export function spring(body, targetX, targetY, dt, stiffness = 5, damping = 4) {
  if (body.dragging) return;
  const drag = Math.exp(-damping * dt);
  body.vx = (body.vx + (targetX - body.x) * stiffness * dt) * drag;
  body.vy = (body.vy + (targetY - body.y) * stiffness * dt) * drag;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

export function disturb(body, px, py, radius, strength) {
  const dx = body.x - px,
    dy = body.y - py;
  const distance = Math.hypot(dx, dy);
  if (distance >= radius || body.dragging) return;
  const force = (1 - distance / radius) * strength;
  body.vx += (distance ? dx / distance : 1) * force;
  body.vy += (distance ? dy / distance : 0) * force;
}
