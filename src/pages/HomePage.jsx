import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.posts.getAll(currentPage);
        
        // Check if we have more pages
        if (response.data.results.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prevPosts => 
            currentPage === 1 
              ? response.data.results 
              : [...prevPosts, ...response.data.results]
          );
          
          // Check if we have more pages from pagination
          setHasMore(!!response.data.next);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Latest Blog Posts</h1>
        <p className="text-gray-600">Discover thoughts, ideas, and stories from our community</p>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {loading && <div className="my-8"><LoadingSpinner /></div>}
      
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No posts found.</p>
        </div>
      )}
      
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMorePosts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;