const { Product } = require('../db');
const mongoose = require('mongoose');

const product={

    getAll: async()=>{
        try{
            const products=Product.find({}).sort({ createdAt: -1 });
            return products;

        }
        catch (err){
          console.error(" Error fetching product :", err);
          throw err;
        }
    },
    add: async(name,description,price,category,image)=>{
        try{
        const newProduct = new Product({name,description,price,category,image,createdAt: new Date()});
        const result = await newProduct.save();
        console.log(" New Product added:", result._id);
        return result;
        }
        catch (err){
             console.error(" Error adding :", err);
             throw err;
        }
    },
    update:async(id,updatedData)=>{
           if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID ');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    return updatedProduct;
    },
    remove: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID  ');
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  },
  getById: async(id)=>{
        try{
            const productinfo= await Product.findById(id)
            return productinfo.image

        }
        catch (err){
          console.error(" Error fetching product :", err);
          throw err;
        }
    },
}
module.exports = { product };
