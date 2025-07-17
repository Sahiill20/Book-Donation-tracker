import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState({ id: null, type: null });



  const fetchNotifications = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?._id;
      if (!userId) {
        console.error("No user ID found in localStorage");
        return;
      }

      // 1️⃣ Fetch donor-side notifications
      const donorRes = await axios.get(`http://localhost:3000/api/notifications?donorId=${userId}`);
      const donorNotifications = await Promise.all(donorRes.data.map(async (notif) => {
        const bookRes = await axios.get(`http://localhost:3000/api/books/books/${notif.bookId}`);
        const requesterRes = await axios.get(`http://localhost:3000/api/users/register/${notif.requesterId}`);
        return {
          ...notif,
          bookTitle: bookRes.data?.title || "Unknown Book",
          requesterName: requesterRes.data?.fullName || "Unknown User",
          requesterEmail: requesterRes.data?.email || "Unknown Email",
          role: "donor",
        };
      }));

      // 2️⃣ Fetch requester-side confirmation notifications
      const requesterRes = await axios.get(`http://localhost:3000/api/notifications/requester/${userId}`);
      const requesterNotifications = await Promise.all(requesterRes.data.map(async (notif) => {
        let bookTitle = "Unknown Book";

        try {
          const bookRes = await axios.get(`http://localhost:3000/api/books/books/${notif.bookId}`);
          bookTitle = bookRes.data?.title || "Unknown Book";
        } catch (err) {
          console.warn("📕 Book deleted, using fallback map");

          const fallbackMap = JSON.parse(localStorage.getItem("acceptedBooks") || "{}");
          if (fallbackMap[notif.bookId]) {
            bookTitle = fallbackMap[notif.bookId].title;
          }
        }

        return {
          ...notif,
          bookTitle,
          role: "requester",
        };
      }));

      // Combine all notifications
      const all = [...donorNotifications, ...requesterNotifications];
      setNotifications(all);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAction = async (notificationId, action) => {
    try {
      setProcessingAction({ id: notificationId, type: action }); // Start loading for that ID

      const originalNotif = notifications.find(n => n._id === notificationId);

      if (action === "accepted" && originalNotif) {
        // ✅ Save accepted book with timestamp
        let acceptedBooks = JSON.parse(localStorage.getItem("acceptedBooks") || "{}");
        acceptedBooks[originalNotif.bookId] = {
          title: originalNotif.bookTitle,
          timestamp: new Date().toISOString(),
        };

        // ✅ Limit to 10 entries
        const entries = Object.entries(acceptedBooks)
          .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
        const limited = entries.slice(0, 10);
        const limitedBooks = Object.fromEntries(limited);
        localStorage.setItem("acceptedBooks", JSON.stringify(limitedBooks));
      }

      // ✅ Update backend
      await axios.patch(`http://localhost:3000/api/notifications/${notificationId}`, {
        status: action,
      });

      if (action === "accepted" && originalNotif) {
        await axios.post("http://localhost:3000/api/notifications", {
          donorId: originalNotif.donorId,
          requesterId: originalNotif.requesterId,
          bookId: originalNotif.bookId,
          type: "confirmation",
          status: "confirmed",
        });
      }

      // ✅ Optimistically update UI
      setNotifications(prev => prev.filter(n => n._id !== notificationId));

    } catch (err) {
      console.error("Error in handleAction:", err);
    }finally {
    setProcessingAction({ id: null, type: null });
  }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg animate-pulse">Loading notifications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-sky-700">Your Notifications 📢</h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No new requests 📚✨</div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center"
              >
                {notif.role === "donor" ? (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{notif.bookTitle}</h2>
                      <p className="text-sm text-gray-500">
                        Requested by: {notif.requesterName} ({notif.requesterEmail})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm disabled:opacity-50"
                      disabled={processingAction.id === notif._id}
                      onClick={() => handleAction(notif._id, "accepted")}
                    >
                      {processingAction.id === notif._id && processingAction.type === "accepted" ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm disabled:opacity-50"
                      disabled={processingAction.id === notif._id}
                      onClick={() => handleAction(notif._id, "declined")}
                    >
                      {processingAction.id === notif._id && processingAction.type === "declined" ? "Declining..." : "Decline"}
                    </button>

                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Your request for "{notif.bookTitle}" has been accepted! 🎉
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Donor confirmed your request.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Confirmed on: {new Date(notif.updatedAt || notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
