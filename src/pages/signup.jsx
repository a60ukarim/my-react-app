import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (name && email && password) {
            alert('Account Created Successfully! Please Login');
            navigate('/login');
        } else {
            alert('Please Fill In All Fields')
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignUp} className="signup-form">
                <h2 className="signup-title">Create New Acoount</h2>

                <div className="form-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group form-group-mb">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="signup-btn">Register</button>

                <p className="signup-link-text">
                    Already Have An Account? <Link to="/login" className="signup-link">Login</Link>
                </p>
            </form>
        </div>
    );
}