import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notifcation";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notificationText, setNotificationText] = useState("");
  const [notificationColor, setNotifcationColor] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBloglistappUser",
        JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      displayNotification("red", "wrong credentials");
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBloglistappUser");
    window.location.reload();
  };

  const handleCreate = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      blogObject.user = user.username;
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      displayNotification(
        "green",
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
    } catch (error) {
      displayNotification("red", "Error adding message");
    }
  };

  const displayNotification = (color, text) => {
    setNotifcationColor(color);
    setNotificationText(text);
    setTimeout(() => {
      setNotificationText("");
    }, 5000);
  };

  if (user == null) {
    return (
      <div>
        <Notification color={notificationColor} text={notificationText} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <Notification color={notificationColor} text={notificationText} />
      <h2>blogs</h2>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="create" ref={blogFormRef}>
        <CreateBlogForm handleCreate={handleCreate} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
