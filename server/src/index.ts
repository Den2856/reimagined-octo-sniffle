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

// Регулярные выражения для разрешенных доменов
const vercelPattern = /https?:\/\/([a-z0-9-]+\.)?reimagined-octo-sniffle(-[a-z0-9]+)?\.vercel\.app/i;
const renderPattern = /https?:\/\/([a-z0-9-]+\.)?reimagined-octo-sniffle\.onrender\.com/i;

// 1) JSON-парсер для body
app.use(express.json());

// 2) Cookie-парсер
app.use(cookieParser());

// 3) CORS с динамической проверкой origin
app.use(cors({
  origin: (origin, callback) => {
    // Разрешить запросы без origin (Postman, curl и т.д.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Разрешить локальную разработку
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Разрешить основной домен из переменной среды
    if (origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    
    // Разрешить все поддомены Vercel
    if (vercelPattern.test(origin)) {
      return callback(null, true);
    }
    
    // Разрешить домен Render
    if (renderPattern.test(origin)) {
      return callback(null, true);
    }
    
    // Для отладки: вывести в консоль заблокированные домены
    console.warn(`CORS blocked: ${origin}`);
    callback(new Error(`Origin '${origin}' not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Обработка preflight-запросов
app.options('*', cors());

// 4) Пинг сервера
app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is running');
});

// 5) Монтируем роуты
app.use('/api/auth', authRouter);
app.use('/api/places', placesRouter);
app.use('/api/tour-types', tourTypesRouter);
app.use('/api/trips', tripRouter);
app.use('/api/reviews', reviewRouter);

// 6) Глобальный error‐handler
app.use((
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// 7) Подключаем Mongo и стартуем
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });