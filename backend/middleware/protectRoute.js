const jwt=require("jsonwebtoken");
const User=require("../models/user.model");

const protectRoute=async(req,res,next)=>{
  try{
      const token=req.cookies.jwt;
      if(!token) return res.status(401).json({message:"You are not authenticated"});

      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      if(!decoded){
        return res.status(401).json({message:"Unauthorized _invalid token"})
      }


      const user=await User.findById(decoded.userId).select("-password");

      if(!user) return res.status(401).json({message:"Userr not found"});
      req.user=user;
      next();

  }catch(error){
    console.log("Error in middleware",error.message);
    res.status(500).json({message:"Internal server errror"})
  }
}
module.exports=protectRoute;