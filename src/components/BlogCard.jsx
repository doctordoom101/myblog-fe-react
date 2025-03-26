import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  // Format the date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <Link to={`/blog/${post.id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
        </Link>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          {post.user.profile_picture ? (
            <img 
              src={post.user.profile_picture} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
          )}
          <span>{post.user.username}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.created_at)}</span>
        </div>
        
        <p className="text-gray-700 mb-4">{truncateContent(post.content)}</p>
        
        <Link 
          to={`/blog/${post.id}`}
          className="inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;