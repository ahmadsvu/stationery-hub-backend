const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

router.get('/get',productController.getProduct)
router.post('/add',upload.single('image'),productController.addProduct)
router.put('/update/:id',upload.single('image'),productController.updateProduct)
router.delete('/delete/:id',productController.deleteProduct)
module.exports = router;