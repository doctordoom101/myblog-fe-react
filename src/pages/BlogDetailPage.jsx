import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getBlogById(id);
        setBlog(response.data);
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog details. The post might have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogApi.deleteBlog(id);
        navigate('/');
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog post.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">Return to home page</Link>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const isAuthor = currentUser && blog.author && currentUser.id === blog.author.id;
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto">
      <article className="bg-white rounded-lg shadow-md p-6 mb-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <span>By {blog.author.username}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.categories.map(category => (
              <span key={category.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {category.name}
              </span>
            ))}
          </div>
          
          {isAuthor && (
            <div className="flex space-x-4 mb-6">
              <Link 
                to={`/edit/${blog.id}`} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </Link>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </header>
        
        <div className="prose max-w-none">
          {/* Render content with line breaks */}
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>
      
      <CommentSection blogId={id} />
    </div>
  );
};

export default BlogDetailPage;