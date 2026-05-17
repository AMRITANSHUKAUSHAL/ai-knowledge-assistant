const express = require("express");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes  = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("AI Knowledge Assistant API Running");
}); 

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/documents",documentRoutes);
app.use("/api/chat",chatRoutes);

module.exports=app;