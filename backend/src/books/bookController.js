// books/bookController.js
const DonateModel = require('../donate/donateModel');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await DonateModel.find(req.query.email ? { email: req.query.email } : {});
        res.json(books);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.message });
      }
};
