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
  const [user, setUser] = useState(null);
  const [notificationText, setNotificationText] = useState("");
  const [notificationColor, setNotifcationColor] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogsSortedByLikes(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const setBlogsSortedByLikes = (blogsToSort) => {
    setBlogs(blogsToSort.sort((a, b) => -(a.likes - b.likes)));
  };

  const handleLogin = async (username, password) => {
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
      blogObject.user = user.id;
      const returnedBlog = await blogService.create(blogObject);
      setBlogsSortedByLikes(blogs.concat(returnedBlog));
      displayNotification(
        "green",
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
    } catch (error) {
      displayNotification("red", "Error adding blog");
    }
  };

  const addLike = async (blogObject) => {
    try {
      blogObject.likes = blogObject.likes + 1;
      const returnedBlog = await blogService.put(blogObject);

      setBlogsSortedByLikes(
        blogs.filter((b) => b.id !== blogObject._id).concat(returnedBlog)
      );

      displayNotification(
        "green",
        `like added to ${returnedBlog.title} by ${returnedBlog.author}`
      );
    } catch (error) {
      displayNotification("red", "Error adding like", error);
      console.log(error.message);
    }
  };

  const deleteBlog = async (blogToDelete) => {
    try {
      const response = await blogService.erase(blogToDelete.id);
      setBlogsSortedByLikes(
        blogs.filter((b) => b.id !== blogToDelete.id)
      );
      displayNotification(
        "green",
        `${blogToDelete.title} by ${blogToDelete.author} deleted`
      );
    } catch (error) {
      console.log(error.message)
      displayNotification("red", "Error deleting blog");
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
        <LoginForm handleLogin={handleLogin} />
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
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog}/>
      ))}
    </div>
  );
};

export default App;
