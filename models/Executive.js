const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExecutiveSchema = new Schema({
  title: {
    type: String,
    enum: [
      'Architect',
      'Dr',
      'Engineer',
      'Honourable',
      'Mr',
      'Mrs',
      'Prince',
      'Princess',
      'Professor',
    ],
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    // unique: true,
    // trim: true,
    maxlength: [50, 'Name can not be more than 50 characters'],
  },
  portfolio: {
    type: String,
    required: [true, 'Please add a portfolio'],
    maxlength: [100, 'Portfolio can not be more than 100 characters'],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid email',
    ],
  },
  contact: {
    type: String,
    maxlength: [20, 'Contact can not be longer than 20 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Executive', ExecutiveSchema);
