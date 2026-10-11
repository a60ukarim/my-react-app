import React from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import './dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <Navbar />
            <Sidebar />
            <div className="dashboard-content">
                <h1 className="dashboard-title">Welcome To The Dashboard</h1>
                <p className="dashboard-text">Here you can easily view Data and Statistics for an Application</p>
            </div>
        </div>
    );
}