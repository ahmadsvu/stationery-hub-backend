const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');

const blogRoutes = require('./routes/blogRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

const allowedOrigins = [
  (process.env.FRONTEND_ORIGIN || 'https://stationery-hub-frontend.vercel.app').replace(/\/$/, ''),
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// فحص أن تطبيق Express يعمل دون الاتصال بقاعدة البيانات
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'stationery-hub-backend'
  });
});

app.get('/ready', async (req, res) => {
  try {
    await connectDB.connectDB();
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    console.error('Database readiness check failed:', err.message);
    res.status(503).json({ status: 'not_ready', error: 'Database unavailable' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// التأكد من جاهزية قاعدة البيانات قبل تنفيذ المسارات
app.use(async (req, res, next) => {
  try {
    await connectDB.connectDB();
    next();
  } catch (err) {
    console.error('Database initialization failed:', {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName
    });

    res.status(503).json({
      error: 'Database unavailable'
    });
  }
});

app.use('/blog', blogRoutes);
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use('/api', orderRoutes);

// معالجة الأخطاء غير المتوقعة داخل Express
app.use((err, req, res, next) => {
  console.error('Express error:', err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.code === 'LIMIT_FILE_SIZE'
    ? 413
    : Number.isInteger(err.status) && err.status >= 400 ? err.status : 500;
  res.status(status).json({
    error: status === 413 ? 'Uploaded file exceeds the 4 MB limit' : 'Internal server error'
  });
});

// تشغيل محلي فقط
if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log();
  });
}

module.exports = app;