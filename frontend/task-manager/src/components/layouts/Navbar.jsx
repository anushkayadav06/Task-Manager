import { React, useState } from 'react'
import SideMenu from './SideMenu'
const Navbar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3 shadow-sm fixed-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                <button
                    className="btn btn-outline-secondary d-lg-none"
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                >
                    <i className={`fas ${openSideMenu ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
                <h4 className="m-0 text-primary">Task Manager</h4>
            </div>

            {openSideMenu && (
                <div className="position-absolute top-100 start-0 w-100 bg-white shadow-sm z-3">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </nav>
    )
}

export default Navbar
