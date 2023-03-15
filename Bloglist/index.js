const app = require('./src/app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = config.PORT // was 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})