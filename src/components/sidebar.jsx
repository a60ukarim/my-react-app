import React from 'react';
import './sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li className="sidebar-item">Home</li>
                <li className="sidebar-item">Profile</li>
                <li className="sidebar-item">Setting</li>
            </ul>
        </div>
    );
}