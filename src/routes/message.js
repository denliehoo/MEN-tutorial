import { v4 as uuidv4 } from "uuid";
import { Router } from "express";

const router = Router();

// route would be /messages/ as per defined in src/index.js
router.get("/", async (req, res) => {
  const messages = await req.context.models.Message.find();
  return res.send(messages);
});

router.get("/:messageId", async (req, res) => {
  const message = await req.context.models.Message.findById(
    req.params.messageId
  );
  return res.send(message);
});

router.post("/", async (req, res) => {
  let message;

  //creates the message
  // extract text for the request payload; will need a middleware for this
  // can use express' built in json and urlencoded middleware
  //Note: for postman, to add body, go to Body -> Raw -> Change to JSON
  try {
    message = await req.context.models.Message.create({
      text: req.body.text,
      user: req.context.me.id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
  return res.send(message);
});

// To find out: how to update?
// router.put("/:messageId", (req, res) => {
//   const messageId = req.params.messageId;
//   let message = Object.values(req.context.models.messages).filter(
//     (m) => m.id === messageId
//   )[0];
//   if (!message) return res.send("Message not found");
//   if (message.userId !== req.context.me.id)
//     return res.send("You are not authorized");
//   const editedText = req.body.text;
//   if (!editedText) return res.send("Bad content: edited text cannot be empty");
//   req.context.models.messages[messageId].text = editedText;

//   return res.send(message);
// });

router.delete("/:messageId", async (req, res) => {
  const Message = req.context.models.Message;
  const message = await Message.findOne({ _id: req.params.messageId });

  if (message) {
    await Message.deleteOne({ _id: message._id });
  }

  return res.send(message);
});

export default router;
