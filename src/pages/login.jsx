import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

export default function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate('');

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Enter</button>
                </form>

                <p className="login-footer">
                    Don't Have An Account? <Link to="/signup" className="login-link">Create New Account</Link>
                </p>
            </div>
        </div>
    );
}