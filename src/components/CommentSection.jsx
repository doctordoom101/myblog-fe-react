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
    return new Date(dateString).toLocaleString();
  };

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/comments/posts/${postId}`); 
        setError(null);
      } catch (err) {
        setError('Failed to load comments.');
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
      const response = await api.post('/comments/', {
        post: postId,
        content: newComment,
      });

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment.');
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
      const response = await api.put(`/comments/${editingComment}/`, {
        content: editContent,
      });

      setComments(comments.map((c) => (c.id === editingComment ? response.data : c)));
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      setError('Failed to update comment.');
      console.error('Error updating comment:', err);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}/`);

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
      console.error('Error deleting comment:', err);
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
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
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
          <div className="text-gray-500 text-center py-4">No comments yet.</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="font-medium">{comment.user.username}</div>
                <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
              </div>

              {editingComment === comment.id ? (
                <form onSubmit={handleUpdateComment} className="mt-3">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex space-x-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-2">{comment.content}</div>
              )}

              {currentUser && currentUser.id === comment.user.id && editingComment !== comment.id && (
                <div className="mt-3 flex space-x-2 justify-end">
                  <button onClick={() => handleEditComment(comment)} className="text-blue-600 hover:text-blue-800 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:text-red-800 text-sm">
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
