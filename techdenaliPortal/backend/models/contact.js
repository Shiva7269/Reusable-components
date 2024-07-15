const mongoose = require('mongoose');

// Define the Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
}, {
 
});

// Create and export the Contact model
const Contact = mongoose.model('Contact-us', contactSchema);

module.exports = Contact;