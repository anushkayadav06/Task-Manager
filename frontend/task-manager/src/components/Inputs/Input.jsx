import React, { useState } from 'react';

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <div className="input-group">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                />
                {type === "password" && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={toggleShowPassword}
                    >
                    <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>

                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
