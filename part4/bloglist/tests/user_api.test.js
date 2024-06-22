const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')

const helper = require('./test_helper')

const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const promiseArray = helper.initialUsers.map(async (user) => {
        await api
            .post('/api/users')
            .send(user)
    })
    await Promise.all(promiseArray)
})

test('a valid user can be added', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
        .post('/api/users')
        .send(helper.newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const username = usersAtEnd.map(b => b.username)
    assert(username.includes('jc28'))
})

test('users can be viewed', async () => {
    const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const usernames = users.body.map(u => u.username)
    assert(usernames.includes('bbam'))
})



after(async () => {
    await mongoose.connection.close()
})