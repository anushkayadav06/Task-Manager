import React from 'react';

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="btn-group" role="group" aria-label="Task Status Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    className={`btn ${activeTab === tab.label ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setActiveTab(tab.label)}
                >
                    {tab.label}
                    <span className="badge bg-light text-dark ms-2">{tab.count}</span>
                </button>
            ))}
        </div>
    );
};

export default TaskStatusTabs;
