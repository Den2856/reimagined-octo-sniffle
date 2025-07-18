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

// 1. Отладочное логирование окружения
console.log('Environment variables:');
console.log(`CLIENT_URL: ${process.env.CLIENT_URL}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// 2. Регулярные выражения для разрешенных доменов
const allowedDomains = [
  // Локальные домены
  /https?:\/\/localhost(:\d+)?$/,
  /https?:\/\/127\.0\.0\.1(:\d+)?$/,
  
  // Все поддомены Vercel
  /https?:\/\/([a-z0-9-]+\.)?reimagined-octo-sniffle(-[a-z0-9]+)?\.vercel\.app$/i,
  
  // Домен Render
  /https?:\/\/reimagined-octo-sniffle\.onrender\.com$/i,
  
  // Конкретный домен из переменной среды
  new RegExp(`^${process.env.CLIENT_URL?.replace(/\./g, '\\.')}$`)
].filter(Boolean);

// 3. Улучшенный CORS-мидлварь
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    try {
      // Разрешить запросы без origin (Postman, curl)
      if (!origin) {
        console.log('[CORS] Allowed: No origin');
        return callback(null, true);
      }

      // Проверка всех разрешенных доменов
      const isAllowed = allowedDomains.some(domain => domain.test(origin));
      
      if (isAllowed) {
        console.log(`[CORS] Allowed: ${origin}`);
        return callback(null, true);
      } else {
        console.warn(`[CORS] Blocked: ${origin}`);
        return callback(new Error(`Origin '${origin}' not allowed by CORS`), false);
      }
    } catch (error) {
      console.error('[CORS] Error:', error);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Powered-By'],
  maxAge: 600
};

app.use(cors(corsOptions));

// 4. Обязательная обработка preflight-запросов
app.options('*', cors(corsOptions));

// 5. JSON-парсер для body
app.use(express.json());

// 6. Cookie-парсер
app.use(cookieParser());

// 7. Middleware для логирования всех запросов
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} Origin: ${req.headers.origin || 'none'}`);
  next();
});

// 8. Пинг сервера
app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is running');
});

// 9. Монтируем роуты
app.use('/api/auth', authRouter);
app.use('/api/places', placesRouter);
app.use('/api/tour-types', tourTypesRouter);
app.use('/api/trips', tripRouter);
app.use('/api/reviews', reviewRouter);

// 10. Middleware для обработки 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// 11. Глобальный обработчик ошибок
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 12. Подключаем Mongo и стартуем
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
      console.log(`🌐 Allowed CORS domains: ${allowedDomains.map(d => d.toString()).join(', ')}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });