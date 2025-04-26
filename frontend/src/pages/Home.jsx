import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function BookDonationPage() {
  const [donatedBooks, setDonatedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonatedBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/books/books?limit=12');
        if (Array.isArray(res.data)) {
          setDonatedBooks(res.data);
        } else {
          setDonatedBooks([]);
        }
      } catch (err) {
        console.error("Error fetching donated books:", err);
      }
    };
    fetchDonatedBooks();
  }, []);

  const handleBookClick = (book) => {
    navigate('/RequestBook', { 
      state: { 
        prefilledTitle: book.title,
        prefilledGenre: book.genre
      } 
    });
  };

  return (
    <div className="bg-sky-200 min-h-screen">
      <header className="text-center">
        <h1 className="text-3xl font-bold mt-0 pt-17">Donate books to those in need</h1>
        <p className="text-2xl font-bold text-100 mt-2">Your contributions can make a big difference</p>
      </header>

      <div className="bg-white w-full mt-10 pb-10">
        <div className="flex justify-center gap-60 mt-10 pt-22">
          <a href="/DonatePage">
            <button className="bg-blue-400 text-white rounded-full w-32 h-32 flex items-center justify-center text-lg font-semibold shadow-md hover:bg-blue-500 text-center cursor-pointer">
              Donate<br />Books
            </button>
          </a>
          <a href="/BookRequestPage">
            <button className="bg-blue-400 text-white rounded-full w-32 h-32 flex items-center justify-center text-lg font-semibold shadow-md hover:bg-blue-500 text-center cursor-pointer">
              Request<br />Books
            </button>
          </a>
        </div>

        <main className="px-8 mt-30">
          <h2 className="text-2xl font-bold text-center text-gray-800">Recently Donated Books</h2>

          <div className="mt-8 px-4 relative">
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {donatedBooks.length > 0 ? donatedBooks.map((book, index) => (
                <SwiperSlide key={index}>
                  <div 
                    className="flex gap-5 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                    onClick={() => handleBookClick(book)}
                  >
                    <img
                      src={book.image ? `http://localhost:3000/${book.image}` : '/fallback-image.jpg'}
                      alt={`${book.title} book cover`}
                      className="w-24 h-32 object-cover rounded scroll pt-8"
                    />
                    <div className="flex flex-col flex-1 pt-7">
                      <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
                      <div className="text-gray-700 mb-1 font-semibold">{book.genre}</div>
                      <div className="text-gray-700 mb-1 font-semibold">{book.condition}</div>
                      <div className="text-gray-700 mb-1 font-semibold">{book.name}</div>
                      <div className="text-gray-700 mb-1 font-semibold">{book.location}</div>
                    </div>
                  </div>
                </SwiperSlide>
              )) : (
                <p className="text-center w-full text-gray-500">No books found</p>
              )}
            </Swiper>
          </div>

          <div className="text-center mt-6">
            <a href="/BookRequestPage" className="text-blue-700 font-medium hover:underline cursor-pointer">
              Show more
            </a>
          </div>
        </main>

        <footer className="text-center mt-10 py-6 text-sm text-gray-500">
          <a href="#" className="hover:underline cursor-pointer">Privacy Policy</a> ·
          <a href="#" className="hover:underline cursor-pointer">Terms of Service</a> ·
          <a href="#" className="hover:underline cursor-pointer">FAQ</a>
        </footer>
      </div>
    </div>
  );
}