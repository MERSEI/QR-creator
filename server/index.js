import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import qrRouter from './routes/qr.js';
import subscriptionRouter from './routes/subscription.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust reverse proxy (Railway, Vercel, nginx)
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// API routes
app.use('/api', qrRouter);
app.use('/api', subscriptionRouter);

// Serve built frontend in production
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`QR Creator running on port ${PORT}`);
});
