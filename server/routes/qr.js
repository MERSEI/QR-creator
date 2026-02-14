import express from 'express';
import QRCode from 'qrcode';
import { canGenerate, recordGeneration, getUser } from '../storage.js';

const router = express.Router();

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

// GET /api/status — current user's quota & plan
router.get('/status', (req, res) => {
  const ip = getClientIP(req);
  const user = getUser(ip);
  const check = canGenerate(ip);

  res.json({
    used: user.used,
    plan: user.plan,
    credits: user.credits,
    expiresAt: user.expiresAt,
    canGenerate: check.allowed,
    reason: check.reason,
    freeRemaining: user.used === 0 ? 1 : 0,
  });
});

// POST /api/qr — generate a QR code
router.post('/qr', async (req, res) => {
  const ip = getClientIP(req);
  const check = canGenerate(ip);

  if (!check.allowed) {
    return res.status(402).json({
      error: 'limit_exceeded',
      message: 'Бесплатный лимит исчерпан. Выберите тарифный план для продолжения.',
    });
  }

  const { text, options = {} } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      error: 'text_required',
      message: 'Введите текст или URL для генерации QR-кода.',
    });
  }

  if (text.length > 2953) {
    return res.status(400).json({
      error: 'text_too_long',
      message: 'Текст слишком длинный (максимум 2953 символа).',
    });
  }

  try {
    const size = Math.min(Math.max(Number(options.size) || 400, 100), 1000);
    const rawMargin = options.margin !== undefined && options.margin !== null ? Number(options.margin) : 2;
    const margin = Math.min(Math.max(isNaN(rawMargin) ? 2 : rawMargin, 0), 4);
    const validEC = ['L', 'M', 'Q', 'H'];

    const qrOptions = {
      width: size,
      margin,
      color: {
        dark: /^#[0-9A-Fa-f]{6}$/.test(options.color) ? options.color : '#000000',
        light: /^#[0-9A-Fa-f]{6}$/.test(options.bgColor) ? options.bgColor : '#ffffff',
      },
      errorCorrectionLevel: validEC.includes(options.errorCorrection)
        ? options.errorCorrection
        : 'M',
    };

    const dataURL = await QRCode.toDataURL(text.trim(), qrOptions);
    recordGeneration(ip);

    const updated = getUser(ip);
    res.json({
      qr: dataURL,
      used: updated.used,
      plan: updated.plan,
      credits: updated.credits,
      expiresAt: updated.expiresAt,
      wasFirst: check.reason === 'free',
    });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({
      error: 'generation_failed',
      message: 'Ошибка при генерации QR-кода. Проверьте введённые данные.',
    });
  }
});

export default router;
