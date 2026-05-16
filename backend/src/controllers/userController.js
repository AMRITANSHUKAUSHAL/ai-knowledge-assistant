const prisma = require("../config/prisma");

const getCurrentUser = async(req,res)=>{
    try{    

        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id,
            },
        });
        if(!user){
            return res.status(404).json({
                message:"User not found",
            })
        }
        res.status(200).json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (error) {
          res.status(500).json({
            message: error.message,
          });
        }
      };
      
module.exports = {
    getCurrentUser,
};