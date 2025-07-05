const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');


// إعداد التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // المجلد الذي سيتم حفظ الصورة فيه
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // حفظ الاسم مع اللاحقة الأصلية
  }
});

const upload = multer({ storage: storage });


router.get('/getblogs', blogController.getBlog);
router.post('/addblogs', upload.single('image'), blogController.addBlog);
router.put('/updateblog/:id',upload.single('image'),blogController.updateBlog);
router.delete('/deleteblog/:id',blogController.deleteBlog)

module.exports = router;
