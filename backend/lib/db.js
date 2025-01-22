const mongoose=require("mongoose");

const connnectDb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log("db connected ")

    }catch(error){
        console.log(" db connection errror",error)
    }
}
module.exports=connnectDb