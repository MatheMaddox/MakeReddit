const express = require('express');
const User = require('../models/user');
const auth = require('./helpers/auth');

const router = express.Router();


// Users index

router.get('/', auth.requireLogin, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.error(err);
    } else {
      res.render('users/index', { users });
    }
  });
});

// Users new

router.get('/new', (req, res) => {
  res.render('users/new');
});

// Users create

router.post('/', (req, res) => {
  const user = new User(req.body);
  var letterNumber = /^[0-9a-zA-Z]+$/;

  if (user.password.length > 5) {
    if (user.password === user.confirmPassword) {
      console.log('Password is confirmed!');
    // search the DB for a this user name
    // if exists exit with error message
      const username = user.username;
      User.find({ username }).then((users) => {
        if (users.length === 0) {
          user.save((err, user) => { // eslint-disable-line no-unused-vars
            if (err) console.log(err);
            return res.redirect('/users');
          });
        } else {
          console.log('Username is taken!!!');
          return res.redirect('/users/new/taken');
        }
      }).catch((err) => {
        console.log(err.message);
      });
    } else {
      console.log('Passwords do not match!');
      return res.redirect('/users/new/confirm');
    }
  } else {
    console.log('Invalid username or password format');
    return res.redirect('/users/new/format');
  }
});

module.exports = router;
