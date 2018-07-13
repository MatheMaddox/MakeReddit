const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const commentsRouter = require('./comments');

const router = express.Router({ mergeParams: true });


router.get('/new', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    if (err) { console.error(err); }

    res.render('posts/new', { room });
  });
});

router.post('/', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    if (err) { console.error(err); }

    const post = new Post(req.body);
    post.room = room;

    post.save((err, post) => { // eslint-disable-line
      if (err) { console.error(err); }

      return res.redirect(`/rooms/${room._id}`); // eslint-disable-line no-underscore-dangle
    });
  });
});

router.post('/:id', auth.requireLogin, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    post.points += parseInt(req.body.points); // eslint-disable-line radix

    post.save((err, post) => {
      if(err) { console.error(err) };

      return res.redirect(`/rooms/${post.room}`);
    });
  });
});

// posts edit

// router.get('/edit', auth.requireLogin, (req, res) => {
//   Room.findById(req.params.id).then((room) => {
//
//     res.render(`/rooms/${room._id}/posts/edit`, { room, post });
//
//   }).catch((err) => {
//
//     console.error(err);
//
//   });
// });
//
//
//
// // posts update
//
// router.post('/', auth.requireLogin, (req, res) => {
//   Room.findByIdAndUpdate(req.params.id, req.body).then((room) => {
//
//     res.redirect(`/rooms/${room._id}/posts`);
//
//   }).catch((err) => {
//
//     console.error(err);
//
//   });
// });

router.use('/:postId/comments', commentsRouter);

module.exports = router;
