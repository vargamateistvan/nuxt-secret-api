import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

// Require API routes
const secret = require('./routes/secret')

// Create express instance
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Import API Routes
app.use(secret)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}

// Init MongoDB
mongoose.connect('mongodb://mongo:27017/secret-db?authSource=admin', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.Promise = global.Promise
const db = mongoose.connection

// MongoDB status
db.on('connecting', function () {
  console.log('connecting to MongoDB...')
})

db.on('error', function (error) {
  console.error('error in MongoDB connection: ' + error)
  mongoose.disconnect()
})

db.on('connected', function () {
  console.log('connected to MongoDB.')
})

db.once('open', function () {
  console.log('MongoDB connection is open.')
})

db.on('reconnected', function () {
  console.log('MongoDB reconnected.')
})

db.on('disconnected', function () {
  console.log('MongoDB disconnected.')
})
