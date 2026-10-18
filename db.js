const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI;


const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true ,default:"$2a$10$x6KW7ZQy9PDh0OzOESdgoe51K7nfqCk9vQtIQLtamwY9oVsup/vKe"}
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  name: String,
  area:String,
  address: String,
  phone: String,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, default: "pending" },
  subtotal: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});


const Product = mongoose.model('Product', productSchema);
const Post = mongoose.model('Post', postSchema);
const Order = mongoose.model('Order', orderSchema);
const Admin = mongoose.model('Admin', adminSchema);

const createDefaultAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
   
    await Admin.create({
      username: "admin",
    });
    console.log("✅ admin user added");
  }
};


let connectionPromise = null;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    })
    .then(async () => {
      console.log('MongoDB connected successfully');
      await createDefaultAdmin();
    })
    .catch((err) => {
      connectionPromise = null;
      console.error('MongoDB connection failed:', err.message);
      throw err;
    });
  }

  await connectionPromise;
}


module.exports = {
  connectDB,
  Product,
  Post,
  Order,
  Admin
};

