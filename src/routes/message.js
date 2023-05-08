import { v4 as uuidv4 } from 'uuid'
import { Router } from 'express'

const router = Router()

// route would be /messages/ as per defined in src/index.js
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.messages))
})

router.get('/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId])
})

router.post('/', (req, res) => {
  const id = uuidv4()
  const message = {
    //creates the message
    id,
    // extract text for the request payload; will need a middleware for this
    // can use express' built in json and urlencoded middleware
    text: req.body.text,
    userId: req.context.me.id,
  }
  //Note: for postman, to add body, go to Body -> Raw -> Change to JSON
  req.context.models.messages[id] = message // adds message to our DB

  return res.send(message)
})

router.put('/:messageId', (req, res) => {
  const messageId = req.params.messageId
  let message = Object.values(req.context.models.messages).filter(
    (m) => m.id === messageId,
  )[0]
  if (!message) return res.send('Message not found')
  if (message.userId !== req.context.me.id)
    return res.send('You are not authorized')
  const editedText = req.body.text
  if (!editedText) return res.send('Bad content: edited text cannot be empty')
  req.context.models.messages[messageId].text = editedText

  return res.send(message)
})

router.delete('/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages

  req.context.models.messages = otherMessages

  return res.send(message)
})

export default router
