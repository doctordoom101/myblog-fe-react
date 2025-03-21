import { useState, useEffect } from 'react';
import { blogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ blogId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await blogApi.getComments(blogId);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await blogApi.addComment(blogId, { content: newComment });
      
      // Add new comment to list
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await blogApi.deleteComment(commentId);
        
        // Remove comment from list
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {isAuthenticated() ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </form>
      ) : (
        <div className="bg-gray-100 p-4 rounded mb-8">
          <p className="text-gray-700">
            Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{comment.author.username}</h4>
                  <p className="text-gray-500 text-sm">{formatDate(comment.created_at)}</p>
                </div>
                
                {currentUser && currentUser.id === comment.author.id && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;