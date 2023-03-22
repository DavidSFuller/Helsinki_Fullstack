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

  test('posted entries are saved to the datbase', async () => {
    const newid = await helper.addBlog(blog)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const NewBlog = blogsAtEnd
      .filter(b => b.id === newid)
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
    const newid = await helper.addBlog(blog)
    const uri = '/api/blogs/'+newid
    console.log('uri',uri)
    const response = await api.get(uri)
    console.log('response.body', response.body)
    expect(response.body.likes).toEqual(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})