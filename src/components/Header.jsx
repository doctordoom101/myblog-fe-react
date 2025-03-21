// src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Blog Platform</Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link to="/create" className="hover:text-gray-300">Create Post</Link>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className="hover:text-gray-300"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <span className="text-gray-400">Hi, {currentUser.username}</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;