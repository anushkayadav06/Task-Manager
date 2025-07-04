import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apipaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateUser } = useContext(UserContext);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError("");
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

            const { token, role } = response.data;
            console.log("✅ Login successful:", role);
            console.log("💾 Saving token to localStorage:", token);

            if (token) {
                localStorage.setItem("token", token);
                updateUser(response.data);
                //redirect based on role
                if (role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong . Please try again");
            }
        }
    };

    return (
        <AuthLayout>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className='mt-4'>Welcome Back</h3>
                <p className='mb-4'>Please enter your details to log in</p>

                <form onSubmit={handleLogin} className='mt-4'>
                    <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        placeholder="john@example.com"

                    />

                    <Input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Min 8 characters"

                    />

                    {error && (
                        <div className="alert alert-danger mt-2" role="alert">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Login
                    </button>

                    <p className="text-center mt-3">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
