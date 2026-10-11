import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

export default function Sidebar() {
    return (
        <aside className="sidebar" aria-label="Dashboard sidebar">
            <div className="sidebar-heading">MENU</div>
            <nav>
                <ul className="sidebar-menu">
                    <li><NavLink to="/dashboard" className="sidebar-link"><span aria-hidden="true">⌂</span>Home</NavLink></li>
                    <li><NavLink to="/dashboard" className="sidebar-link"><span aria-hidden="true">♙</span>Profile</NavLink></li>
                    <li><NavLink to="/dashboard" className="sidebar-link"><span aria-hidden="true">⚙</span>Setting</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
}
