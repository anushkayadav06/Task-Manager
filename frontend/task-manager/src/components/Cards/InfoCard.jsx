import React from 'react';

const InfoCard = ({ label, value, color }) => {
    return (
        <div className={`p-3 rounded text-black ${color}`}>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{label}</span>
                <span className="fs-5 fw-bold">{value}</span>
            </div>
        </div>
    );
};

export default InfoCard;
