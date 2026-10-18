const { blog } = require('../models/blogModel');
const { uploadImage, removeImage } = require('../lib/imageStorage');

// جلب كل التدوينات
exports.getBlog = async (req, res) => {
  try {
    const allPosts = await blog.get();
    res.status(200).json(allPosts);
  } catch (err) {
    console.error("Error fetching posts    :", err);
    res.status(500).json({ error: "Error fetching posts     " });
  }
};

// إضافة تدوينة جديدة
exports.addBlog = async (req, res) => {
  let image;
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة" });
    }

    image = req.file ? await uploadImage(req.file, 'blog') : null;
    const result = await blog.add(title, content, author, image);
    image = null;
    res.status(201).json({ message: "تمت إضافة التدوينة", post: result });
  } catch (err) {
    if (image) {
      await removeImage(image);
    }
    console.error("خطأ في الإضافة:", err);
    res.status(500).json({ error: "حدث خطأ أثناء الإضافة" });
  }

};
exports.updateBlog = async (req, res) => {
  let uploadedImage;
  try {
    const { id } = req.params;
    const existingPost = await blog.getById(id);
    if (!existingPost) {
      return res.status(404).json({ error: "post not found" });
    }

    const updatedData = req.body;

    if (req.file) {
      uploadedImage = await uploadImage(req.file, 'blog');
      updatedData.image = uploadedImage;
    }

    const updatedPost = await blog.update(id, updatedData);
    if (!updatedPost) {
      await removeImage(uploadedImage);
      return res.status(404).json({ error: "post not found" });
    }
    uploadedImage = null;
    if (req.file && existingPost.image) {
      await removeImage(existingPost.image);
    }

    res.status(200).json({ message: "The post has been updated ", post: updatedPost });
  } catch (err) {
    await removeImage(uploadedImage);
    console.error(" Update error :", err);
    res.status(500).json({ error: "Update error" });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await blog.getById(id);
    if (!existingPost) {
      return res.status(404).json({ error: "post not found " });
    }

    const deletedPost = await blog.remove(id);
    
    if (!deletedPost) {
      return res.status(404).json({ error: "post not found " });
    }
    await removeImage(existingPost.image);
    res.status(200).json({ message: "post deleted  " });
  } catch (err) {
    console.error(" Deletion error :", err);
    res.status(500).json({ error: "Deletion error" });
  }
};
