import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ParticleCanvas from './components/ParticleCanvas';
import authService from './services/auth.service';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="app-wrapper">
                {/* Interactive Particle Background */}
                <ParticleCanvas />

                {/* Animated gradient orbs */}
                <div className="bg-gradient-orbs">
                    <div className="bg-orb-3"></div>
                </div>
                <div className="bg-grid"></div>

                {/* Ambient light effect */}
                <div className="ambient-light" />

                {/* Routes */}
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard onLogout={handleLogout} />
                                </PrivateRoute>
                            }
                        />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    );
}

export default App;
