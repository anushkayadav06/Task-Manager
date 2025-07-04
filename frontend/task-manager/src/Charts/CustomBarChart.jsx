import React, { useEffect, useState, useContext } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apipaths';
import { UserContext } from '../context/userContext';

const CustomBarChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    const getBarColor = (priority) => {
        switch (priority) {
            case 'Low': return '#00BC7D';
            case 'Medium': return '#FE9900';
            case 'High': return '#FF1F57';
            default: return '#00BC7D';
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-2 bg-white border rounded shadow-sm">
                    <p className="mb-0">
                        <strong>{payload[0].payload.priority}</strong>: {payload[0].payload.count} Tasks
                    </p>
                </div>
            );
        }
        return null;
    };

    const fetchChartData = async () => {
        try {
            const endpoint = user?.role === 'admin'
                ? API_PATHS.TASKS.GET_DASHBOARD_DATA
                : API_PATHS.TASKS.GET_USER_DASHBOARD_DATA;

            const response = await axiosInstance.get(endpoint);
            const priorityLevels = response.data?.charts?.taskPriorityLevels || {};

            const formatted = [
                { priority: 'Low', count: priorityLevels.Low || 0 },
                { priority: 'Medium', count: priorityLevels.Medium || 0 },
                { priority: 'High', count: priorityLevels.High || 0 },
            ];

            setChartData(formatted);
        } catch (error) {
            console.error("Error fetching chart data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, []);

    return (
        <div className="card shadow w-100 my-4">
            <div className="card-body">
                <h5 className="card-title">Tasks by Priority</h5>

                {loading ? (
                    <p>Loading chart...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="priority" tick={{ fontSize: 12, fill: "#555" }} />
                            <YAxis tick={{ fontSize: 12, fill: "#555" }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.priority)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default CustomBarChart;
