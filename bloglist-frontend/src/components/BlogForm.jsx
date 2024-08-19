import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      likes: newBlog.likes,
      url: newBlog.url,
    };

    createBlog(blogObject);

    setNewBlog({
      title: '',
      likes: '',
      url: '',
    });
  };

  const handleBlogChange = (event) => {
    setNewBlog((previousBlog) => ({
      ...previousBlog,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <span>title</span>
        <input name="title" value={newBlog.title} onChange={handleBlogChange} />
        <br />
        <span>url</span>
        <input name="url" value={newBlog.url} onChange={handleBlogChange} />
        <br />
        <span>likes</span>
        <input name="likes" value={newBlog.likes} onChange={handleBlogChange} />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
