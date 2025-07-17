const DonateModel = require('../donate/donateModel');
const Notification = require('../notification/notificationModel');

// GET /api/dashboard/stats?uid=xyz
exports.getDashboardStats = async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ message: 'Missing user UID' });
  }

  try {
    // 1. Books Added
    const booksAddedCount = await DonateModel.countDocuments({ donorId: uid });

    // 2. Books Donated (Accepted Requests)
    const booksDonatedCount = await Notification.countDocuments({
      donorId: uid,
      status: 'accepted',
      type: 'request'
    });

    res.json({
      booksAdded: booksAddedCount,
      booksDonated: booksDonatedCount
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
