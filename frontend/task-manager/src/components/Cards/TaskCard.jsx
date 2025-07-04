import React from 'react';
import moment from 'moment';

const TaskCard = ({
    title = 'Untitled Task',
    description = 'No description provided.',
    priority = 'Low',
    status = 'Pending',
    createdAt,
    dueDate,
    assignedTo = {},
    onDelete,
}) => {
    const getStatusTagClass = () => {
        switch (status) {
            case 'In Progress':
                return 'badge bg-info text-dark';
            case 'Completed':
                return 'badge bg-success';
            default:
                return 'badge bg-secondary';
        }
    };

    const getPriorityClass = () => {
        switch (priority) {
            case 'High':
                return 'text-danger';
            case 'Medium':
                return 'text-warning';
            case 'Low':
                return 'text-success';
            default:
                return 'text-muted';
        }
    };

    return (
        <div className="card mb-4 shadow-sm" style={{ cursor: 'pointer' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={getStatusTagClass()}>{status}</span>
                    <span className={`fw-bold ${getPriorityClass()}`}>{priority} Priority</span>
                </div>

                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted mb-3">{description}</p>

                <p className="mb-2">
                    <strong>Assigned To:</strong> {assignedTo?.email || "Unassigned"}
                </p>

                <div className="row text-muted">
                    <div className="col">
                        <small className="d-block">Start Date</small>
                        <span>{createdAt ? moment(createdAt).format("Do MMM YYYY") : "N/A"}</span>
                    </div>
                    <div className="col">
                        <small className="d-block">Due Date</small>
                        <span>{dueDate ? moment(dueDate).format("Do MMM YYYY") : "N/A"}</span>
                    </div>
                </div>

                {status === "Completed" && (
                    <div className="text-end mt-3">
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.();
                            }}
                        >
                            Delete Task
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
