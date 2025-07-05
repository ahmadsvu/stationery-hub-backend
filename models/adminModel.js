const res = require('express/lib/response');
const { Admin } = require('../db');
const bcrypt=require ('bcrypt')


const dashbord={

    login: async (username, password) => {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      throw new Error('0000username or password incorrect ');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('username or password incorrect');
    }

   return admin;
  },
update: async (password, oldPassword, ) => {
  const admin = await Admin.findOne({});
  if (!admin) throw new Error('admin not found');

  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    throw new Error('old password incorrect');
  }


  const updateFields = {};

  // if (username && username.trim() !== "") {
  //   updateFields.username = username;
  // }

  if (password && password.trim() !== "") {
    const hashed = await bcrypt.hash(password, 10);
    updateFields.password = hashed;
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, updateFields, { new: true });
  return updatedAdmin;
}

};


module.exports = { dashbord };