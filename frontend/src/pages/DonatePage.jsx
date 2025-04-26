import React, { useState, useEffect } from "react";
import { auth } from '../firebase/firebase.config';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DonateBooksPage() {
  const [userData, setUserData] = useState({
    fullName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    condition: '',
    location: '',
    name: '',
    email: '',
    quantity: 1,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropImage, setCropImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const updateDashboardStats = (quantity) => {
    const currentStats = JSON.parse(localStorage.getItem('dashboardStats')) || {
      donatedBooks: 0,
      pendingDonations: 0,
      approvedRequests: 0,
      pendingRequests: 0,
      rewardsEarned: 0
    };
    
    localStorage.setItem('dashboardStats', JSON.stringify({
      ...currentStats,
      donatedBooks: currentStats.donatedBooks + quantity,
    }));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const saveDonationDate = () => {
    const today = new Date();
    const todayUTC = new Date(Date.UTC(
      today.getUTCFullYear(), 
      today.getUTCMonth(), 
      today.getUTCDate()
    ));
    const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const existingDates = JSON.parse(localStorage.getItem('donationDates')) || [];
    
    if (!existingDates.includes(dateStr)) {
      existingDates.push(dateStr);
      localStorage.setItem('donationDates', JSON.stringify(existingDates));
      // Trigger update for dashboard calendar
      window.dispatchEvent(new Event('donationDatesUpdated'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be smaller than 3MB");
      return;
    }
    setCropImage(URL.createObjectURL(file));
    setIsCropping(true);
  };

  const handleCropComplete = async () => {
    try {
      const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
      setForm((prev) => ({ ...prev, image: croppedImg }));
      setPreview(URL.createObjectURL(croppedImg));
      setIsCropping(false);
    } catch (error) {
      toast.error("Error cropping image");
      console.error("Cropping error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = await auth.currentUser?.getIdToken();
      if (!user?._id || !token) {
        toast.error("Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append('donorId', user._id);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('genre', form.genre);
      formData.append('condition', form.condition);
      formData.append('location', form.location);
      formData.append('name', form.name || userData.fullName);
      formData.append('email', form.email || user.email);
      formData.append('quantity', Number(form.quantity));
      if (form.image) formData.append('image', form.image);

      await axios.post("http://localhost:3000/api/donate/donate", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        }
      });

      // Update all relevant data
      updateDashboardStats(form.quantity);
      saveDonationDate();
      
      toast.success("Donation submitted successfully!");
      
      // Reset form
      setForm({
        title: '',
        description: '',
        genre: '',
        condition: '',
        location: '',
        name: '',
        email: '',
        quantity: 1,
        image: null
      });
      setPreview(null);
      
      // Optional: Redirect after successful submission
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (err) {
      console.error("Donation error:", err);
      toast.error(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserData({
        fullName: parsedUser.fullName,
      });
      // Prefill name and email if available
      setForm(prev => ({
        ...prev,
        name: parsedUser.fullName,
        email: parsedUser.email || ''
      }));
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-white flex flex-col items-center justify-center p-4"
    >
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="flex flex-col lg:flex-row items-start gap-12 w-full max-w-7xl">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <img 
            src="/donate-placeholder.jpg" 
            alt="Donate Books" 
            className="w-full max-w-md mx-auto lg:mx-0 pb-10" 
          />
          <h2 className="text-4xl font-bold text-blue-900 mt-4">Donate Your Books</h2>
          <p className="text-2xl text-gray-600 mt-2">
            "Every book you donate gives another child a chance to read and learn."
          </p>
        </div>

        <div className="w-full lg:w-1/3 bg-blue-100 rounded-2xl shadow-md">
          <form className="p-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add Book Information</h3>

            <div className="space-y-4">
              <input 
                required 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Book Title*" 
                className="w-full p-2 border rounded" 
              />
              
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Description" 
                className="w-full p-2 border rounded" 
                rows="3"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select 
                  required 
                  name="genre" 
                  value={form.genre} 
                  onChange={handleChange} 
                  className="p-2 border rounded"
                >
                  <option value="">Select Genre*</option>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Suspense/thriller</option>
                  <option>Educational</option>
                  <option>Biography</option>
                  <option>Comics</option>
                  <option>Other</option>
                </select>
                
                <select 
                  required 
                  name="condition" 
                  value={form.condition} 
                  onChange={handleChange} 
                  className="p-2 border rounded"
                >
                  <option value="">Condition*</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              
              <input 
                required 
                name="location" 
                value={form.location} 
                onChange={handleChange} 
                placeholder="Location*" 
                className="w-full p-2 border rounded" 
              />
              
              <div className="flex gap-4">
                <input 
                  name="name" 
                  type="text" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Your Name" 
                  className="w-full p-2 border rounded" 
                />
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Your Email" 
                  className="w-full p-2 border rounded" 
                />
              </div>
              
              <input 
                required 
                type="number" 
                name="quantity" 
                min="1" 
                value={form.quantity} 
                onChange={handleChange} 
                className="w-full p-2 border rounded" 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Image (Optional)
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full p-2 border rounded bg-white" 
                />
              </div>
              
              {preview && (
                <div className="mt-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setForm(prev => ({ ...prev, image: null }));
                    }}
                    className="text-red-500 text-sm mt-1 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {isCropping && cropImage && (
                <div className="relative h-64 w-full bg-black mt-4 rounded-lg overflow-hidden">
                  <Cropper
                    image={cropImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    cropShape="rect"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCropping(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCropComplete} 
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Apply Crop
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading} 
                className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Donate Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}