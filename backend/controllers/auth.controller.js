const User=require("../models/user.model")
const cloudinary=require("../lib/cloudinary")
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../lib/utils");

const signup=async(req,res)=>{
   const {fullname,email,password}=req.body;    
   try{
         if(!fullname||!email||!password){
            return res.status(400).json({message:"all field are requried"})
         }

     if(password.length<6){
      return res.status(400).json({message:"Password lengtht is sort match"})
     };
     const user=await User.findOne({email});
     if(user) return res.status(400).json({message:"Email already exist"});
     
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt);

     const newUser=await User.create({
      fullname,
      email,
      password:hashedPassword
     })
     
     if(newUser){
        generateToken(newUser._id,res);
        await newUser.save();
        res.status(201).json({
         _id:newUser._id,
         fullname:newUser.fullname,
         email:newUser.email,
         profilePic:newUser.profilePic
        })
     }
     else{
      res.status(400).json({message:"invalid user data"})
     }
   }catch(error){
     console.log("Error in signup controller ",error.message)
     res.status(500).json({message:"internal server errror"})
   }
}

const login=async(req,res)=>{
   const {email,password}=req.body;
   try{
      const user=await User.findOne({email});
      if(!user) {
         return res.status(400).json({message:"user not found"})
      }

      
      const isPasswordCorrect=await bcrypt.compare(password,user.password);
      if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});
    
      generateToken(user._id,res);
      res.status(200).json({
       _id:user._id,
       fullname:user.fullname,
       email:user.email,
       profilePic:user.profilePic
      });
   }catch(error){
      console.log("Error in login controller ",error.message);
      res.status(500).json({message:"internal server error"})
   }
  

}

const logout=(req,res)=>{
  try{
     res.cookie("jwt","",{maxAge:0});
     res.status(200).json({message:"Logged out succesfully"})
  }catch(error){
   console.log("Error in logout controller ",error.message);
  }
}

const updateProfile=async(req,res)=>{
   try{
      const {profilePic}=req.body;
      const userId=req.user._id;
      if(!profilePic){
         return res.status(400).json({message:"Please add a profile picture"});

      }
    const uploadResponse=  await cloudinary.uploader.upload(profilePic);
   const updatUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
   
   res.status(200).json(updatUser);

   }catch(error){
     console.log("error in update Profile",error);
     res.status(500).json({message:"Internal server error"})
   }
}

const checkAuth=(req,res)=>{
  try{
   console.log(req.user)
    res.status(200).json(req.user);

  }catch(error){
   console.log("Error in checkAuth controller",error.message);
   res.status(500).json({message:"Internal server error"})
  }
}

module.exports={signup,login,logout,updateProfile,checkAuth};
