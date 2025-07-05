const {product}=require('../models/productModel')
const path = require("path");
const fs = require("fs");

exports.addProduct= async (req, res) => {
  try {
    const { name,description,price,category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await product.add( name,description,price,category,image);
    res.status(201).json({ message: "product added  " });
  } catch (err) {
    console.error("Error adding product  :", err);
    res.status(500).json({ error: "Error adding product   " });
  }

};
exports.getProduct = async (req, res) => {
  try {
    const allProduct = await product.getAll();
    res.status(200).json(allProduct);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products     " });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const image = await product.getById(id)
    if (req.file) {
      updatedData.image = req.file.filename; 
    }

    const updatedProduct = await product.update(id, updatedData);
    if (!updatedProduct) {
      return res.status(404).json({ error: "product not found" });
    }
    if(updatedData.image){
      deleteFiles(image, "../uploads");
    }
    res.status(200).json({ message: "The product has been updated " });
  } catch (err) {
    console.error(" Update error :", err);
    res.status(500).json({ error: "Update error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const image= await product.getById(id)
    const deletedProduct = await product.remove(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "product not found " });
    }
   deleteFiles(image, "../uploads");
    res.status(200).json({ message: "product deleted  " });
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
}

