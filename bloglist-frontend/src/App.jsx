import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog, updateBlog, removeBlog } from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(initializeBlogs(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        dispatch(createBlog(returnedBlog));
        dispatch(setNotification(`Added blog ${blogObject.title}`, 'success'));
      })
      .catch((error) => {
        dispatch(setNotification('Failed to add blog', 'error'));
      });
  };

  const handleLike = (id) => {
    const blog = blogs.find((b) => b.id === id);
    blogService.update(blog.id, { likes: blog.likes + 1 }).then((returnedBlog) => {
      dispatch(updateBlog(returnedBlog));
    });
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const blog = blogs.find((b) => b.id === id);
      blogService.remove(blog.id).then(() => {
        dispatch(removeBlog(id));
      });
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotification('Incorrect username or password', 'error'));
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogListUser');
    dispatch(clearUser());
    //blogService.setToken(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const blogList = () => (
    <div data-testid="blog-list">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleRemove={() => handleRemove(blog.id)}
          user={user}
        />
      ))}
    </div>
  );

  return (
    <>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <span>{user.name} logged-in</span>
          <button onClick={handleLogout}>logout</button>
          <br />
          <br />
          {blogForm()}
          {blogList()}
        </div>
      )}
    </>
  );
};

export default App;
