// src/components/BlogCard.jsx
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Format date for display
  const formattedDate = new Date(blog.created_at).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 truncate">
          <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:text-blue-800">
            {blog.title}
          </Link>
        </h2>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>{blog.author.username}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
        
        <p className="text-gray-600 line-clamp-3 mb-4">
          {blog.content.slice(0, 150)}
          {blog.content.length > 150 ? '...' : ''}
        </p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/blog/${blog.id}`} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read more
          </Link>
          
          <div className="flex space-x-2">
            {blog.categories.map((category, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;