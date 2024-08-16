const Blog = ({ blog }) => (
  <div>
    {blog.title}
    <span> likes: </span>
    {blog.likes}
  </div>
);

export default Blog;
