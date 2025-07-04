import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    }

    // Logged in but not authorized
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
};
export default PrivateRoute;
