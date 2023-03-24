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

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('missing url test', async () => {
    const response2 = await api
      .post('/api/blogs')
      .send(blog2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Blog list expansions step1', () => {
  test('single delete succeedes with status code 204 if it is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0] // delete the first note

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
  })
})

describe('Blog list expansions step2', () => {
  test('update a single post, one field', async () => {
    const initialBlogs = await helper.blogsInDb()
    const idToUpdate = initialBlogs[0].id                  // update the first note
    const blogChange = {author: 'updated entry'}           // change just the title
    const updatedBlog = {                                  // this is what the blog should look like
      title: initialBlogs[0].title,
      author: blogChange.author,
      url: initialBlogs[0].url,
      likes: initialBlogs[0].likes
    }
    
    await api
      .post(`/api/blogs/${idToUpdate}`)
      .send(blogChange)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const NewBlog = blogsAtEnd
      .filter(b => b.id === idToUpdate)
      .map(b => {
        const {id, ...x} = b
        return x})
    expect(NewBlog).toContainEqual(updatedBlog)
  })

  test('update a single post to likes=0 (falsy value)', async () => {
    const initialBlogs = await helper.blogsInDb()
    const idToUpdate = initialBlogs[0].id                  // update the first note
    const blogChange = {likes: 0}                          // change just the likes
    const updatedBlog = {                                  // this is what the blog should look like
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: blogChange.likes
    }
    //console.log('from,', initialBlogs[0], 'to', updatedBlog)
      
    await api
      .post(`/api/blogs/${idToUpdate}`)
      .send(blogChange)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const NewBlog = blogsAtEnd
      .filter(b => b.id === idToUpdate)
      .map(b => {
        const {id, ...x} = b
        return x})
    expect(NewBlog).toContainEqual(updatedBlog)
  })
  
  test('update a single post, all fields', async () => {
    const initialBlogs = await helper.blogsInDb()
    const idToUpdate = initialBlogs[0].id // update the first note
    const updatedBlog = {
      title: 'updated entry',
      author: 'Updated Name',
      url: 'https://updatedurl.com/',
      likes: 99
    }
    await api
      .post(`/api/blogs/${idToUpdate}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const NewBlog = blogsAtEnd
      .filter(b => b.id === idToUpdate)
      .map(b => {
        const {id, ...x} = b
        return x})
    expect(NewBlog).toContainEqual(updatedBlog)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})