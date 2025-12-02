const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  content: String,
  filePath: String,  // <--- NEW FIELD
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
