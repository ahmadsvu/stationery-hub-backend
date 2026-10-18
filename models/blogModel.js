const { Post } = require('../db');
const mongoose = require('mongoose');

const blog = {
  add: async (title, content, author, image) => {
    try {
      const newPost = new Post({title,content,author,image,createdAt: new Date()});
      const result = await newPost.save();
      console.log("  Post added:", result._id);
      return result;
    } catch (err) {
      console.error(" Error adding :", err);
      throw err;
    }
  },
update: async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID ');
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedPost;
  },

  // 🗑️ حذف تدوينة حسب ID
  remove: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID  ');
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    return deletedPost;
  },

  get: async () => {
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 });
      return posts;
    } catch (err) {
      console.error(" Error fetching posts :", err);
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const post = await Post.findById(id)
      return post;
    } catch (err) {
      console.error(" Error fetching post :", err);
      throw err;
    }
  }

};

module.exports = { blog };
