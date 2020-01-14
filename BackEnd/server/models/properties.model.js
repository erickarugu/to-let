
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;


const PropertySchema = new Schema({
  _id: ObjectId,
  name: { type: String, required: [true, 'property name is required'] },
  description: { type: String, required: [true, 'property description is required'] },
  address: { type: String },
  details: {
    size: String,
    rooms: Number,
    bedrooms: Number,
    bathrooms: Number
  },
  ammenities: {
    water: Boolean,
    electricity: Boolean
  },
  price: { type: String },
  images: [{ type: ObjectId, ref: 'Images' }] // referencing images

},
{
  timestamps: true // adds created_at and updated_at in case of changes
});

module.exports = mongoose.model('Property', PropertySchema);
