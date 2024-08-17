import Togglable from "./Togglable";

const Blog = ({ blog, handleLike }) => {
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
      </Togglable>
    </div>
  );
};

export default Blog;
