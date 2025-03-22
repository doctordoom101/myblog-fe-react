import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">MyBlog</h3>
            <p className="text-gray-400 mt-1">Share your thoughts with the world</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {currentYear} BlogApp. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 justify-center md:justify-end">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;