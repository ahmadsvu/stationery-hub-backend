const {product}=require('../models/productModel')
const { uploadImage, removeImage } = require('../lib/imageStorage');

exports.addProduct= async (req, res) => {
  let image;
  try {
    const { name,description,price,category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    image = req.file ? await uploadImage(req.file, 'products') : null;
    const result = await product.add( name,description,price,category,image);
    image = null;
    res.status(201).json({ message: "product added  " });
  } catch (err) {
    if (image) {
      await removeImage(image);
    }
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
  let uploadedImage;
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const existingProduct = await product.getById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "product not found" });
    }

    if (req.file) {
      uploadedImage = await uploadImage(req.file, 'products');
      updatedData.image = uploadedImage;
    }

    const updatedProduct = await product.update(id, updatedData);
    if (!updatedProduct) {
      await removeImage(uploadedImage);
      return res.status(404).json({ error: "product not found" });
    }
    uploadedImage = null;
    if (req.file && existingProduct.image) {
      await removeImage(existingProduct.image);
    }
    res.status(200).json({ message: "The product has been updated " });
  } catch (err) {
    await removeImage(uploadedImage);
    console.error(" Update error :", err);
    res.status(500).json({ error: "Update error" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await product.getById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: "product not found " });
    }

    const deletedProduct = await product.remove(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "product not found " });
    }
    await removeImage(existingProduct.image);
    res.status(200).json({ message: "product deleted  " });
  } catch (err) {
    console.error(" Deletion error :", err);
    res.status(500).json({ error: "Deletion error" });
  }
};
