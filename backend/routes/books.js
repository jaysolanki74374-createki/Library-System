const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const Book = require('../models/Book');
const upload = require('../middleware/upload'); // <---- NEW

router.post("/", auth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file); // <--- IMPORTANT

    const { title, author, description, content, totalCopies } = req.body;

    const book = new Book({
      title,
      author,
      description,
      content,
      totalCopies,
      availableCopies: totalCopies,
      filePath: req.file ? "/uploads/books/" + req.file.filename : null
    });

    await book.save();
    res.json(book);

  } catch (err) {
    console.error("BOOK CREATE ERROR:", err);  // <--- SHOW REAL ERROR
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Edit book (admin)
router.put("/:id", auth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.filePath = "/uploads/books/" + req.file.filename;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete book (admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// List all books (public for readers, admin)
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Get a single book (for reading)
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Not found' });
    res.json(book);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
