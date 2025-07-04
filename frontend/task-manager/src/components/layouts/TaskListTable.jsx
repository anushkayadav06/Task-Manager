import React from 'react';
import moment from 'moment';

const TaskListTable = ({ tableData = [] }) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'badge bg-success';
            case 'Pending':
                return 'badge bg-warning text-dark';
            case 'In Progress':
                return 'badge bg-info text-dark';
            default:
                return 'badge bg-secondary';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'badge bg-danger';
            case 'Medium':
                return 'badge bg-warning text-dark';
            case 'Low':
                return 'badge bg-success';
            default:
                return 'badge bg-secondary';
        }
    };

    return (
        <div className="px-4">
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Created On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>
                                    <span className={getStatusBadgeClass(task.status)}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={getPriorityBadgeClass(task.priority)}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td>{task.createdAt ? moment(task.createdAt).format("ll") : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskListTable;
