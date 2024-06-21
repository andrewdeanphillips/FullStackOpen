const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')

const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


test('2 blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id property def has no underscore', async () => {
    const response = await api.get('/api/blogs')
    const keyNames = Object.keys(response.body[0])

    assert(keyNames.includes('id'))
    assert(!(keyNames.includes('_id')))
})

test('a valid blog can be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('LinkedIn Blog'))
})


test('a blog without likes will be added with 0 likes', async () => {
    const response = await api
        .post('/api/blogs')
        .send(helper.blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert(response.body.likes === 0)
})

test('a blog without a title cannot be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.blogWithoutTitle)
        .expect(400)
})

test('a blog without a url cannot be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.blogWithoutUrl)
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})