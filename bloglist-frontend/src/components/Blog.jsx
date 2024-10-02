import Togglable from './Togglable';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  return (
    <div className="blog">
      <div className="title">{blog.title}</div>
      <div className="author">{blog.author}</div>

      <Togglable buttonLabel="view" closeLabel="hide">
        <div className="url">{blog.url}</div>
        <div className="likes">{blog.likes}</div>
        <button onClick={handleLike}>like</button>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={handleRemove}>remove</button>}
      </Togglable>
    </div>
  );
};

export default Blog;
