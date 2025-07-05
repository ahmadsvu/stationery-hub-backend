const {dashbord}=require('../models/adminModel')
const bcrypt=require ('bcrypt')

exports.login=async(req,res)=>{
 const username=req.body.username;
 const password=req.body.password;
 const result =await dashbord.login(username,password)
 if(result){
  res.status(200).json({ message: "Login successful", success: true });
  
 }else res.send("password or username not correct")
}

exports.UpdateLoinInfo = async (req, res) => {

  const newpassword = req.body.newpassword;
  const oldPassword = req.body.oldPassword;

  try {
    const result = await dashbord.update(newpassword, oldPassword);

    if (result) {
      res.status(200).json({message:"password changed successfully", success: true});
    } else {
      res.status(400).send("Update failed");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

