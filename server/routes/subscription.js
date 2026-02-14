import express from 'express';
import { getUser, updateUser, canGenerate } from '../storage.js';

const router = express.Router();

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

// GET /api/plans — available subscription plans
router.get('/plans', (_req, res) => {
  res.json({
    plans: [
      {
        id: 'single',
        name: '1 QR-код',
        price: 10,
        currency: 'EUR',
        description: 'Разовая генерация — оплата один раз',
        features: [
          '1 QR-код',
          'Кастомные цвета',
          'Скачивание PNG',
          'Любой текст или URL',
        ],
      },
      {
        id: 'unlimited',
        name: 'Безлимит',
        price: 20,
        currency: 'EUR',
        period: 'месяц',
        description: 'Неограниченная генерация на 30 дней',
        features: [
          'Безлимитно QR-кодов',
          'Кастомные цвета',
          'Скачивание PNG',
          'Приоритетная поддержка',
          'Экспорт SVG (скоро)',
        ],
        recommended: true,
      },
    ],
  });
});

// POST /api/subscribe — stub payment handler
// In production: verify Stripe webhook here and then grant access
router.post('/subscribe', (req, res) => {
  const ip = getClientIP(req);
  const { plan, paymentToken } = req.body;

  // DEMO: any non-empty token is accepted — replace with real Stripe verification
  if (!paymentToken) {
    return res.status(400).json({
      error: 'payment_required',
      message: 'Требуется платёжный токен.',
    });
  }

  let updateData = {};

  if (plan === 'single') {
    const user = getUser(ip);
    updateData = { credits: user.credits + 1 };
  } else if (plan === 'unlimited') {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    updateData = { plan: 'unlimited', expiresAt: expiresAt.toISOString() };
  } else {
    return res.status(400).json({
      error: 'invalid_plan',
      message: 'Неверный план. Выберите single или unlimited.',
    });
  }

  const updated = updateUser(ip, updateData);
  const check = canGenerate(ip);

  res.json({
    success: true,
    plan: updated.plan,
    credits: updated.credits,
    expiresAt: updated.expiresAt,
    canGenerate: check.allowed,
    message:
      plan === 'unlimited'
        ? 'Безлимитный план активирован на 30 дней!'
        : 'Добавлен 1 QR-кредит!',
  });
});

export default router;
