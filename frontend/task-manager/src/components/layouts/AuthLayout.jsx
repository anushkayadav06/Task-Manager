import React from 'react';
import URL_IMG from '../../assets/images/bg-image.jpg'
const AuthLayout = ({ children }) => {
    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Left section for form */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-start p-5">
                    <h2 className="mb-4 fw-bold">Task Manager</h2>
                    {children}
                </div>

                {/* Right section for image */}
                <div className="col-md-6 d-none d-md-block p-0">
                    <img
                        src={URL_IMG}
                        alt="Login Visual"
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
