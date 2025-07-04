import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apipaths';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';
import { UserContext } from '../../context/userContext';
import toast from "react-hot-toast";
const ManageTasks = () => {
    const { user } = useContext(UserContext);
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                },
            });
            console.log("👤 Logged in user:", user);
            console.log("📦 Raw tasks from backend:", response.data?.tasks);
            setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

            const statusSummary = response.data?.statusSummary || {};

            const statusArray = [
                { label: "All", count: statusSummary.all || 0 },
                { label: "Pending", count: statusSummary.pendingTasks || 0 },
                { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
                { label: "Completed", count: statusSummary.completedTasks || 0 },
            ];

            setTabs(statusArray);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    const handleClick = (taskData) => {
        navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
    };

    const deleteTaskById = async (taskId) => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
            toast.success("Task deleted successfully");
            getAllTasks(); // Refresh the list
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    useEffect(() => {
        getAllTasks();
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="Manage Tasks">
            <div className="container my-5">
                <h4>Tasks</h4>
                <div className="bg-white p-4 shadow rounded">
                    {tabs?.[0]?.count > 0 && (
                        <div className='d-flex'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className='px-4'>
                {allTasks?.map((item) => (
                    <TaskCard
                        key={item._id}
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        status={item.status}
                        progress={item.progress}
                        createdAt={item.createdAt}
                        dueDate={item.dueDate}
                        assignedTo={item.assignedTo || {}}
                        onDelete={() => deleteTaskById(item._id)}
                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default ManageTasks;
