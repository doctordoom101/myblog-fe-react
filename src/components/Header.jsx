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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MyBlog</Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/create" className="hover:text-gray-300">New Post</Link>
              <div className="relative group flex items-center space-x-2">
                  {currentUser?.profilePicture ? (
                    <img 
                      src={currentUser.profile_picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  )}
                <button className="flex items-center hover:text-gray-300">
                  <span className="mr-1">{currentUser?.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 top-5 mt-2 w-48 bg-white rounded-md hover:delay-300 shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to={`/profile/${currentUser?.username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                  <Link to="/my-posts" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Posts</Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Sign in</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;