import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, userIsOwner }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const deleteVisibility = { display: userIsOwner ? '' : 'none' }
  console.log(deleteVisibility)

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleAddLike = (event) => {
    event.preventDefault()
    addLike({
      _id: blog.id,
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    })
  }

  const handleDeleteBlog = (event) => {
    event.preventDefault()
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='basicBlogInfo'>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisible} onClick={toggleVisibility}>
          hide
        </button>
      </div>
      <div style={showWhenVisible} className='additionalBlogInfo'>
        {blog.url}
        <br></br>
        <span>likes {blog.likes}</span>
        <button onClick={handleAddLike}>like</button>
        <br></br>
        {blog.user.name}
        <br></br>
        <button style={deleteVisibility} className='deleteButton' onClick={handleDeleteBlog}>remove</button>
      </div>
    </div>
  )
}

export default Blog
