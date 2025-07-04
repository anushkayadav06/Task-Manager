import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apipaths'
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import moment from 'moment'
import { LucideTrash2 } from 'lucide-react'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import SelectUsers from '../../components/Inputs/SelectUsers'
const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: null,
        assignedTo: [],
    });

    const [currentTask, setCurrentTask] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };
    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: null,
            assignedTo: "",

        });
    };

    const createTask = async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
            });

            toast.success("Task created successfully");
            clearData();
        } catch (error) {
            console.error("Error creating task", error);
            toast.error("Failed to create task");
        } finally {
            setLoading(false);
        }
    };


    const updateTask = async () => { };

    const handleSubmit = async () => {
        setError(null);

        if (!taskData.title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!taskData.description.trim()) {
            setError("Description is required");
            return;
        }
        if (!taskData.dueDate) {
            setError("Due date is required.");
            return;
        }
        if (!taskData.assignedTo) {
            setError("Task not assigned to any member");
            return;
        }

        if (taskId) {
            updateTask();
            return;
        }
        createTask();
    };

    const getTaskDetailById = async () => { };

    const deleteTask = async () => { };

    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="container mt-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            {/* Title and Delete Button */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">{taskId ? "Update Task" : "Create Task"}</h4>
                                {taskId && (
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => setOpenDeleteAlert(true)}
                                    >
                                        <LucideTrash2 className="me-1" size={16} />
                                        Delete
                                    </button>
                                )}
                            </div>

                            {/* Task Title */}
                            <div className="mb-3">
                                <label htmlFor="taskTitle" className="form-label fw-semibold">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    id="taskTitle"
                                    className="form-control"
                                    placeholder="Create App UI"
                                    value={taskData.title}
                                    onChange={({ target }) =>
                                        handleValueChange("title", target.value)
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="taskDescription" className="form-label fw-semibold">
                                    Description
                                </label>
                                <textarea
                                    id="taskDescription"
                                    placeholder="Describe the task"
                                    className="form-control"
                                    rows={4}
                                    value={taskData.description}
                                    onChange={({ target }) =>
                                        handleValueChange("description", target.value)
                                    }
                                ></textarea>
                            </div>

                            {/* Priority */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Priority</label>
                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                    placeholder="Select Priority"
                                />
                            </div>

                            {/* Due Date */}
                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label fw-semibold">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    className="form-control"
                                    value={
                                        taskData.dueDate
                                            ? moment(taskData.dueDate).format("YYYY-MM-DD")
                                            : ""
                                    }
                                    onChange={({ target }) =>
                                        handleValueChange("dueDate", target.value)
                                    }
                                />

                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Assign To</label>
                                <SelectUsers
                                    selectedUser={taskData.assignedTo}
                                    setSelectedUser={(value) => handleValueChange("assignedTo", value)}
                                />
                            </div>

                            <div className="text-end">
                                <button className="btn btn-primary">
                                    {taskId ? "Update Task" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>


    )
}

export default CreateTask
