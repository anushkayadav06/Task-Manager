import React from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/admin/Dashboard';
import ManageTasks from './pages/admin/ManageTasks';
import CreateTask from './pages/admin/CreateTask';
import PrivateRoute from './routes/PrivateRoute';
import UserDashboard from './pages/User/UserDashboard';
import MyTask from './pages/User/MyTask';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider, { UserContext } from './context/userContext';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* Admin */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
            </Route>

            {/* User */}
            <Route element={<PrivateRoute allowedRoles={['member']} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/my-tasks' element={<MyTask />} />
            </Route>

            {/* Default route */}
            <Route path='/' element={<Root/>} />
          </Routes>
        </Router>
      </div>

      <Toaster toastOptions={{
        className:"",
        style:{
          fontSize:"13px",
        },
      }}/>
    </UserProvider>
  );
}

export default App;

