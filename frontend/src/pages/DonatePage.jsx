import React, { useState, useEffect } from "react";
import { auth } from '../firebase/firebase.config';
import axios from "axios";


export default function DonateBooksPage() {
  
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

    const user = JSON.parse(localStorage.getItem("user"));
    const token = await auth.currentUser?.getIdToken();
      if (!user?._id || !token) {
        alert("User not found. Please login again.");
        setIsLoading(false);
        return;
      }
    // Append all fields individually
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
    formData.append('image', form.image); // File must be last
    
    try {
      await axios.post("http://localhost:3000/api/donate/donate", formData, {
        headers: { "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
         }
      });
      console.log("Donation successful:");
    alert("Book donation submitted successfully!");
    setIsLoading(false);

    // Optional: Reset form
    setForm({
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
    setPreview(null);
      // ... success handling
    } catch (err) {
      console.error('Raw error:', err);
      console.error('Error response:', err.response);
      alert(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setIsLoading(false); // <- Move to finally so it resets in all cases
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Top Button Row */}
      <div className="w-full max-w-8xl flex justify-end mb-9"></div>

      {/* Main Content Row */}
      <div className="flex flex-col lg:flex-row items-start gap-12 w-full max-w-7xl">
        {/* Illustration Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <img
            src="/donate-placeholder.jpg"
            alt="Donate Books Illustration"
            className="w-full max-w-md mx-auto lg:mx-0 pb-10"
          />
          <h2 className="text-4xl font-bold text-blue-900 mt-4">Donate Your Books</h2>
          <p className="text-2xl text-gray-600 mt-2">
            "Every book you donate gives another child a chance to read and learn."
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-blue-100 rounded-2xl shadow-md max-h-[calc(100vh-150px)] overflow-y-auto">
          <form className="p-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Add Book Information</h3>

            <label className="block mb-2 font-medium">Book Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Book Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="block mb-2 font-medium">Genre</label>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Genre</option>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Biography</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block mb-2 font-medium">Condition</label>
                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Condition</option>
                  <option>New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
            </div>

            <label className="block mb-2 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, street, or area"
              className="w-full p-2 mb-4 border rounded"
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

            <label className="block mb-2 font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />

<label className="block mb-2 font-medium">Upload Book Image</label>
    <input
      type="file"
      accept="image/*"
      name="image"
      onChange={handleFileChange}
      className="w-full p-2 mb-2 border rounded bg-blue-100"
    />
    {/* Image preview (shown after selection) */}
    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="mt-2 w-32 h-32 object-cover rounded"
      />
    )}

    <button
      type="submit"
      disabled={isLoading}
      className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      {isLoading ? "Processing..." : "Donate Book"}
    </button>
          </form>
        </div>
      </div>
    </div>
  );
}
