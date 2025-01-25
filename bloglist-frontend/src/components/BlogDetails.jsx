const BlogDetails = ({ blog, handleLike, handleRemove, user }) => {
  if (!blog) {
    return null;
  }
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
    </>
  );
};

export default BlogDetails;
