import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/login');

    return (
        <header className="app-navbar">
            <div className="navbar-topline">
                <a className="navbar-brand" href="/dashboard" aria-label="Dashboard home">
                    <span className="brand-mark">D</span>
                    <span className="brand-name">Dashboard</span>
                </a>
                <button onClick={handleLogout} className="logout-btn" type="button">
                    Logout <span aria-hidden="true">↗</span>
                </button>
            </div>
            <nav className="navbar-links" aria-label="Main navigation">
                <a className="navbar-link active" href="/dashboard"><span aria-hidden="true">⌂</span> Home</a>
                <a className="navbar-link" href="/dashboard"><span aria-hidden="true">♙</span> Profile</a>
                <a className="navbar-link" href="/dashboard"><span aria-hidden="true">⚙</span> Setting</a>
            </nav>
        </header>
    );
}
