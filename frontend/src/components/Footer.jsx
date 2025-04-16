// FooterSection.jsx
import React from "react";

export default function FooterSection() {
  return (
    <footer className="bg-sky-50 text-gray-800 px-8 py-12">
      {/* Top Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-sky-700 font-semibold mb-3">Book Resources</h3>
          <p>Donate Old Books</p>
          <p>Request Textbooks</p>
          <p>Free Study Guides</p>
          <p>Book Exchange</p>
        </div>
        <div>
          <h3 className="text-sky-700 font-semibold mb-3">Community</h3>
          <p>Volunteer Opportunities</p>
          <p>Partner With Us</p>
          <p>Community Stories</p>
          <p>Events & Drives</p>
        </div>
        <div>
          <h3 className="text-sky-700 font-semibold mb-3">Support</h3>
          <p>FAQs</p>
          <p>Contact Support</p>
          <p>Help Center</p>
          <p>Track Donations</p>
        </div>
        <div>
          <h3 className="text-sky-700 font-semibold mb-3">Legal</h3>
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
          <p>Donation Guidelines</p>
          <p>Accessibility</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-xs text-gray-600">
        <p>&copy; 2025 Bookbridge. All rights reserved.</p>
        <p>Empowering education through book donations, one book at a time.</p>
      </div>
    </footer>
  );
}
