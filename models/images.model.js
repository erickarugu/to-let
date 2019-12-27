const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const ImageSchema = new Schema({
  _id: ObjectId,
  data: Buffer,
  contentType: String
});

module.exports = mongoose.model('images', ImageSchema);
