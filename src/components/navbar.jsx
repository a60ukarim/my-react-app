import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/login');
    return (
        <header className="app-navbar">
            <div className="navbar-topline">
                <Link className="navbar-brand" to="/dashboard" aria-label="Dashboard home">
                    <span className="brand-mark">D</span>
                    <span className="brand-name">Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="logout-btn" type="button">Logout <span aria-hidden="true">↗</span></button>
            </div>
        </header>
    );
}
