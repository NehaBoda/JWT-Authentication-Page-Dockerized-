require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const  User  = require('./Schema/User');
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createSecretToken } = require("./utils/secretToken");
const { userVerification } = require("./middleware"); 

const Port = 8080;
const app = express();


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" Connected to MongoDB Docker container");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
  }
}

connectDB();


app.post("/signup",async(req,res,next)=>{
    try{
        const {email , password,username,createdAt } = req.body;
        const existingUser = await User.findOne({email});
         if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
     res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
     res.status(201).json({message :"User signed in successfully",success: true, user})
     next();
    }catch(err){
      console.log(err)
    }
})

app.post("/login",  async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
     next()
  } catch (error) {
    console.error(error);
  }
});

app.post("/",userVerification)


app.listen(Port,()=>{
    console.log(`server is listening ${Port}`);
})