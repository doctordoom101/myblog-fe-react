import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/edit/${id}`, message: 'You must be logged in to edit a post.' } });
    }
  }, [isAuthenticated, navigate, id]);

  // Fetch post for editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.posts.get(id);
        setPost(response.data);
        
        // Check if user is the author
        if (currentUser && response.data.user.id !== currentUser.id) {
          navigate(`/blog/${id}`, { 
            state: { error: 'You are not authorized to edit this post.' } 
          });
          return;
        }
        
        // Set form data
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate('/', { state: { error: 'Post not found.' } });
        } else {
          console.error('Error fetching post for editing:', err);
          setErrors({ general: 'Failed to load post. Please try again.' });
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchPost();
    }
  }, [id, currentUser, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await api.posts.update(id, {
        title,
        content
      });
      
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      
      if (err.response && err.response.data) {
        // Set form errors from API response
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'Failed to update post. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="large" message="Loading post..." />
      </div>
    );
  }
  
  if (!post && !loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Post not found or you don't have permission to edit it.</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
        
        {errors.general && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows="12"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
            ></textarea>
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>
          
          <div className="flex justify-between">
            <Link
              to={`/blog/${id}`}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPage;