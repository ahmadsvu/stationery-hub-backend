const { blog } = require('../models/blogModel');
const path = require("path");
const fs = require("fs");

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
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة" });
    }

    const result = await blog.add(title, content, author, image);
    res.status(201).json({ message: "تمت إضافة التدوينة", post: result });
  } catch (err) {
    console.error("خطأ في الإضافة:", err);
    res.status(500).json({ error: "حدث خطأ أثناء الإضافة" });
  }

};
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const oldimage=await blog.getById(id)
    const updatedData = req.body;

    if (req.file) {
      updatedData.image = req.file.filename; 
    }

    const updatedPost = await blog.update(id, updatedData);
    if(updatedData.image){
       deleteFiles(oldimage, "../uploads");
    }
    if (!updatedPost) {
      return res.status(404).json({ error: "post not found" });
    }

    res.status(200).json({ message: "The post has been updated ", post: updatedPost });
  } catch (err) {
    console.error(" Update error :", err);
    res.status(500).json({ error: "Update error" });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const image=await blog.getById(id);
    const deletedPost = await blog.remove(id);
    
    if (!deletedPost) {
      return res.status(404).json({ error: "post not found " });
    }
    deleteFiles(image, "../uploads");
    res.status(200).json({ message: "post deleted  " });
  } catch (err) {
    console.error(" Deletion error :", err);
    res.status(500).json({ error: "Deletion error" });
  }
};

const deleteFiles = (file, directory) => {
  const filePath = path.join(__dirname, directory, file);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete file: ${err.message}`);
    } else {
      console.log(`File :${file} deleted successfully`);
    }
  });
};

