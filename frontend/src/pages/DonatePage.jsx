import React from "react";

export default function DonateBooksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
  {/* Top Button Row */}
  <div className="w-full max-w-8xl flex justify-end mb-9">
    <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition">
      My Book List
    </button>
  </div>

  {/* Main Content Row */}
  <div className="flex flex-col lg:flex-row items-start gap-12 w-full max-w-7xl">
    {/* Illustration Section */}
    <div className="w-full lg:w-1/2 text-center lg:text-left">
      <img
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fbook-giving&psig=AOvVaw2SfPayH6HGMRelWdlm8X6X&ust=1745057312573000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLi55q6r4YwDFQAAAAAdAAAAABAE"
        alt="Donate Books Illustration"
        className="w-full max-w-md mx-auto lg:mx-0 pb-10"
      />
      <h2 className="text-4xl font-bold text-blue-900 mt-4">
        Donate Your Books
      </h2>
      <p className="text-2xl-gray-4100 mt-2">
        "Every book you donate gives another child a chance to read and learn."
      </p>
    </div>

    {/* Form Section with Scrollable Container */}
    <div className="w-full lg:w-1/2 bg-blue-100 rounded-2xl shadow-md max-h-[calc(100vh-150px)] overflow-y-auto">
      <form className="p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Add Book Information</h3>

        <label className="block mb-2 font-medium">Book Title</label>
        <input
          type="text"
          placeholder="Book Title"
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Book Description</label>
        <textarea
          placeholder="Short description"
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label className="block mb-2 font-medium">Genre</label>
            <select className="w-full p-2 border rounded">
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Educational</option>
              <option>Comics</option>
            </select>
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block mb-2 font-medium">Condition</label>
            <select className="w-full p-2 border rounded">
              <option>New</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>
        </div>

        <label className="block mb-2 font-medium">Location</label>
        <input
          type="text"
          placeholder="City, street, or area"
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label className="block mb-2 font-medium">Your Name</label>
            <input type="text" placeholder="Your name" className="w-full p-2 border rounded" />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block mb-2 font-medium">Your Email</label>
            <input type="email" placeholder="Your email" className="w-full p-2 border rounded" />
          </div>
        </div>

        <label className="block mb-2 font-medium">Quantity</label>
        <input
          type="number"
          defaultValue={1}
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Upload Book Image</label>
        <input
          type="file"
          className="w-full p-2 mb-6 border rounded bg-blue-100"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Donate Book
        </button>
      </form>
    </div>
  </div>
</div>

     
  
  
  );
}