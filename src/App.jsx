import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}