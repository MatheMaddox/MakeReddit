const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const Comment = require('../models/comment');
const CommentComment = require('../models/commentcomment');

router.post('/', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    if (err) { console.error(err); }
    console.log('Room found id');
    Post.findById(req.params.roomId, (err, room) => {
      if (err) { console.error(err); }
      console.log('Post found id');
      Comment.findById(req.params.roomId, (err, room) => {
        if (err) { console.error(err); }
        const commentcomment = new CommentComment(req.body);
        commentcomment.comment.post.room = room;
        console.log('CommentComment testing 1 2 3');
        commentcomment.save((err, post) => { // eslint-disable-line
          if (err) { console.error(err); }
          console.log('Commentcomment saved');
          return res.redirect(`/rooms/${room._id}`); // eslint-disable-line no-underscore-dangle
        });
      });
    });
  });
});



// Comments new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };

      res.render('commentscomments', { comment: comment, post: post, room: room });
    });
  });
});

router.post('/', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };

      let commentcomment = new Comment(req.body);
      post.comments.commentscomments.unshift(commentcomment);

      post.save(function(err, post) {
        if(err) { console.error(err) };

        commentcomment.save(function(err, commentcomment) {
          if(err) { console.error(err) };

          return res.redirect(`/rooms/${room.id}`);
        });
      });
    });
  });
});

module.exports = router;
