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
    <>
      <h3>{blog.title}</h3>

      <a className="url" href={blog.url}>
        {blog.url}
      </a>
      <div className="likes">
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>

      <div>added by {blog.user?.name}</div>
      {blog.user?.username === user?.username && <button onClick={handleRemove}>remove</button>}

      <div>
        <h4>Comments</h4>
        <form onSubmit={handleComment}>
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit">add comment</button>
        </form>

        <ul>
          {blog.comments?.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default BlogDetails;
