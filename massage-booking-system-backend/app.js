const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const masseussesRouter = require('./controllers/masseusses')
const appointmentsRouter = require('./controllers/appointments')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(morgan('dev'))
app.use('/api/masseusses', masseussesRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('build'))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app