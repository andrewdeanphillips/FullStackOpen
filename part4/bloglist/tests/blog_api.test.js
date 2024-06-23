const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')

const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

const getValidTestToken = async () => {
    const username = helper.initialUsers[0].username;
    const password = helper.initialUsers[0].password;

    const loginDetails = {
        username: username,
        password: password
    }

    const validToken = await api
        .post('/api/login')
        .send(loginDetails)
        .expect(200)

    return validToken.body.token
}

let validTestToken

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    validTestToken = await getValidTestToken()
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
        .set('Authorization', `Bearer ${validTestToken}`)
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
        .set('Authorization', `Bearer ${validTestToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert(response.body.likes === 0)
})


test('a blog without a title cannot be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.blogWithoutTitle)
        .set('Authorization', `Bearer ${validTestToken}`)
        .expect(400)
})


test('a blog without a url cannot be added', async () => {
    await api
        .post('/api/blogs')
        .send(helper.blogWithoutUrl)
        .set('Authorization', `Bearer ${validTestToken}`)
        .expect(400)
})



test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))

})

test('a like can be added to a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const originalLikes = blogToUpdate.likes
    blogToUpdate.likes = blogToUpdate.likes + 1

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

    assert.strictEqual(originalLikes + 1, response.body.likes)
})



after(async () => {
    await mongoose.connection.close()
})