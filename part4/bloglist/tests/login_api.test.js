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

test('a user can login and recieve a token', async () => {
    const username = helper.initialUsers[0].username;
    const password = helper.initialUsers[0].password;
    const name = helper.initialUsers[0].name;

    const loginDetails = {
        username: username,
        password: password
    }

    const response = await api
        .post('/api/login')
        .send(loginDetails)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, username)
    assert.strictEqual(response.body.name, name)
})

test('a user with wrong password cannot login and recieve a token', async () => {
    const loginDetails = {
        username: helper.initialUsers[0].username,
        password: 'wrong'
    }

    const response = await api
        .post('/api/login')
        .send(loginDetails)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('invalid username or password'))

})





after(async () => {
    await mongoose.connection.close()
})