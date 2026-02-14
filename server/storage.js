// Simple in-memory storage keyed by IP
// In production: replace with Redis or PostgreSQL

const users = new Map();

function defaultUser() {
  return { used: 0, plan: 'free', credits: 0, expiresAt: null };
}

export function getUser(ip) {
  if (!users.has(ip)) {
    users.set(ip, defaultUser());
  }
  return { ...users.get(ip) };
}

export function updateUser(ip, data) {
  const existing = users.get(ip) || defaultUser();
  const updated = { ...existing, ...data };
  users.set(ip, updated);
  return { ...updated };
}

export function canGenerate(ip) {
  const user = getUser(ip);

  // Unlimited plan — check expiry
  if (user.plan === 'unlimited') {
    if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
      updateUser(ip, { plan: 'free', expiresAt: null });
    } else if (user.expiresAt) {
      return { allowed: true, reason: 'unlimited' };
    }
  }

  // Single-QR credits (pay-per-use)
  if (user.credits > 0) {
    return { allowed: true, reason: 'credit' };
  }

  // Free tier: 1 QR per IP
  if (user.used === 0) {
    return { allowed: true, reason: 'free' };
  }

  return { allowed: false, reason: 'limit_exceeded' };
}

export function recordGeneration(ip) {
  const user = getUser(ip);
  const check = canGenerate(ip);
  const raw = users.get(ip);

  if (check.reason === 'unlimited') {
    users.set(ip, { ...raw, used: raw.used + 1 });
  } else if (check.reason === 'credit') {
    users.set(ip, { ...raw, used: raw.used + 1, credits: raw.credits - 1 });
  } else if (check.reason === 'free') {
    users.set(ip, { ...raw, used: raw.used + 1 });
  }
}
