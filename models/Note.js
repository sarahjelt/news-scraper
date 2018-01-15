var mongoose = require("mongoose");

// save ref to schema constructor
var Schema = mongoose.Schema;

// using Schema constructor, create new UserSchema obj
var NoteSchema = new Schema({
  title: String,
  body: String
});

// creates model from above schema
var Note = mongoose.model("Note", NoteSchema);

// export
module.exports = Note;