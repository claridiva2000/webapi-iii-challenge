const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.use((req, res, next) => {
  console.log('User Router working');
  next();
});

// add user
router.post('/', async (req, res) => {
  try {
    const user = await Users.insert(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error adding User'
    });
  }
});

//add post to user
router.post('/:id/posts', async (req, res) => {
  const postInfo = { ...req.body, post_id: req.params.id };
  try {
    const post = await Posts.insert(postInfo);
    res.status(210).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error getting the posts for the User'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await Users.get(req.body);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error retrieving the Users'
    });
  }
});

//get user by id
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

//find user's posts by user id
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error getting the posts for the User'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const count = await Users.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'The User has been removed' });
    } else {
      res.status(404).json({ message: 'The User could not be found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error removing the User'
    });
  }
});
 
router.put('/:id', async (req, res) => {
  try {
    const user = await Users.update(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'The User could not be found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error updating the User'
    });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Users.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({ message: 'invalid user id' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request' });
  }
}

async function validateUser(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    next();
  } else {
    next({ message: 'missing user data' });
  }
}

function validatePost(req, res, next) {
  if (req.body && Object.keys(req.body.posts).length) {
    next();
  } else {
    next({ message: 'Please enter post data' });
  }
}

module.exports = router;
