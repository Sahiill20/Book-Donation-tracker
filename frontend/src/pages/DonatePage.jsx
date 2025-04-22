// Enhanced DonateBooksPage with animations, toast, image cropping, validations, and recent donations
import React, { useState, useEffect } from "react";
import { auth } from '../firebase/firebase.config';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom';

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
    const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
    setForm((prev) => ({ ...prev, image: croppedImg }));
    setPreview(URL.createObjectURL(croppedImg));
    setIsCropping(false);
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
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('quantity',Number(form.quantity));
      if (form.image) formData.append('image', form.image);

      await axios.post("http://localhost:3000/api/donate/donate", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        }
      });

      updateDashboardStats(form.quantity);
      toast.success("Donation submitted!");
      localStorage.removeItem('donationForm');
      setForm({
        title: '', description: '', genre: '', condition: '',
        location: '', name: '', email: '', quantity: 1, image: null
      });
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
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
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <ToastContainer position="top-center" />
      <div className="flex flex-col lg:flex-row items-start gap-12 w-full max-w-7xl">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <img src="/donate-placeholder.jpg" alt="Donate Books" className="w-full max-w-md mx-auto lg:mx-0 pb-10" />
          <h2 className="text-4xl font-bold text-blue-900 mt-4">Donate Your Books</h2>
          <p className="text-2xl text-gray-600 mt-2">"Every book you donate gives another child a chance to read and learn."</p>
        </div>

             <div className="w-full lg:w-1/3 bg-blue-100 rounded-2xl shadow-md">
          <form className="p-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add Book Information</h3>

            <div className="space-y-4">
              <input required name="title" value={form.title} onChange={handleChange} placeholder="Book Title*" className="w-full p-2 border rounded" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
              <div className="grid grid-cols-2 gap-4">
                <select required name="genre" value={form.genre} onChange={handleChange} className="p-2 border rounded">
                  <option value="">Select Genre*</option>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Suspense/thriller</option>
                  <option>Educational</option>
                  <option>Biography</option>
                  <option>Comics</option>
                  <option>Other</option>
                </select>
                <select required name="condition" value={form.condition} onChange={handleChange} className="p-2 border rounded">
                  <option value="">Condition*</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <input required name="location" value={form.location} onChange={handleChange} placeholder="Location*" className="w-full p-2 border rounded" />
              <div className="flex gap-4">
                <input name="name" type="text" value={userData.fullName} onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} disabled={!isEditing} placeholder="Your Name" className="w-full p-2 border rounded" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="w-full p-2 border rounded" />
              </div>
              <input required type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded bg-white" />
              {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}

              {isCropping && cropImage && (
                <div className="relative h-64 w-full bg-black">
                  <Cropper
                    image={cropImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                  />
                  <button type="button" onClick={handleCropComplete} className="absolute bottom-2 right-2 bg-blue-600 text-white px-4 py-2 rounded">Crop</button>
                </div>
              )}

              <button type="submit" disabled={isLoading} className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
                {isLoading ? "Processing..." : "Donate Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}