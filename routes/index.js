const express = require('express');
const User = require('../models/user');
const Room = require('../models/room');
const Post = require('../models/post');
const auth = require('./helpers/auth');


const router = express.Router();


// set layout variables
router.use(function(req, res, next) {
  res.locals.title = "MakeReddit";
  res.locals.currentUserId = req.session.userId;

  next();
});

// home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('rooms/:id/posts/edit', (req, res, next) => {
//   res.render('edit');
// });

router.get('/users/new/taken', auth.requireLogin, (req, res, next) => {
  res.render('registerbad');
});

router.get('/insertimage', auth.requireLogin, (req, res, next) => {
  res.render('image');
});

router.get('/users/new/format', auth.requireLogin, (req, res, next) => {
  res.render('formatPassword');
});

router.get('/users/new/confirm', auth.requireLogin, (req, res, next) => {
  res.render('unconfirmed');
});


// login
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/posts', (req, res, next) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    Post.find({ Room }).sort({ points: -1 }).populate('comments').exec(function (err, posts) {
      if (err) { console.error(err); }

      res.render('posts', { room: Room, posts, roomId: req.params.id });
    });
  });
});

router.get('/postssearch', (req, res, next) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    Post.find({ Room }).populate('comments').exec(function (err, posts) {
      if (err) { console.error(err); }

      res.render('postsindex', { room: Room, posts, roomId: req.params.id });
    });
  });
});

router.get('/login/fail', (req, res, next) => {
  res.render('loginrep');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = 1 //new Error("Username or password incorrect");
      next_error.status = 401;
      return res.redirect('/login/fail') ;

      return next(next_error);
    } else {
      req.session.userId = user._id;

      return res.redirect('/posts') ;
    }
  });
});

//logout

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }
  return res.redirect('/login');
});

module.exports = router;
