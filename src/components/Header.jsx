import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">BlogApp</Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/create" className="hover:text-gray-300 transition-colors">New Post</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{currentUser?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-x-2">
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;