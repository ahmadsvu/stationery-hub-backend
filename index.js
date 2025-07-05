const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const blogRoutes=require('./routes/blogRoutes')
const productRoutes=require('./routes/productRoutes')
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes =require('./routes/orderRoutes')
require('dotenv').config();
const port = process.env.PORT ;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.post('/test', (req, res) => {
  console.log('✅ TEST endpoint hit:', req.body);
  res.sendStatus(200);
});
app.use('/uploads', express.static('uploads'));
app.use('/blog',blogRoutes)
app.use('/product',productRoutes)
app.use('/admin', adminRoutes);
app.use('/api', orderRoutes);
  connectDB.connectDB().then(() => {
    app.listen(port, () => {
      console.log(` Server is running on  http://localhost:${port}`);
    });
  });