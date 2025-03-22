import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.posts.get(id);
        setPost(response.data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Post not found.');
        } else {
          setError('Failed to load post. Please try again later.');
        }
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.posts.delete(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post. Please try again.');
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="large" message="Loading post..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span className="font-medium">{post.user.username}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          {/* Display post content with proper formatting */}
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() !== '' ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          {/* Edit/Delete buttons for author */}
          {currentUser && currentUser.id === post.user.id && (
            <div className="mt-8 flex space-x-4">
              <Link
                to={`/edit/${post.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDeletePost}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </article>
      
      {/* Comments section */}
      <div className="max-w-3xl mx-auto mt-6">
        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default BlogDetailPage;