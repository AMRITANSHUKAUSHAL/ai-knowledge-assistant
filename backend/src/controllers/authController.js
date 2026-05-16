const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
const register = async(req,res)=>{
    try{

        const {name,email,password} = req.body;
        //checking existing user or not
        const existingUser = await prisma.user.findUnique({
            where:{
                email,
            },
        });
        if(existingUser){
            return res.status(400).json({
                message:"User Already Exists",
            });
        }

        //hashed Password
        const hashedPassword = await bcrypt.hash(password,10);

        //create User
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
            },
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}


//Login
const login = async(req,res)=>{
    try{

        const {email,password} = req.body;

        //check user
        const user = await prisma.user.findUnique({
            where:{
                email,
            },
        });
        if(!user){
            return res.status(404).json({
                message:"user not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
              message: "Invalid credentials",
            });
          }

          //Generate Token
          const token = jwt.sign(
            {
                id:user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
          );
          res.status(200).json({
            message: "Login successful",
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {
    register,
    login
}