const { test, after, beforeEach, describe } = require('node:test')
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

describe('User details are validated before being added to db', () => {
    test('username under 3 chars cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(helper.shortUsernameUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            assert(response.body.error.includes('username')
            && response.body.error.includes('is shorter than the minimum allowed length (3)'));

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('password under 3 chars cannot be added', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(helper.shortPasswordUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('usernames must be unique', async () => {
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(helper.existingUsernameUser)
            .expect(400)

        assert(response.body.error.includes('expected `username` to be unique'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})



after(async () => {
    await mongoose.connection.close()
})