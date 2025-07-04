require("dotenv").config();
const express=require("express");
const cors = require("cors");
const { METHODS } = require("http");
const path=require("path");
const connectDB = require("./config/db");
const app=express();
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const taskRoutes=require("./routes/taskRoutes");
//connect front-back(end)

app.use(express.json());//read json data


app.use(
    cors({
        origin: "http://localhost:5173",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials:true,
    })
);

//connect mongo-cloud
connectDB();



//routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
// app.use("/api/reports",reportRoutes);


const PORT = process.env.PORT||5000;//start either of one port
app.listen(PORT,()=> console.log(`server running on port ${PORT}`));