import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Импортируем ваши роуты
import authRouter from './routes/auth';
import placesRouter from './routes/places';
import tourTypesRouter from './routes/tourType';
import tripRouter from './routes/trip';
import reviewRouter from './routes/rewiew';

const app = express();

// 1. Конкретный домен Vercel
const FRONTEND_URL = 'https://reimagined-octo-sniffle-chi.vercel.app';

// 2. Настройка CORS с явным указанием домена
app.use(cors({
  origin: FRONTEND_URL, // Только этот конкретный домен
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Powered-By'],
  maxAge: 600
}));

// 3. Обязательная обработка preflight-запросов
app.options('*', cors());

// 4. JSON-парсер для body
app.use(express.json());

// 5. Cookie-парсер
app.use(cookieParser());

// 6. Middleware для логирования всех запросов
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} 
  Origin: ${req.headers.origin || 'none'} 
  Host: ${req.headers.host}`);
  next();
});

// 7. Пинг сервера
app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is running');
});

// 8. Монтируем роуты
app.use('/api/auth', authRouter);
app.use('/api/places', placesRouter);
app.use('/api/tour-types', tourTypesRouter);
app.use('/api/trips', tripRouter);
app.use('/api/reviews', reviewRouter);

// 9. Middleware для обработки 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 10. Глобальный обработчик ошибок
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// 11. Подключаем Mongo и стартуем
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
      console.log(`🌐 Allowed CORS domain: ${FRONTEND_URL}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });