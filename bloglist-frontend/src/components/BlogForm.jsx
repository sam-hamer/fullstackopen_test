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
        <input
          data-testid="title"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
          placeholder="write title here"
        />
        <br />
        <span>url</span>
        <input
          data-testid="url"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
          placeholder="write url here"
        />
        <br />
        <span>likes</span>
        <input
          data-testid="likes"
          name="likes"
          value={newBlog.likes}
          onChange={handleBlogChange}
          placeholder="write likes here"
        />
        <br />
        <button data-testid="submit" type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
