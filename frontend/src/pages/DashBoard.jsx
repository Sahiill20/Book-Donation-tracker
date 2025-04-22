import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { auth } from '../firebase/firebase.config';
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  const [stats, setStats] = useState({
    donatedBooks: 0,
    pendingDonations: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rewardsEarned: 0
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const currentDate = new Date();

  const handleEditToggle = () => {
    if (isEditing) {
      toast.success("Profile saved successfully");
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    setIsEditing(!isEditing);
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem('userProfileImage');
    toast('Profile photo removed.', { icon: '🗑️' });
  };

  const getInitials = (name = '') =>
    name.trim().split(' ').map(n => n[0]).join('').toUpperCase();

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

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
    } catch {
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
      setTimeout(() => setImageUpdated(false), 1000);
    }
  };

  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        const uid = localUser?._id;

        const countResponse = await axios.get(`http://localhost:3000/api/donate/count?donorId=${uid}`);
        const donationCount = Number(countResponse.data.totalDonated) || 0;

        const localStats = JSON.parse(localStorage.getItem('dashboardStats')) || {};

        setStats({
          donatedBooks: donationCount,
          pendingDonations: localStats.pendingDonations || 0,
          approvedRequests: localStats.approvedRequests || 0,
          pendingRequests: localStats.pendingRequests || 0,
          rewardsEarned: localStats.rewardsEarned || 0
        });

      } catch (error) {
        console.error("Error fetching donation stats:", error);
        const localStats = JSON.parse(localStorage.getItem('dashboardStats')) || stats;
        setStats(localStats);
      }
    };

    fetchDonationStats();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Perform actual logout with Firebase
      auth.signOut().then(() => {
        toast.success('Logged out successfully!');
        localStorage.clear();
        window.location.reload();
      });
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
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
                {getInitials(userData.fullName)}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <label htmlFor="profile-photo" className="bg-white text-blue-700 px-3 py-1 rounded shadow cursor-pointer text-sm hover:bg-blue-100">
                Choose Photo
              </label>
              <input id="profile-photo" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {profileImage && (
                <button onClick={handleRemovePhoto} className="text-red-600 text-sm mt-1 hover:underline">
                  Remove Photo
                </button>
              )}
            </div>
          )}

          {['fullName', 'email', 'phoneNumber', 'address'].map((field, idx) => (
            <div className="mb-4" key={idx}>
              <label className="block text-sm text-black capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={userData[field] || ''}
                onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-sky-300 text-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              />
            </div>
          ))}

          <button onClick={handleEditToggle} className="mt-2 bg-blue-600 hover:bg-blue-700 w-full py-1 rounded text-sm">
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center">
            <FaSignOutAlt className="mr-2" /> LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(userData.fullName)}
            </div>
            <h2 className="text-xl font-semibold mb-1">{userData.fullName}</h2>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors" onClick={handleEditToggle}>
              Edit Profile
            </button>
          </div>

          {/* Stats: Donated Books */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-green-600">{stats.donatedBooks}</div>
            <p className="text-gray-600 mt-1">Books Donated</p>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-center font-semibold mb-4">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={`${day}-${index}`} className="text-center font-medium text-gray-500">
    {day}
  </div>
              ))}
              {generateCalendarDays().map(day => (
                <div key={day} className="text-center p-2">{day}</div>
              ))}
            </div>
          </div>

          {/* Book Requests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Book Requests</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.approvedRequests}</div>
                <p className="text-gray-500">Approved</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{stats.pendingRequests}</div>
                <p className="text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold mb-4">Rewards Earned</h3>
            <div className="text-4xl font-bold text-purple-600">{stats.rewardsEarned}</div>
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
