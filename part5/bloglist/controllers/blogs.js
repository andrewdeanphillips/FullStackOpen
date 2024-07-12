const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
  response.json(blogs)
})


blogRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const user = request.user

  console.log('author', request.body.author)

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    user: user._id,
    url: request.body.url,
    likes: request.body.likes
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user')
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  const userMakingRequest = request.user

  if (userMakingRequest._id.toString() !== blogToDelete.user.toString()) {
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

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user')
  response.json(updatedBlog)
})



module.exports = blogRouter