const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }
});

router.get('/get',productController.getProduct)
router.post('/add',upload.single('image'),productController.addProduct)
router.put('/update/:id',upload.single('image'),productController.updateProduct)
router.delete('/delete/:id',productController.deleteProduct)
module.exports = router;