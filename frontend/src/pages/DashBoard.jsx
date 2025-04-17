import React, { useState, useEffect } from 'react';
import { FaChartBar, FaRegCalendarAlt, FaSignOutAlt, FaCog, FaEnvelope, FaComments, FaBook, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 15, 2025",
    location: "New York, NY"
  });
  
  const [stats, setStats] = useState({
    donatedBooks: 23,
    pendingDonations: 3,
    approvedRequests: 5,
    pendingRequests: 2,
    rewardsEarned: 134
  });
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'donation', book: 'To Kill a Mockingbird', status: 'Donated', date: '2025-04-10' },
    { id: 2, type: 'request', book: 'The Great Gatsby', status: 'Approved', date: '2025-04-08' },
    { id: 3, type: 'donation', book: '1984', status: 'Pending', date: '2025-04-05' }
  ]);
  
  const donationCategories = [
    { category: 'Fiction', count: 12, percentage: 70 },
    { category: 'Educational', count: 5, percentage: 40 },
    { category: 'Children', count: 8, percentage: 55 },
    { category: 'Non-Fiction', count: 6, percentage: 45 }
  ];

  const [isEditing, setIsEditing] = useState(false);

const handleEditToggle = () => {
  if (isEditing) {
    // Save logic goes here
    console.log("Saving user info:", userData);
    // You can call a backend API here to update user info
  }
  setIsEditing(!isEditing);
};


  return (
    <div className="flex h-screen bg-gray-100 ">
      {/* Left Sidebar */}
      <div className="w-64 bg-sky-200 text-gray-300 flex flex-col mt-6 ml-5 mb-7 rounded-lg px-2 py-1">      
        <div className="p-6 border-b border-white text-white">
  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
    {userData.name.split(' ').map(n => n[0]).join('')}
  </div>

  {/* Editable Form */}
  <div className='mb-6'>
    <div className="mb-6">
      <label className="block text-sm text-black">Full Name</label>
      <input
        type="text"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        disabled={!isEditing}
        className="w-full bg-sky-300 text-gray-800  rounded px-2 py-1 text-sm focus:outline-none focus:ring"
      />
    </div>
    <div className="mb-6">
      <label className="block text-sm text-black">Email</label>
      <input
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        disabled={!isEditing}
        className="w-full bg-sky-300 text-gray-800  rounded px-2 py-1 text-sm focus:outline-none focus:ring"
      />
    </div>
    <div className="mb-6">
      <label className="block text-sm text-black">Phone Number</label>
      <input
        type="text"
        value={userData.phone || ''}
        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
        disabled={!isEditing}
        className="w-full bg-sky-300 text-gray-800  rounded px-2 py-1 text-sm focus:outline-none focus:ring"
      />
    </div>
    <div className="mb-6">
      <label className="block text-sm text-black">Address</label>
      <input
        type="text"
        value={userData.address || ''}
        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
        disabled={!isEditing}
        className="w-full bg-sky-300 text-gray-800  rounded px-2 py-1 text-sm focus:outline-none focus:ring"
      />
    </div>
    <button
      onClick={handleEditToggle}
      className="mt-2 bg-blue-600 hover:bg-blue-700 w-full py-1 rounded text-sm"
    >
      {isEditing ? 'Save' : 'Edit'}
    </button>
  </div>
</div>

        
        <div className="p-4">
          <button className="w-full bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center">
            <FaSignOutAlt className="mr-2" /> LOGOUT
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Donation Stats */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${stats.donatedBooks * 4}, 100`}
                />
                <text x="18" y="20.5" className="text-5xl font-semibold" textAnchor="middle" fill="#374151">
                  {stats.donatedBooks}
                </text>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Books Donated</h3>
            <p className="text-gray-500">Pending: {stats.pendingDonations}</p>
          </div>
          
          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-center font-semibold mb-4">NOVEMBER 2025</h3>
            <div className="grid grid-cols-7 gap-1">
              <div className="text-center font-medium text-gray-500">S</div>
              <div className="text-center font-medium text-gray-500">M</div>
              <div className="text-center font-medium text-gray-500">T</div>
              <div className="text-center font-medium text-gray-500">W</div>
              <div className="text-center font-medium text-gray-500">T</div>
              <div className="text-center font-medium text-gray-500">F</div>
              <div className="text-center font-medium text-gray-500">S</div>
              
              <div className="text-center p-2">1</div>
              <div className="text-center p-2">2</div>
              <div className="text-center p-2">3</div>
              <div className="text-center p-2 bg-blue-500 text-white rounded-full">4</div>
              <div className="text-center p-2">5</div>
              <div className="text-center p-2">6</div>
              <div className="text-center p-2">7</div>
              {/* More days would be added here */}
            </div>
          </div>
          
          {/* Request Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Book Requests</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{stats.approvedRequests}</div>
                <p className="text-gray-500 text-sm">Approved</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.pendingRequests}</div>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
          </div>
          
          {/* Rewards */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold mb-4">Rewards Earned</h3>
            <div className="relative w-32 h-32 mx-auto mb-2">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="89, 100"
                />
                <text x="18" y="20.5" className="text-5xl font-semibold" textAnchor="middle" fill="#374151">
                  {stats.rewardsEarned}
                </text>
              </svg>
            </div>
            <p className="text-gray-500">Next reward at 150 points</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(stats.rewardsEarned/150)*100}%` }}
              ></div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;