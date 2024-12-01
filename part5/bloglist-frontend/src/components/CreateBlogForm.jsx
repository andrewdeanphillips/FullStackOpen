import { useState } from 'react'

const CreateBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreate({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)}
            placeholder='write author name here'
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit" onClick={addBlog}>
          submit
        </button>
      </form>
    </div>
  )
}

export default CreateBlogForm
