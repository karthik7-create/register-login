import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import authService from '../services/auth.service';
import FloatingCard from './FloatingCard';
import TypeWriter from './TypeWriter';

const SuccessConfetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 720 - 360,
        color: ['#6c63ff', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 1.5 + 1.5,
    }));

    return (
        <div className="confetti-container">
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="confetti-piece"
                    initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
                    animate={{
                        y: '100vh',
                        rotate: piece.rotation,
                        opacity: [1, 1, 0],
                        scale: [1, 1.2, 0.5],
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'fixed',
                        width: piece.size,
                        height: piece.size * 0.6,
                        backgroundColor: piece.color,
                        borderRadius: piece.size > 8 ? '50%' : '2px',
                        zIndex: 100,
                        top: 0,
                        left: 0,
                    }}
                />
            ))}
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showConfetti, setShowConfetti] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
        if (message.text) setMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        if (!formData.username.trim()) return 'Username is required';
        if (formData.username.length < 3) return 'Username must be at least 3 characters';
        if (!formData.email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        if (!formData.phoneNumber.trim()) return 'Phone number is required';
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
            const response = await authService.register(formData);
            setMessage({ type: 'success', text: response.message || 'Registration successful! Redirecting to login...' });
            setShowConfetti(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
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
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06 },
        },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    };

    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const strengthColors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

    return (
        <div className="auth-container">
            <AnimatePresence>{showConfetti && <SuccessConfetti />}</AnimatePresence>

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

                    {/* Logo with pulse */}
                    <motion.div className="auth-logo" variants={itemVariants}>
                        <motion.div
                            className="logo-icon"
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="logo-shield">🛡️</span>
                        </motion.div>
                    </motion.div>

                    {/* Header with typewriter */}
                    <motion.div className="auth-header" variants={itemVariants}>
                        <h1>Create Account</h1>
                        <p className="auth-subtitle">
                            <TypeWriter texts={[
                                'Join us today and get started',
                                'Secure authentication system',
                                'Create your account in seconds',
                            ]} />
                        </p>
                    </motion.div>

                    {/* Step indicator */}
                    <motion.div className="step-indicator" variants={itemVariants}>
                        {['Profile', 'Security', 'Contact'].map((step, i) => (
                            <div
                                key={step}
                                className={`step ${(i === 0 && (focusedField === 'username' || focusedField === 'email'))
                                        ? 'active'
                                        : i === 1 && focusedField === 'password'
                                            ? 'active'
                                            : i === 2 && focusedField === 'phoneNumber'
                                                ? 'active'
                                                : ''
                                    }`}
                            >
                                <div className="step-dot">{i + 1}</div>
                                <span>{step}</span>
                            </div>
                        ))}
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
                        <motion.div className={`form-group ${focusedField === 'username' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="register-username">Username</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlineUser /></span>
                                <input
                                    id="register-username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="username"
                                />
                                {formData.username.length >= 3 && (
                                    <motion.span
                                        className="input-check"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="register-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlineMail /></span>
                                <input
                                    id="register-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="email"
                                />
                                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                    <motion.span
                                        className="input-check"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="register-password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlineLockClosed /></span>
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="new-password"
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
                            {/* Password Strength Bar */}
                            {formData.password && (
                                <motion.div
                                    className="password-strength"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <div className="strength-bar">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <motion.div
                                                key={level}
                                                className="strength-segment"
                                                initial={{ scaleX: 0 }}
                                                animate={{
                                                    scaleX: passwordStrength >= level ? 1 : 0,
                                                    backgroundColor: passwordStrength >= level ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.06)',
                                                }}
                                                transition={{ duration: 0.3, delay: level * 0.05 }}
                                            />
                                        ))}
                                    </div>
                                    <span className="strength-label" style={{ color: strengthColors[passwordStrength] }}>
                                        {strengthLabels[passwordStrength]}
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div className={`form-group ${focusedField === 'phoneNumber' ? 'focused' : ''}`} variants={itemVariants}>
                            <label htmlFor="register-phone">Phone Number</label>
                            <div className="input-wrapper">
                                <span className="input-icon"><HiOutlinePhone /></span>
                                <input
                                    id="register-phone"
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Enter your phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('phoneNumber')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="tel"
                                />
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
                                    {loading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account? <Link to="/login">Sign in</Link>
                    </motion.div>
                </motion.div>
            </FloatingCard>
        </div>
    );
};

export default Register;
