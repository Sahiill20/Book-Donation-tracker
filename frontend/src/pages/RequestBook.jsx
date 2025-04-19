import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Book} from "lucide-react";
import axios from 'axios';

export default function BookRequestPage() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successBookId, setSuccessBookId] = useState(null);
//   const [locationOpen, setLocationOpen] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const itemsPerPage = 4;

  const genre = ['Fiction', 'Non Fiction', 'Horror', 'Crime', 'Thriller', 'Educational', 'Dystopian'];
//   const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Boston', 'Seattle', 'Phoenix', 'San Francisco'];

  // ✅ Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/books/books');
        console.log("Fetched data:", res.data);
        if (Array.isArray(res.data)) {
            setBooks(res.data);
            setFilteredBooks(res.data);
          } else {
            console.error('Expected an array but got:', res.data);
            setBooks([]);
            setFilteredBooks([]);
          }
      } catch (err) {
        console.error('Error fetching books:', err);
      }
    };
    fetchBooks();
  }, []);

  // 🔍 Filter based on category, location, and title
  useEffect(() => {
    if (!Array.isArray(books)) return;
    let updatedBooks = books;
    if (selectedCategory) {
      updatedBooks = updatedBooks.filter(book => book.genre === selectedCategory);
      
    }
    if (selectedLocation) {
      updatedBooks = updatedBooks.filter(book => book.location === selectedLocation);
    }
    if (searchQuery) {
      updatedBooks = updatedBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBooks(updatedBooks);
    setPage(1);
  }, [selectedCategory, selectedLocation, searchQuery, books]);

  const handleRequest = (bookId) => {
    setActiveRequestId(bookId);
  };

  const confirmRequest = (bookId, title) => {
    setRequestSuccess(`Request sent for "${title}"`);
    setSuccessBookId(bookId);
    setShowSuccessMessage(true);
    setActiveRequestId(null);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessBookId(null);
      setRequestSuccess(null);
    }, 3000);
  };

  const paginatedBooks = Array.isArray(filteredBooks) ? filteredBooks.slice(0, page * itemsPerPage) : [];



  return (
    <div className="bg-blue-50 min-h-screen p-8 flex flex-col items-center relative">
      {/* Filters */}
      <div className="w-full max-w-5xl flex flex-wrap gap-4 mb-8 items-center justify-center">
        {/* Category Dropdown */}
        <div className="w-full md:w-1/3 relative">
          <div className="relative w-full cursor-pointer" onClick={() => setCategoryOpen(!categoryOpen)}>
            <div className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 pr-10 flex items-center font-semibold">
              {selectedCategory || 'Category'}
            </div>
          </div>
          {categoryOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {genre.map((category, index) => (
                <div key={index} className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedCategory(category); setCategoryOpen(false); }}>
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <input
          type="text"
          placeholder="Search by location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md bg-white text-gray-800 font-semibold"
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800"
        />
      </div>

      {filteredBooks.length === 0 && (
        <motion.div
          className="text-center text-gray-600 mt-16 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No books match your search or filter.
        </motion.div>
      )}

      {/* Book Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedBooks.map((book) => (
          <motion.div
            key={book._id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col gap-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-3">
            <img
            src={book.image || '/fallback-image.jpg'}
            alt={`${book.title} book cover`}
            className="w-24 h-32 object-cover rounded "
            />

              <div className="flex flex-col flex-1">
                <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
                <div className="text-gray-700 mb-1 font-semibold">{book.genre}</div>
                <div className="text-gray-700 mb-1 font-semibold">{book.condition}</div>
                <div className="text-gray-700 mb-1 font-semibold">{book.name}</div>
                <div className="text-gray-700 mb-1 font-semibold">{book.location}</div>
              </div>
            </div>

            {activeRequestId === book._id ? (
              <div className="mt-4">
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => confirmRequest(book._id, book.title)}
                    className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setActiveRequestId(null)}
                    className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                onClick={() => handleRequest(book._id)}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Request
              </motion.button>
            )}

            {showSuccessMessage && successBookId === book._id && (
              <motion.div
                className="mt-2 bg-green-100 text-green-800 p-2 rounded shadow text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {requestSuccess}
              </motion.div>
            )}

            <div className="text-sm text-gray-600 mt-2 italic text-center">{book.email || 'owner@email.com'}</div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {paginatedBooks.length < filteredBooks.length && (
        <motion.button
          onClick={() => setPage(prev => prev + 1)}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </motion.button>
      )}
    </div>
  );
}
