const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response, next) => {
  try {
    const result = await Blog(request.body).save()
    response.status(201).json(result)
  }
  catch(error) {next(error)}
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

blogRouter.delete('/:id', async (request, response) => {
  logger.info('request_delete',request.params.id)
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.post('/:id', async (request, response, next) => {
  const {title, author, url, likes} = request.body
  logger.info('update:', request.params.id, title, author, url, likes)

  const blog = {
    ...(title && {title: title}),
    ...(author && {author: author}),
    ...(url && {url: url}),
    ...((likes || likes === 0) && {likes: likes}),
  }

  //logger.info('Update', request.params.id ,blog)
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