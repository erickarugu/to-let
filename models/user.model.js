const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

// schema definition
const userSchema = new Schema({
  _id: ObjectId,
  method: {
    type: [String],
  },
  local: {

    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    }
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => /\d{10}/.test(v),
      message: (props) => `${props.value} is not a valid phone number`
    }
  },
  type: {
    tenant: Boolean,
    agent: Boolean,
    admin: Boolean
  },
  properties: [{ type: ObjectId, ref: 'property' }]
});

userSchema.pre('save', async function(next) {
  try {
    // check method of registration
    if (!this.method.includes('local')) next();
    const user = this;
    if (!user.isModified('local.password')) next();
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(this.local.password, salt);
    // replace plain text password with hashed password
    this.local.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};
// define model
const User = mongoose.model('User', userSchema);

// expose model
module.exports = User;
