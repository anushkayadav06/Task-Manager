import React, { useEffect, useContext, useState } from 'react';
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apipaths';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import moment from 'moment'
import { LucideArrowBigRight } from 'lucide-react';
import TaskListTable from '../../components/layouts/TaskListTable';
import CustomBarChart from '../../Charts/CustomBarChart';
const Dashboard = () => {
    useUserAuth();

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [barChartData, setBarChartData] = useState([]);

    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || null;
        const taskPriorityLevels = data?.taskPriorityLevels || null;

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In Progress", count: taskDistribution?.InProgress || 0 },
            { status: "Completed", count: taskDistribution?.Completed || 0 },
        ];
        const PriorityLevelData = [
            { priority: "Low", count: taskDistribution?.Low || 0 },
            { priority: "Medium", count: taskDistribution?.Medium || 0 },
            { priority: "High", count: taskDistribution?.High || 0 },
        ];
        setBarChartData(PriorityLevelData);
    };

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASKS.GET_DASHBOARD_DATA
            );
            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || null);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };
    const onSeeMore = () => {
        navigate('/admin/tasks');
    };
    useEffect(() => {
        getDashboardData();
        return () => { };
    }, []);
    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="container-fluid mt-4 px-4">

                <div className="card shadow-sm mb-4 w-100">
                    <div className="card-body">
                        <div className="mb-4">
                            <h5 className="card-title">Good Morning!! {user?.name}</h5>
                            <p className="card-text text-muted">{moment().format("ddd Do MMM YYYY")}</p>
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <InfoCard
                                    label="Total Tasks"
                                    value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
                                    color="bg-primary"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <InfoCard
                                    label="Pending Tasks"
                                    value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
                                    color="bg-warning"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <InfoCard
                                    label="In Progress Tasks"
                                    value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
                                    color="bg-info"
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <InfoCard
                                    label="Completed Tasks"
                                    value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
                                    color="bg-success"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4 w-100 p-4">
                    <h5 className="mb-3">Task Distribution</h5>
                    <CustomBarChart data={barChartData} />
                </div>

                <div className="card shadow-sm w-100 mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Tasks</h5>
                        <button className="btn btn-outline-primary btn-sm" onClick={onSeeMore}>
                            See All <LucideArrowBigRight className="ms-1" size={16} />
                        </button>
                    </div>
                    <div className="px-3 pb-3">
                        <TaskListTable tableData={dashboardData?.recentTasks || []} />
                    </div>
                </div>

            </div>
        </DashboardLayout>

    );
};

export default Dashboard;
