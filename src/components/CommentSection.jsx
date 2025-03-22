import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.comments.getForPost(postId);
        setComments(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle new comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const response = await api.comments.create({
        post: postId,
        content: newComment
      });
      
      // Add the new comment to the list
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    }
  };

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // Handle update comment
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    
    try {
      const response = await api.comments.update(editingComment, {
        content: editContent
      });
      
      // Update the comment in the list
      setComments(comments.map(c => 
        c.id === editingComment ? response.data : c
      ));
      
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      setError('Failed to update comment. Please try again.');
      console.error('Error updating comment:', err);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.comments.delete(commentId);
        
        // Remove the comment from the list
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        setError('Failed to delete comment. Please try again.');
        console.error('Error deleting comment:', err);
      }
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  if (loading) {
    return <div className="my-6 text-center">Loading comments...</div>;
  }

  return (
    <div className="mt-10 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {isAuthenticated() && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-3">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </form>
      )}
      
      {!isAuthenticated() && (
        <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded">
          Please <a href="/login" className="underline font-medium">login</a> to join the discussion.
        </div>
      )}
      
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="font-medium">{comment.user.username}</div>
                <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
              </div>
              
              {editingComment === comment.id ? (
                <form onSubmit={handleUpdateComment} className="mt-3">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      type="submit" 
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2">{comment.content}</div>
              )}
              
              {currentUser && currentUser.id === comment.user.id && editingComment !== comment.id && (
                <div className="mt-3 flex space-x-2 justify-end">
                  <button 
                    onClick={() => handleEditComment(comment)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;