import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import authService from '../services/auth.service';
import FloatingCard from './FloatingCard';
import TypeWriter from './TypeWriter';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message.text) setMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        if (!formData.email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
        if (!formData.password) return 'Password is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            setMessage({ type: 'error', text: error });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authService.login(formData);
            setMessage({ type: 'success', text: response.message || 'Login successful!' });
            if (onLoginSuccess) onLoginSuccess();
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid email or password.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const createRipple = useCallback((e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        ripple.className = 'btn-ripple';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
        },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <div className="auth-container">
            <FloatingCard>
                <motion.div
                    className="auth-card"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Animated border glow */}
                    <div className="animated-border" />

                    {/* Logo */}
                    <motion.div className="auth-logo" variants={itemVariants}>
                        <motion.div
                            className="logo-icon"
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="logo-shield">🔐</span>
                        </motion.div>
                    </motion.div>

                    {/* Header */}
                    <motion.div className="auth-header" variants={itemVariants}>
                        <h1>Welcome Back</h1>
                        <p className="auth-subtitle">
                            <TypeWriter texts={[
                                'Sign in to your account',
                                'We missed you! Welcome back',
                                'Access your secure dashboard',
                            ]} />
                        </p>
                    </motion.div>

                    {/* Message */}
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                className={`message ${message.type}`}
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="message-icon">
                                    {message.type === 'success' ? '✓' : '⚠'}
                                </span>
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <motion.div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="login-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlineMail /></span>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="email"
                                />
                            </div>
                        </motion.div>

                        <motion.div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="login-password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlineLockClosed /></span>
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                                onClick={createRipple}
                            >
                                <span className="btn-content">
                                    {loading && <span className="spinner" />}
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </span>
                                <span className="btn-shimmer" />
                            </button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div className="auth-divider" variants={itemVariants}>
                        <span>or</span>
                    </motion.div>

                    {/* Footer */}
                    <motion.div className="auth-footer" variants={itemVariants}>
                        Don't have an account? <Link to="/register">Create one</Link>
                    </motion.div>
                </motion.div>
            </FloatingCard>
        </div>
    );
};

export default Login;
