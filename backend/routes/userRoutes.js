const express = require("express");
const {protect,adminOnly}=require("../middlewares/authMiddleware");
const router = express.Router();
const {getUsers,getUserById}=require("../controllers/userController");
//user routes
router.get("/",protect,adminOnly,getUsers); //get all users - admin only
router.get("/:id",protect,getUserById);//get specific user

module.exports = router;
