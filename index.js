const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const blogRoutes = require('./routes/blogRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'https://stationery-hub-frontend.vercel.app',
    'http://localhost:5173'
  ],
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

// التأكد من جاهزية قاعدة البيانات قبل تنفيذ المسارات
app.use(async (req, res, next) => {
  try {
    await connectDB.connectDB();
    next();
  } catch (err) {
    console.error('Database initialization failed:', err.message);

    res.status(503).json({
      error: 'Database unavailable'
    });
  }
});

app.use('/uploads', express.static('uploads'));
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

  res.status(500).json({
    error: 'Internal server error'
  });
});

// تشغيل محلي فقط
if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;