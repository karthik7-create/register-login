import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';

const PrivateRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
