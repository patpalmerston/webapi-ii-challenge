const express = require('express');
const db = require('./db');
const router = express.Router();

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
}

router.get('/', async (req, res) => {
  // console.log(req.route)
  try {
    const posts = await db.find(req.query);
    res.status(200).json(posts)
    } catch (err) {sendUserError(500, "The post with the specified ID does not exist.", err)}
})

router.get('/:id', async (req, res) => {
  try{
  const post = await db.findById(req.params.id);

  
    if (post) {
        res.status(200).json({post})
      } else {
        res.status(404).json({ error: "The post information could not be retrieved." })
      }
  } catch (err) {sendUserError(500, "The post information could not be retrieved.", err )}
  })

// router.post('/', (req, res) => {
//   const { title, contents } = req.body;
//   if (!title || !contents) {
//     sendUserError(400, "Please provide title and contents for the post.", res);
//     return;
//   }
//   db.insert({
//     title,
//     contents
//   })
//   .then(post => {
//     res.status(201).json({success: true, post})
//   })
//   .catch(err => {sendUserError(500, "There was an error while saving the post to the database", err)})
// });

router.post("/", async (req, res) => {
  const post = req.body;
  if (post.title && post.contents) {
    db.insert(post)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(500).json({
          message: "Error retrieving the posts"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "There was an error while saving the post to the database."
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removePost = await db.remove(req.params.id);
    if (removePost > 0) {
      res.status(200).json({ message: "Deleted"  })
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch (err) {sendUserError(500, "The post could not be removed", err )}
})

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    sendUserError(400, 'Must provide title and contents', res);
    return;
  }
  db
    .update(id, { title, contents })
    .then(response => {
      if (response == 0) {
        sendUserError(
          404,
          'The user with the specified ID does not exist.',
          res
        );
        return;
      }
      db
        .findById(id)
        .then(post => {
          if (post.length === 0) {
            sendUserError(404, 'User with that id not found', res);
            return;
          }
          res.json(post);
        })
        .catch(error => {
          sendUserError(500, 'Error looking up user', res);
        });
    })
    .catch(error => {
      sendUserError(500, 'Something bad happened in the database', res);
      return;
    });
});



module.exports = router;