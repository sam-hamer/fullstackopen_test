import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import User from './components/User';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import BlogForm from './components/BlogForm';
import Menu from './components/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog, updateBlog, removeBlog } from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';
import { initializeUsers, clearUsers } from './reducers/usersReducer';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import './index.css';
import UserDetails from './components/UserDetails';
import BlogDetails from './components/BlogDetails';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(initializeBlogs(blogs)));
    userService.getAll().then((users) => dispatch(initializeUsers(users)));
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
      <h3>blogs</h3>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog">
          <Link to={`/blogs/${blog.id}`}>
            <div>{blog.title}</div>
          </Link>{' '}
        </div>
      ))}
    </div>
  );

  const usersList = () => (
    <div data-testid="users-list">
      <h3>users</h3>
      <div className="usersList">
        <div className="usersHeader">Users</div>
        <div className="usersHeader">Blogs Created</div>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );

  const userMatch = useMatch('users/:id');
  const foundUser = userMatch ? users.find((user) => user.id === userMatch.params.id) : null;
  const blogMatch = useMatch('blogs/:id');
  const foundBlog = blogMatch ? blogs.find((blog) => blog.id === blogMatch.params.id) : null;

  return (
    <>
      <Menu handleLogout={handleLogout} />
      <h2>Blog App</h2>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <Routes>
            <Route path="users/:id" element={<UserDetails user={foundUser} />} />
            <Route
              path="blogs/:id"
              element={
                <BlogDetails
                  blog={foundBlog}
                  handleLike={() => handleLike(foundBlog.id)}
                  handleRemove={() => handleRemove(foundBlog.id)}
                  user={user}
                />
              }
            />
            <Route path="/users" element={usersList()} />
            <Route path="/" element={blogList()} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
