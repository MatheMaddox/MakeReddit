const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const posts = require('./posts');
const Post = require('../models/post');
const User = require('../models/user');

const router = express.Router();


// rooms index

router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms });
    }
  });
});

// rooms new

router.get('/new', auth.requireLogin, (req, res) => {
  res.render('rooms/new');
});

// rooms show

router.get('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    // eslint-disable-next-line no-shadow
    Post.find({ room }).sort({ points: -1 }).populate('comments').exec((err, posts) => {
      if (err) { console.error(err); }

      res.render('rooms/show', { room, posts, roomId: req.params.id });
    });
  });
});

// rooms edit

router.get('/:id/edit', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id).then((room) => {

    res.render('rooms/edit', { room });

  }).catch((err) => {

    console.error(err);

  });
});



// rooms update

router.post('/:id', auth.requireLogin, (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body).then((room) => {

    res.redirect(`/rooms/${req.params.id}`);

  }).catch((err) => {

    console.error(err);

  });
});

// rooms create

router.post('/', auth.requireLogin, (req, res) => {
  const room = new Room(req.body);

  // eslint-disable-next-line no-shadow
  room.save((err, room) => { // eslint-disable-line no-unused-vars
    if (err) { console.error(err); }

    return res.redirect('/rooms');
  });
});


router.use('/:roomId/posts', posts);

module.exports = router;
