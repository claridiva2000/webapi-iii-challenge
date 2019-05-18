const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.use((req, res, next) => {
  console.log('Post Router working');
  next();
});

//   /api/posts/
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get(req.query);
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'error retrieving posts'
    });
  }
});

//  /api/posts/:id
router.get('/:id', validatePostId, (req, res) => {
  //getById
  res.status(500).json(req.post);
});


router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'Post is deleted' });
    } else {
      res.status(400).json({ message: 'The post could not be found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error removing post'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Posts.update(req.params.id, req.body);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error updating post'
    });
  }
});

// custom middleware
async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;
    const post = await Posts.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      next({ message: 'post not found - validatePostId' });
    }
  } catch (err) {
    res.status(500).json({ message: 'failed to process request- postIdval' });
  }
}

module.exports = router;
