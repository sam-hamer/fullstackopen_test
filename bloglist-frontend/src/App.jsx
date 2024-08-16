import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

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

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      likes: newBlog.likes,
      url: newBlog.url,
    };

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNewBlog({
          title: "",
          likes: "",
          url: "",
        });
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

  const handleBlogChange = (event) => {
    setNewBlog((previousBlog) => ({
      ...previousBlog,
      [event.target.name]: event.target.value,
    }));
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
  );

  const blogList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
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
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          {blogForm()}
          {blogList()}
        </div>
      )}
    </>
  );
};

export default App;
