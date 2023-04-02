const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../src/app')
//const User = require('../models/user')
//const Blog = require('../models/bloglist')
const api = supertest(app)
//const initialUsers = require('./testData')
//const initialBlogs = require('./testData')

// Initialise both User and Blog databases once only
beforeAll(async () => {
  await helper.resetDB()
})

describe('User Failure tests', () => {

  const shortUserName = {
    username: 'ab',
    name: 'Any Name, and length',
    password: 'min3characters'
  }
  const errtxt = 'User validation failed: username: Path `username` (`' +
                 shortUserName.username +
                 '`) is shorter than the minimum allowed length (3).'

  const noUserName = {
    name: 'Any Name, and length',
    password: 'min3characters'
  }

  const shortPassword = {
    username: 'morethan3',
    name: 'Any Name, and length',
    password: 'xx'
  }

  const noPassword = {
    username: 'morethan3',
    name: 'Any Name, and length'
  }

  test('short user name fails with "' + errtxt + '"', async () => {
    const oldusers = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(shortUserName)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const message = JSON.parse(response.text)
    expect(message.error).toBe(errtxt)
    const newusers = await helper.usersInDb()
    expect(newusers).toHaveLength(oldusers.length)
  })

  test('missing user name fails with "User validation failed: username: Path `username` is required."', async () => {
    const oldusers = await helper.usersInDb()
    const response = await api
      .post('/api/users')
      .send(noUserName)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const message = JSON.parse(response.text)
    //console.log('missing name:', message.error)
    expect(message.error).toBe('User validation failed: username: Path `username` is required.')
    const newusers = await helper.usersInDb()
    expect(newusers).toHaveLength(oldusers.length)
  })

  test('short password fails with "password must be at least 3 characters long"', async () => {
    const oldusers = await helper.usersInDb()
    const response = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const message = JSON.parse(response.text)
    expect(message.error).toBe('password must be at least 3 characters long')
    const newusers = await helper.usersInDb()
    expect(newusers).toHaveLength(oldusers.length)
  })

  test('missing password fails with "password must be entered"', async () => {
    const oldusers = await helper.usersInDb()
    const response = await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const message = JSON.parse(response.text)
    //console.log('missing password:', message.error)
    expect(message.error).toBe('password must be entered')
    const newusers = await helper.usersInDb()
    expect(newusers).toHaveLength(oldusers.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
