const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: request.body.title,
    author: user.name,
    user: user._id,
    url: request.body.url,
    likes: request.body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (decodedToken.id !== blogToDelete.user.toString()) { 
    return response.status(401).json({ error: 'blog can only be edited by its creator' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})



module.exports = blogRouter