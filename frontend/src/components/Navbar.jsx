import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>📋 Task Manager</h1>
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-actions">
            <div className="user-info">
              <span>{user?.name}</span>
              <span className={`role-badge ${user?.role}`}>{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
