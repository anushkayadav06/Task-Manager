import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route === 'logout') {
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login');
    };

    useEffect(() => {
        if (user) {
            const menu = user.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
            setSideMenuData(menu);
        }
    }, [user]);

    return (
        <div className="bg-light p-3" style={{ marginTop: '60px', minHeight: '100vh', width: '250px', position: 'sticky', top: '0', overflow: 'auto' }}>
            <div className="mb-4">
                {user?.role === 'admin' && (
                    <div className="text-muted small mb-1">Admin</div>
                )}
                <h5>{user?.name || ''}</h5>
                <p className="text-muted">{user?.email || ''}</p>
            </div>

            <div className="d-flex flex-column gap-2">
                {sideMenuData.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`btn menu-button text-start ${activeMenu === item.label ? 'active' : ''
                            }`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="me-2" /> {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SideMenu;
