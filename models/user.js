const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

var allUsers = ['takenUsername'];

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true }
});

// function usernameList(name) {
//   var checker = allUsers.length;
//   for (let i = 0; i < allUsers.length; i++) {
//     if (allUsers[i] !== name) {
//       checker --;
//     } else {
//       return false; //Username has been detected in the database already, (taken)
//     }
//   }
//   if (checker === 0) {
//     allUsers.push(name);
//     return true;
//   }
// }


UserSchema.pre('save', function(next) {
  let user = this;
  // maybe check if user name has been used here...
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) return next(err);
      //console.log('New username added: ' + user.username + ' From full list: ' + allUsers)
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function(username, password, next) {
  console.log("Testing")
  User.findOne({ username })
    .exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        var err = new Error('User not Found');
        err.status = 401;
        return next(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return next(null, user);
          console.log('Authenticated!');
        } else {
          return next();
        }
      });
    });
}


const User = mongoose.model('User', UserSchema);
module.exports = User;
