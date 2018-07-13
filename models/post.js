const mongoose = require('mongoose');
const user = require('./user');

const Schema = mongoose.Schema;

var username = user.username;

const PostSchema = new Schema({
  subject: String,
  body: String,
  username: String,
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  points: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Post', PostSchema);
