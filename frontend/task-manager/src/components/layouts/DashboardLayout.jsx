import React from 'react'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
const DashboardLayout = ({children,activeMenu}) => {

    const { user } = useContext(UserContext);

    return (
        <div>
            <Navbar activeMenu={activeMenu}/>

            {user && (
                <div className='d-flex'>
                    <div className='bd-light p-3' style={{width:'250px'}}>
                        <SideMenu activeMenu={activeMenu}/>
                    </div>

                    <div className='flex-grow-1 p-5'>{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout
