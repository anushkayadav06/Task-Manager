import React from 'react';
import moment from 'moment';

const UserTaskCard = ({
    title = 'Untitled Task',
    description = 'No description provided.',
    priority = 'Low',
    status = 'Pending',
    createdAt,
    dueDate,
    createdBy = {},
    handleMarkCompleted,
    handleMarkInProgress,
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
        <div
            className="card mb-4 shadow-sm"
            style={{ cursor: 'pointer' }}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={getStatusTagClass()}>{status}</span>
                    <span className={`fw-bold ${getPriorityClass()}`}>{priority} Priority</span>
                </div>

                <h5 className="card-title">{title}</h5>
                <p className="card-text text-muted mb-3">{description}</p>

                <p className="mb-2">
                    <strong>Created By:</strong> {createdBy?.email || "Unassigned"}
                </p>

                <div className="row text-muted mt-3">
                    <div className="col">
                        <small className="d-block">Start Date</small>
                        <span>{createdAt ? moment(createdAt).format("Do MMM YYYY") : "N/A"}</span>
                    </div>
                    <div className="col">
                        <small className="d-block">Due Date</small>
                        <span>{dueDate ? moment(dueDate).format("Do MMM YYYY") : "N/A"}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="text-end mt-3 d-flex gap-2 justify-content-end">
                    {status === "Pending" && (
                        <>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkInProgress?.();
                                }}
                            >
                                Mark as In Progress
                            </button>
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkCompleted?.();
                                }}
                            >
                                Mark as Completed
                            </button>
                        </>
                    )}

                    {status === "In Progress" && (
                        <button
                            className="btn btn-sm btn-outline-success"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkCompleted?.();
                            }}
                        >
                            Mark as Completed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserTaskCard;
