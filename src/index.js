// https://www.robinwieruch.de/mongodb-express-node-rest-api/
// ^ part 5 of 5 of tutorial; need do from 1-5
require("dotenv").config();
const cors = require("cors");
const express = require("express");
import models, { connectDb } from "./models";
import routes from "./routes";

const app = express();

// middlewares
app.use(cors()); // use the cors middleware as an application-wide middleware by using express' use method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// custom middlewares
app.use(async (req, res, next) => {
  // simulate that user id: 1 is the logged in authenticated user
  // hence, we have the "me" property to the req object and assign it to user 1
  // Then, we will be able to access the .me property from req to get user id
  req.context = {
    models, // place the models in req.context
    me: await models.User.findByLogin("rwieruch"),
  };
  next();
});

// routes
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

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

const createUsersWithMessages = async () => {
  const user1 = new models.User({
    username: "rwieruch",
  });

  const user2 = new models.User({
    username: "ddavids",
  });

  const message1 = new models.Message({
    text: "Published the Road to learn React",
    user: user1.id,
  });

  const message2 = new models.Message({
    text: "Happy to release ...",
    user: user2.id,
  });

  const message3 = new models.Message({
    text: "Published a complete ...",
    user: user2.id,
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    // re-initialize DB upon restart server
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);
    createUsersWithMessages(); // seed database
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});
