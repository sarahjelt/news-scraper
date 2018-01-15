var mongoose = require("mongoose");

// save ref to schema constructor
var Schema = mongoose.Schema;

// using Schema constructor, create new UserSchema obj
var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// creates model from above schema
var Article = mongoose.model("Article", ArticleSchema);

// export
module.exports = Article;