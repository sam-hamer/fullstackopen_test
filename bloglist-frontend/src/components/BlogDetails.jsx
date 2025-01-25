import { useState } from 'react';
import { useDispatch } from 'react-redux';
import blogService from '../services/blogs';
import { updateBlog } from '../reducers/blogReducer';

const BlogDetails = ({ blog, handleLike, handleRemove, user }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  if (!blog) {
    return null;
  }

  const handleComment = async (event) => {
    event.preventDefault();
    try {
      const updatedBlog = await blogService.addComment(blog.id, comment);
      dispatch(updateBlog(updatedBlog));
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">{blog.title}</h2>

            <a href={blog.url} className="text-blue-600 hover:text-blue-800 text-lg break-all">
              {blog.url}
            </a>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <span className="text-lg font-medium">{blog.likes} likes</span>
              </div>
              <button
                onClick={handleLike}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Like
              </button>
            </div>

            <div className="text-gray-600">
              Added by <span className="font-medium">{blog.user?.name}</span>
            </div>

            {blog.user?.username === user?.username && (
              <button
                onClick={handleRemove}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Remove Blog
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>

          <form onSubmit={handleComment} className="mb-6">
            <div className="flex space-x-4">
              <input
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                placeholder="Write a comment..."
                className="flex-1 min-w-0 h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Comment
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {blog.comments?.map((comment, index) => (
              <li key={index} className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
