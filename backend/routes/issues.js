const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const User = require('../models/User');

// Issue a book (reader can request; here we allow reader to issue if copies available)
router.post('/issue/:bookId', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available' });

    const existing = await Issue.findOne({ book: book._id, user: req.user._id, returned: false });
    if (existing) return res.status(400).json({ message: 'You already have this book issued' });

    const issue = new Issue({ book: book._id, user: req.user._id });
    await issue.save();
    book.availableCopies -= 1;
    await book.save();

    res.json(issue);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Return a book (user)
router.post('/return/:issueId', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.returned) return res.status(400).json({ message: 'Already returned' });
    if (String(issue.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    issue.returned = true;
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(issue.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }
    res.json(issue);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Admin: list all issues with populate
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const issues = await Issue.find().populate('book').populate('user').sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Reader: history of their issues (past and current)
router.get('/my', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id }).populate('book').sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
