import { useState } from "react";

const Blog = ({ blog, addLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const hideWhenVisible = { display: detailsVisible ? "none" : "" };
  const showWhenVisible = { display: detailsVisible ? "" : "none" };

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleAddLike = (event) => {
    event.preventDefault();
    addLike({
      _id: blog.id,
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    });
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide
        </button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}
        <br></br>
        likes {blog.likes} <button onClick={handleAddLike}>like</button>
        <br></br>
        {blog.user.name}
      </div>
    </div>
  );
};

export default Blog;