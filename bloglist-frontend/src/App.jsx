import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    likes: "",
    url: "",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: null,
  });
  const blogFormRef = useRef(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogListUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNotificationMessage({
          message: `Added blog ${blogObject.title}`,
          type: "success",
        });
        setTimeout(() => {
          setNotificationMessage({ message: null, type: null });
        }, 3000);
      })
      .catch((error) => {
        setNotificationMessage({
          message: `Failed to add blog`,
          type: "error",
        });
        setTimeout(() => {
          setNotificationMessage({ message: null, type: null });
        }, 3000);
      });
  };

  const handleLike = (id) => {
    const blog = blogs.find((b) => b.id === id);
    console.log(blog);
    blogService
      .update(blog.id, { likes: blog.likes + 1 })
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogListUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationMessage({
        message: `Incorrect username or password`,
        type: "error",
      });
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null });
      }, 3000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogListUser");
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
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
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
        />
      ))}
    </div>
  );

  return (
    <>
      <h2>blogs</h2>
      <Notification
        message={notificationMessage.message}
        type={notificationMessage.type}
      />
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
