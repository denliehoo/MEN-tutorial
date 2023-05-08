// https://www.robinwieruch.de/mongodb-express-node-rest-api/
// ^ part 5 of 5 of tutorial; need do from 1-5
require('dotenv').config()
const cors = require('cors')
const express = require('express')
import models from './models'
import routes from './routes'

const app = express()
const port = process.env.PORT

// middlewares
app.use(cors()) // use the cors middleware as an application-wide middleware by using express' use method
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// custom middlewares
app.use((req, res, next) => {
  // simulate that user id: 1 is the logged in authenticated user
  // hence, we have the "me" property to the req object and assign it to user 1
  // Then, we will be able to access the .me property from req to get user id
  req.context = {
    models, // place the models in req.context
    me: models.users[1],
  }
  next()
})

// routes
app.use('/session', routes.session)
app.use('/users', routes.user)
app.use('/messages', routes.message)

// '/' routes
// app.get('/', (req, res) => {
//   return res.send('Received a GET HTTP method')
// })

// app.post('/', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })

// app.put('/', (req, res) => {
//   return res.send('Received a PUT HTTP method')
// })

// app.delete('/', (req, res) => {
//   return res.send('Received a DELETE HTTP method')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
