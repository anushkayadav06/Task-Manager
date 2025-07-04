const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const Task = require("../models/Task");
const router = express.Router();
const {
    getTasks,
    getDashboardData,
    getUserDashboardData,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist
} = require("../controllers/taskController");


router.get("/dashboard-data", protect, adminOnly, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);

module.exports = router;

