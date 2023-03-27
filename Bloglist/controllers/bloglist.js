const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  logger.info('authorization is ', authorization)

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    logger.info('token is ', token)
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
      response.json(blogs)
    }
    else {
      return response.status(401).json({ error: 'login required' })
    }
  }
  catch(error) {next(error)}
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
  catch(error) {next(error)}
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog
    .findById({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.delete('/:id', async (request, response) => {
  logger.info('request_delete',request.params.id, request.body)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const oldBlog = await Blog.findById(request.params.id)

  if (oldBlog.user !== user.id) {
    return response.status(401).json({ error: 'user cannot delete this row' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  user.blogs = user.blogs.filter(b => b !== request.params.id)
  await user.save()

  response.status(204).end()
})

blogRouter.post('/:id', async (request, response, next) => {
  const oldBlog = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (oldBlog.user !== user.id) {
    return response.status(401).json({ error: 'user cannot update this row' })
  }
  logger.info('update:', request.params.id, oldBlog)

  const blog = {
    ...(oldBlog.title && {title: oldBlog.title}),
    ...(oldBlog.author && {author: oldBlog.author}),
    ...(oldBlog.url && {url: oldBlog.url}),
    ...((oldBlog.likes || oldBlog.likes === 0) && {likes: oldBlog.likes})
  }

  //logger.info('Update to:', request.params.id ,blog)
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, blog,
      { new: true, runValidators: true, context: 'query' })
    response.json(result)
    //logger.info('result:', response)
  }
  catch(error) {
    logger.error('error:', error)
    next(error)}
})

module.exports = blogRouter