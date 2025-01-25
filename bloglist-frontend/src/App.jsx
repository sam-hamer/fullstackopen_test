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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                data-testid="username"
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
                required
                className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                data-testid="password"
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const blogList = () => (
    <div data-testid="blog-list" className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Blogs</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">{blog.title}</h3>
                <p className="mt-1 text-sm text-gray-500 truncate">{blog.url}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  {blog.likes} likes
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const usersList = () => (
    <div data-testid="users-list" className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Users</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Blogs Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const userMatch = useMatch('users/:id');
  const foundUser = userMatch ? users.find((user) => user.id === userMatch.params.id) : null;
  const blogMatch = useMatch('blogs/:id');
  const foundBlog = blogMatch ? blogs.find((blog) => blog.id === blogMatch.params.id) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Menu handleLogout={handleLogout} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Notification />
        {user === null ? (
          loginForm()
        ) : (
          <div className="space-y-6">
            {blogForm()}
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
      </div>
    </div>
  );
};

export default App;
