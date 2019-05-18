const express = require('express');
//router imports
const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js');

const server = express();

//express
server.use(express.json());

//routers
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

//custom middleware
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} was called - logger`);
  next();
}

//global error messages

server.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Global Error!',
    err
  });
});

module.exports = server;
