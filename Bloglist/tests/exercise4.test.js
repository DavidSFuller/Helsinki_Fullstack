const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../src/app')
const Blog = require('../models/bloglist')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Blog list tests step1', () => {
  test('entries are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test(helper.initialBlogs.length+' blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Blog list tests step2', () => {
  test('database has an id property', async () => {
    const blogs = await helper.blogsInDb()
    const id = blogs[0].id
    //console.log('id is',id)
    expect(id).toBeDefined()
  })
})

describe('Blog list tests step3', () => {
  const blog = {
    title: 'new test entry',
    author: 'Michael Cain',
    url: 'https://reactpatterns.com/',
    likes: 7
  }

  test('posted entries are saved to the database', async () => {
    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const NewBlog = blogsAtEnd
      .filter(b => b.id === response.body.id)
      .map(b => {
        const {id, ...x} = b
        return x})
    expect(NewBlog).toContainEqual(blog)
  })
})

describe('Blog list tests step4', () => {
  const blog = {
    title: 'no likes test',
    author: 'Charles Chaplin',
    url: 'https://reactpatterns.com/'
  }

  test('missing likes gets zero value', async () => {
    const response1 = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response2 = await api
      .get(`/api/blogs/${response1.body.id}`)
      .expect(200)

    expect(response2.body.likes).toEqual(0)
  })
})

describe('Blog list tests step5', () => {
  const blog1 = {
    author: 'missing title',
    url: 'https://reactpatterns.com/',
    likes: 1
  }

  const blog2 = {
    title: 'missing url',
    author: 'Michael Cain',
    likes: 2
  }

  test('missing title test', async () => {
    const response1 = await api
      .post('/api/blogs')
      .send(blog1)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('missing url test', async () => {
    const response2 = await api
      .post('/api/blogs')
      .send(blog2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})