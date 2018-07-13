const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentCommentSchema = new Schema({
  body: { type: String, required: true }
});

module.exports = mongoose.model('CommentComment', CommentCommentSchema);
