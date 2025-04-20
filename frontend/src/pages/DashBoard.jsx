import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';



const ProgressCircle = ({ value, color, label }) => (
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
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${value}, 100`}
      />
      <text x="18" y="20.5" className="text-5xl font-semibold" textAnchor="middle" fill="#374151">
        {label}
      </text>
    </svg>
  </div>
);

const getInitials = (name) => {
  const names = name.split(' ');
  return names
    .map((n, index) => (index < 2 ? n[0] : ''))
    .join('')
    .toUpperCase();
};

const generateCalendar = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const Dashboard = () => {
  const [userData] = useState({
    name: "",
    email: "john.doe@example.com",
    joinDate: "January 15, 2025",
    location: "New York, NY"
  });

  const [stats] = useState({
    donatedBooks: 23,
    pendingDonations: 3,
    approvedRequests: 5,
    pendingRequests: 2,
    rewardsEarned: 134
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const savedImage = localStorage.getItem('userProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await toBase64(file);
      setProfileImage(base64);
      localStorage.setItem('userProfileImage', base64);
      setImageUpdated(true);
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
      setTimeout(() => setImageUpdated(false), 1000);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) toast.success('Profile saved successfully!');
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem('userProfileImage');
    toast('Profile photo removed.', { icon: '🗑️' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Add actual logout logic here
      toast.success('Logged out successfully!');
    }
  };

  

  

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
      
      {/* Sidebar */}
      <div className="w-64 bg-sky-200 text-gray-300 flex flex-col mt-6 ml-5 mb-7 rounded-lg px-2 py-1">
        <div className="p-6 border-b border-white text-white">
          <div className={`w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 overflow-hidden relative transition-opacity duration-500 ${imageUpdated ? 'opacity-50' : 'opacity-100'}`}>
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center text-white text-sm animate-pulse">
                Uploading...
              </div>
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                {getInitials(userData.name)}
              </div>
            )}
          </div>

          <div className='mb-6'>
            {isEditing && (
              <>
                <div className="mb-3">
                  <label htmlFor="profile-photo" className="bg-white text-blue-700 px-3 py-1 rounded shadow cursor-pointer text-sm hover:bg-blue-100 transition-colors">
                    Choose Photo
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {profileImage && (
                  <button
                    onClick={handleRemovePhoto}
                    className="text-red-600 text-sm mt-1 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm text-black">Full Name</label>
              <input
                type="text"
                value={userData.name}
                readOnly={!isEditing}
                className="w-full bg-sky-300 text-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-black">Email</label>
              <input
                type="email"
                value={userData.email}
                readOnly={!isEditing}
                className="w-full bg-sky-300 text-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-black">Phone Number</label>
              <input
                type="Phone Number"
                value={userData.PhoneNumber}
                readOnly={!isEditing}
                className="w-full bg-sky-300 text-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              />
            </div>

            <div className="mb-4">
            <label className="block text-sm text-black">Address</label>
              <input
                type="Address"
                value={userData.Address}
                readOnly={!isEditing}
                className="w-full bg-sky-300 text-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              />
            </div>

            <button
              onClick={handleEditToggle}
              className="mt-2 bg-blue-600 hover:bg-blue-700 w-full py-1 rounded text-sm"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(userData.name)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>

          {/* Donations */}
          <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
            <ProgressCircle
              value={stats.donatedBooks * 4}
              color="#10B981"
              label={stats.donatedBooks}
            />
            <h3 className="text-lg font-semibold mb-1">Books Donated</h3>
            <p className="text-gray-500">Pending: {stats.pendingDonations}</p>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-semibold mb-4">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center font-medium text-gray-500 text-sm">{d}</div>
              ))}
              {generateCalendar(
                currentDate.getFullYear(),
                currentDate.getMonth()
              ).map((day) => (
                <div 
                  key={day}
                  className="text-center p-2 hover:bg-gray-100 rounded-full"
                  role="gridcell"
                  aria-label={`Calendar day ${day}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Book Requests */}
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
            <ProgressCircle
              value={(stats.rewardsEarned / 150) * 100}
              color="#8B5CF6"
              label={stats.rewardsEarned}
            />
            <p className="text-gray-500">Next reward at 150 points</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(stats.rewardsEarned / 150) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





