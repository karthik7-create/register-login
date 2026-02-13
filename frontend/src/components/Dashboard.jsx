import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLogout, HiOutlineShieldCheck, HiOutlineClock, HiOutlineMail, HiOutlineUser, HiOutlineCalendar } from 'react-icons/hi';
import authService from '../services/auth.service';
import FloatingCard from './FloatingCard';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const welcomeTimer = setTimeout(() => setShowWelcome(false), 4000);
        return () => {
            clearInterval(timer);
            clearTimeout(welcomeTimer);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        if (onLogout) onLogout();
        navigate('/login');
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    };

    const initial = user?.username?.charAt(0) || '?';

    const greeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const stats = [
        { icon: <HiOutlineShieldCheck />, label: 'Security', value: 'Protected', color: '#10b981' },
        { icon: <HiOutlineClock />, label: 'Session', value: 'Active', color: '#6c63ff' },
        { icon: <HiOutlineCalendar />, label: 'Last Login', value: 'Today', color: '#a855f7' },
    ];

    return (
        <div className="dashboard-container">
            {/* Welcome overlay */}
            {showWelcome && (
                <motion.div
                    className="welcome-overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 2.5 }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                        className="welcome-checkmark"
                    >
                        ✓
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        Welcome back, {user?.username || 'User'}!
                    </motion.p>
                </motion.div>
            )}

            <FloatingCard>
                <motion.div
                    className="dashboard-card"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Animated border */}
                    <div className="animated-border dashboard-border" />

                    {/* Header section */}
                    <div className="dashboard-header-section">
                        {/* Avatar with ring animation */}
                        <motion.div className="dashboard-avatar-wrapper" variants={itemVariants}>
                            <div className="avatar-ring" />
                            <div className="dashboard-avatar">
                                {initial}
                            </div>
                            <div className="avatar-status" />
                        </motion.div>

                        {/* Greeting */}
                        <motion.p className="dashboard-greeting" variants={itemVariants}>
                            {greeting()} 👋
                        </motion.p>

                        <motion.h1 className="dashboard-username" variants={itemVariants}>
                            {user?.username || 'User'}
                        </motion.h1>
                    </div>

                    {/* Info Cards */}
                    <motion.div className="info-cards" variants={itemVariants}>
                        <div className="info-card">
                            <HiOutlineMail className="info-card-icon" />
                            <div>
                                <span className="info-label">Email</span>
                                <span className="info-value">{user?.email || 'No email'}</span>
                            </div>
                        </div>
                        <div className="info-card">
                            <HiOutlineUser className="info-card-icon" />
                            <div>
                                <span className="info-label">Username</span>
                                <span className="info-value">{user?.username || 'User'}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div className="dashboard-stats" variants={itemVariants}>
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card"
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                                    {stat.icon}
                                </div>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Live clock */}
                    <motion.div className="live-clock" variants={itemVariants}>
                        <HiOutlineClock />
                        <span>
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </span>
                        <span className="clock-date">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </motion.div>

                    {/* Auth badge */}
                    <motion.div variants={itemVariants}>
                        <div className="dashboard-badge">
                            <span className="dot" />
                            Authenticated via JWT
                        </div>
                    </motion.div>

                    {/* Logout */}
                    <motion.div variants={itemVariants}>
                        <motion.button
                            className="logout-btn"
                            onClick={handleLogout}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HiOutlineLogout size={18} />
                            Sign Out
                        </motion.button>
                    </motion.div>
                </motion.div>
            </FloatingCard>
        </div>
    );
};

export default Dashboard;
