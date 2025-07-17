// books/bookController.js
const DonateModel = require('../donate/donateModel');

exports.getAllBooks = async (req, res) => {
  try {
    let filter = {};

    // Case: Personal dashboard, fetch all user books regardless of status
    if (req.query.email) {
      filter.email = req.query.email;
    } else {
      // Default: show all books that are still available
      filter.status = { $ne: 'donated' };
    }

    const books = await DonateModel.find(filter);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
};


exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId; // Get bookId from URL parameter
    const book = await DonateModel.findById(bookId); // Find book by ID
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book', error: err.message });
  }
};