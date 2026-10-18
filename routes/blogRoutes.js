const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }
});


router.get('/getblogs', blogController.getBlog);
router.post('/addblogs', upload.single('image'), blogController.addBlog);
router.put('/updateblog/:id',upload.single('image'),blogController.updateBlog);
router.delete('/deleteblog/:id',blogController.deleteBlog)

module.exports = router;
