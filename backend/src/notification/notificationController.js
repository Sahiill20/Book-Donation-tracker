const Notification = require('../notification/notificationModel');
const DonateModel = require('../donate/donateModel');
const User = require('../users/userModel');
const sendEmail = require('../mails/mailController');



// 1. Pure function (no req, res)
async function createNotification({ bookId, requesterId, donorId, type = 'request', status = 'pending' }) {
  
  const notification = await Notification.create({
    donorId,
    requesterId,
    bookId,
    type,
    status,
  });

  // ✅ Send email ONLY for 'request' type
  if (type === 'request') {
    const book = await DonateModel.findById(bookId);
    const donor = await User.findOne({ uid: donorId });
    const requester = await User.findOne({ uid: requesterId });

    if (book && donor && requester) {
      await sendEmail({
        to: donor.email,
        subject: `New Book Request: ${book.title}`,
        text: `${requester.fullName} has requested your book "${book.title}". Please log in to accept or decline the request.`,
        html: `<p><b>${requester.fullName}</b> has requested your book "<b>${book.title}</b>".</p>
               <p>Please log in to the <a href="http://localhost:5173">Book Donation platform</a> to accept or decline.</p>`,
      });
    } else {
      console.warn("Missing data to send email: book, donor, or requester not found.");
    }
  }

  return notification;
}


// 2. API Route Handler
exports.createNotificationHandler = async (req, res) => {
  try {
    const { bookId, requesterId, donorId, type = "request", status = "pending" } = req.body;

    // Create notification entry
    const notification = await Notification.create({
      donorId,
      requesterId,
      bookId,
      type,
      status,
    });

    // ✅ Find book by ID
    
    let book = null;
if (type === "request") {
  book = await DonateModel.findById(bookId);
  const donor = await User.findOne({ uid: donorId });
  const requester = await User.findOne({ uid: requesterId });

  if (!book || !donor || !requester) {
        return res.status(404).json({ error: "Book, donor, or requester not found" });
      }

    // ✅ Send email to donor
    await sendEmail({
      to: donor.email,
      subject: `New Book Request: ${book.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="text-align: center; color: #2c3e50;">📚 Book Donation Platform</h2>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 16px;"><strong>${requester.fullName}</strong> has requested your book "<strong>${book.title}</strong>".</p>
            <p style="font-size: 15px; color: #555;">Please log in to your dashboard to <strong>accept or decline</strong> this request.</p>
            <a href="http://localhost:5173/signin" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Sign In & Manage Requests</a>
            <p style="margin-top: 25px; font-size: 14px; color: #333;">You can also contact the requester at: <a href="mailto:${requester.email}">${requester.email}</a></p>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">Thank you for sharing books and helping the community.</p>
          </div>
        </div>
      `,
    });
  }

    res.status(201).json(notification);  // ✅ Send response
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}; // ✅ this was missing!




// 3. Get pending notifications
exports.getDonorNotifications = async (req, res) => {
  try {
    const donorId = req.query.donorId;
    const notifications = await Notification.find({ donorId: donorId, status: 'pending', type: 'request' });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update notification status
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // ✅ Only trigger confirmation logic on accept
    if (status === 'accepted') {
      const book = await DonateModel.findById(updated.bookId);
      console.log("Deleting book with ID:", updated.bookId);
      if (book) {
        await DonateModel.findByIdAndUpdate(updated.bookId, { status: "donated" });
      }
      const requester = await User.findOne({ uid: updated.requesterId });

      if (book && requester) {
        await sendEmail({
          to: requester.email,
          subject: `Your Request for "${book.title}" was Accepted`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                <h2 style="text-align: center; color: #2c3e50;">✅ Request Accepted!</h2>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 16px;">Your request for the book <strong>"${book.title}"</strong> has been accepted by the donor.</p>
                <p style="font-size: 15px;">You can now contact the donor at: <a href="mailto:${book.email}">${book.email}</a></p>
                <p style="margin-top: 25px; font-size: 14px; color: #333;">Please coordinate with the donor for collection based on your location.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #999;">Thank you for using the Book Donation platform.</p>
              </div>
            </div>
          `,
        });
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getRequesterNotifications = async (req, res) => {
  try {
    const { requesterId } = req.params;
    const notifications = await Notification.find({
      requesterId,
      type: "confirmation", 
      status: "confirmed" // or other filters
    }).sort({ timestamp: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: /api/notifications/request-counts?donorId=...
exports.getRequestCounts = async (req, res) => {
  try {
    const { donorId } = req.query;

    if (!donorId) return res.status(400).json({ message: 'Missing donorId' });

    const pending = await Notification.countDocuments({ donorId, status: 'pending', type: 'request' });
    const approved = await Notification.countDocuments({ donorId, status: 'accepted', type: 'request' });

    res.status(200).json({
      pendingRequests: pending,
      approvedRequests: approved,
    });
  } catch (err) {
    console.error("Failed to fetch request counts:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.createNotification = createNotification;