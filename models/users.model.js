import { isEmail } from 'validator';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const uniqueValidator = require('mongoose-unique-validator'); // to add a unique validation to the email and username

const saltrounds = 10;
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

// users schema
const UserSchema = new Schema({
  username: {
    _id: ObjectId,
    type: 'string',
    lowercase: true,
    unique: true,
    required: [true, 'Username can\'t be blank'],
    match: [/^[a-zA-Z0-9]+$/, 'Invalid username']
  },
  contact: {
    first_name: { type: String, match: [/^[a-zA-Z]/, 'Invalid username'], required: [true, 'first name is required'] },
    last_name: { type: String, required: [true, 'first name is required'] },
    email: {
      validate: {
        validator: isEmail,
        message: 'Invalid Email'
      },
      unique: true,
      required: [true, 'User email is required']
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => /\d{10}/.test(v),
        message: (props) => `${props.value} is not a valid phone number`
      },
      required: [true, 'User Phone Number is required']
    }
  },
  password: { type: String, required: true },
  type: {
    tenant: Boolean,
    agent: Boolean,
    admin: Boolean
  },
  properties: [{ type: ObjectId, ref: 'property' }] // referencing properties
},

{
  timestamps: true // adds created_at and updated_at in case of changes
});

UserSchema.plugin(uniqueValidator, { message: 'Already taken' });

// A pre event for the save function
UserSchema.pre('save', (next) => {
  // check to see if user is being created or being modified
  if (!this.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(saltrounds, (err, salt) => {
    if (err) return next(err);

    //  use generated salt to hash password
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      // replace plaintext password with hash
      this.password = hash;
      return next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
