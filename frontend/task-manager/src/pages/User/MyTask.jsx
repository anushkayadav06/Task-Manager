import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apipaths';
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs';
import { UserContext } from '../../context/userContext';
import UserTaskCard from '../../components/Cards/UserTaskCard';
import toast from 'react-hot-toast';
const MyTask = () => {
    const { user } = useContext(UserContext);
    const [allTasks, setAllTasks] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === "All" ? "" : filterStatus,
                },
            });

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
    const updateTaskStatus = async (taskId, status) => {
        try {
            await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(taskId), {
                status: status,
            });
            toast.success(`Task marked as ${status}`);
            getAllTasks(); // refresh
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task");
        }
    };


    useEffect(() => {
        getAllTasks();
    }, [filterStatus, refresh]);

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
                    <UserTaskCard
                        key={item._id}
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        status={item.status}
                        progress={item.progress}
                        createdAt={item.createdAt}
                        dueDate={item.dueDate}
                        createdBy={item.createdBy || {}}
                        handleMarkCompleted={() => markTaskAsCompleted(item._id)}
                        handleMarkInProgress={() => updateTaskStatus(item._id, "In Progress")}

                    />
                ))}
            </div>
        </DashboardLayout>
    );
};

export default MyTask;
