const Task = require("../models/Task");
const { translateAliases } = require("../models/User");

const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find({ ...filter, createdBy: req.user._id })
                .sort({ createdAt: -1 })
                .populate("assignedTo", "name email");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id })
                .sort({ createdAt: -1 })
                .populate("createdBy", "name email");
        }


        const baseFilter = req.user.role === "admin"
            ? { createdBy: req.user._id }
            : { assignedTo: req.user._id };
        const allTasks = await Task.countDocuments(baseFilter);
        const pendingTasks = await Task.countDocuments({ ...baseFilter, status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ ...baseFilter, status: "In Progress" });
        const completedTasks = await Task.countDocuments({ ...baseFilter, status: "Completed" });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getDashboardData = async (req, res) => {
    try {
        // 1. Build a base query based on role
        let taskQuery = {};
        if (req.user.role === "admin") {
            taskQuery.createdBy = req.user._id;
        } else {
            taskQuery.assignedTo = req.user._id;
        }

        // 2. Fetch statistics
        const totalTasks = await Task.countDocuments(taskQuery);
        const pendingTasks = await Task.countDocuments({ ...taskQuery, status: "Pending" });
        const completedTasks = await Task.countDocuments({ ...taskQuery, status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            ...taskQuery,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        // 3. Task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: taskQuery },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // 4. Task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            { $match: taskQuery },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // 5. Fetch recent 10 tasks
        const recentTasks = await Task.find(taskQuery)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        // 6. Send response
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });

        const pendingTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Pending"
        });

        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "Completed"
        });

        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email"
        );

        if (!task) return res.status(404).json({ message: "task not found" });
        if (req.user.role !== "admin" && task.assignedTo?._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied: This task is not assigned to you" });
        }
        res.json(task);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
        } = req.body;

        if (!assignedTo) {
            return res.status(400).json({ message: "assignedTo is required" });
        }
        if (req.user.role !== "admin" && assignedTo !== req.user._id.toString()) {
            return res.status(403).json({ message: "Members can only assign tasks to themselves." });
        }


        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "task not found" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;

        if (req.body.assignedTo) {
            task.assignedTo = req.body.assignedTo;
        }


        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", task: updatedTask });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });
        const isAdmin = req.user.role === "admin";
        const isCreator = task.createdBy?.toString() === req.user._id.toString();

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: "You are not authorized to delete this task." });
        }
        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Tasks not found" });

        const isAssigned = task.assignedTo.toString() === req.user._id.toString();

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated ", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = {
    getTasks,
    getDashboardData,
    getUserDashboardData,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
};

