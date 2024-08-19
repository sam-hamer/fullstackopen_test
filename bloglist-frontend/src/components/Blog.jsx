import Togglable from './Togglable';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  return (
    <div className="blog">
      <span>{blog.title}</span>
      <Togglable buttonLabel="view" closeLabel="hide">
        {blog.url}
        <br />
        {blog.likes}
        <button onClick={handleLike}>like</button>
        <br />
        {blog.user.name}
        <br />
        {blog.user.username === user.username && <button onClick={handleRemove}>remove</button>}
        <br />
      </Togglable>
    </div>
  );
};

export default Blog;
