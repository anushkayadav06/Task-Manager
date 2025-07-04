import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail, validateSignupForm } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [adminInviteToken, setAdminInviteToken] = useState('');

    const { updateUser } = useContext(UserContext);

    const handleSignUp = async (e) => {
        e.preventDefault();

        const errorMsg = validateSignupForm({ name, email, password, confirmPassword });

        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setError(null);

        try {
            const response = await axiosInstance.post('/api/auth/register', {
                name,
                email,
                password,
                adminInviteToken,
            });
            console.log("Signup response:", response.data);
            localStorage.setItem('token', response.data.token);
            updateUser(response.data);
            const role = response.data.role;
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <AuthLayout>
            <div className='mt-4' style={{ maxWidth: '400px', width: '100%' }}>
                <h3>Create an account</h3>
                <p>Join us today by entering your details below.</p>

                <form onSubmit={handleSignUp} autoComplete="off">
                    <div className="row">
                        <div className="col-md-6">
                            <Input
                                label="Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="col-md-6">
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                            />
                        </div>
                        <div className="col-md-6">
                            <Input
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Retype password"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 ">
                            <Input
                                label="Admin Invite Token"
                                type="text"
                                value={adminInviteToken}
                                onChange={(e) => setAdminInviteToken(e.target.value)}
                                placeholder="6 Digit Code"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-2" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Sign Up
                    </button>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </form>

            </div>

        </AuthLayout>
    );
}

export default SignUp
