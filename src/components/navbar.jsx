import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="navbar">
            <h3 className="navbar-title">Dashboard</h3>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
}