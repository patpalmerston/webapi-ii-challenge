const express = require('express');
const db = require('./db');
const router = express.Router();

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
}

router.get('/', (req, res) => {
  // console.log(req.route)
  db.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {sendUserError(500, "The post with the specified ID does not exist.", err)})
})

router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(posts => {
      if (posts) {
        res.status(200).json({
          success: true,
          posts
        })
      } else {
        res.status(404).json({
          success: false,
          error: "The post information could not be retrieved."
        })
      }
    })
    .catch(err => {sendUserError(500, "The post information could not be retrieved.", err )})
  })

router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    sendUserError(400, "Please provide title and contents for the post.", res);
    return;
  }
  db.insert({
    title,
    contents
  })
  .then(post => {
    res.status(201).json({success: true, post})
  })
  .catch(err => {sendUserError(500, "There was an error while saving the post to the database", err)})
});


module.exports = router;