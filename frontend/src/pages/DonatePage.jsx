import React, { useState, useEffect } from "react";
import { auth } from '../firebase/firebase.config';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DonateBooksPage() {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
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
      pendingDonations: currentStats.pendingDonations + quantity,
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
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = await auth.currentUser?.getIdToken();
      if (!user?._id || !token) {
        alert("Please login again.");
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
      formData.append('quantity', form.quantity);
      if (form.image) formData.append('image', form.image);

      await axios.post("http://localhost:3000/api/donate/donate", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` 
        }
      });

      updateDashboardStats(form.quantity);
      alert("Donation submitted!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-8xl flex justify-end mb-9"></div>

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

        <div className="w-full lg:w-1/2 bg-blue-100 rounded-2xl shadow-md max-h-[calc(100vh-150px)] overflow-y-auto">
          <form className="p-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add Book Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Book Title*</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">Genre*</label>
                  <select
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Children's</option>
                    <option>Educational</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Condition*</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option>New</option>
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>
              </div>

              
                <label className="block mb-2 font-medium">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="block mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block mb-2 font-medium">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

              <div>
                <label className="block mb-2 font-medium">Quantity*</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Book Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded bg-white"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Processing..." : "Donate Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}