//const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('../utils/config')
const blogRouter = require('../controllers/bloglist')
const usersRouter = require('../controllers/users')
const loginRouter = require('../controllers/login')
const middleware = require('../utils/middleware')
const logger = require('../utils/logger')
const morgan = require('morgan')
const mongoose = require('mongoose')
//const Blog = require('../models/bloglist')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: function (req, res) { return req.method !== 'POST' }
}))

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app