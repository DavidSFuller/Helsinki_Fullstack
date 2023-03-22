const blogRouter = require('express').Router()
const Blog = require('../models/bloglist')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
  const result = await Blog(request.body).save()
  response.status(201).json(result)
})
  
module.exports = blogRouter