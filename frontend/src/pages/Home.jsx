import React from "react";


export default function BookDonationPage() {
  return (
    <div className="bg-sky-200 min-h-screen w-full -m-6  ">
      <header className="text-center  ">
        <h1 className="text-3xl font-bold text-900 mt-0 pt-17">
          Donate books to those in need
        </h1>
        <p className="text-2xl font-bold text-100 mt-2">
          Your contributions can make a big difference
        </p>
        </header>

       
        <div className="bg-white w-full mt-10 pb-10">

        <div className="flex justify-center gap-60 mt-10 pt-22">
          <button className="bg-blue-400 text-white rounded-full w-32 h-32 flex items-center justify-center text-lg font-semibold shadow-md hover:bg-blue-500 text-center">
            Donate<br />Books
          </button>
          <button className="bg-blue-400 text-white rounded-full w-32 h-32 flex items-center justify-center text-lg font-semibold shadow-md hover:bg-blue-500 text-center">
            Request<br />Books
          </button>
        </div>
    

      <main className="px-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mt-25">
          Book Section
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button className="text-3xl font-bold text-gray-700 hover:text-black">
            &#8592;
          </button>

          <div className="flex gap-6 overflow-x-auto">
            <img
              src="https://en.wikipedia.org/wiki/The_Great_Gatsby#/media/File:The_Great_Gatsby_Cover_1925_Retouched.jpg"
              alt="The Great Gatsby"
              className="w-36 h-56 object-cover rounded-md"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/en/8/8b/The_Art_of_War_cover.png"
              alt="The Art of War"
              className="w-36 h-56 object-cover rounded-md"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/79/To_Kill_a_Mockingbird.JPG"
              alt="To Kill a Mockingbird"
              className="w-36 h-56 object-cover rounded-md"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg"
              alt="1984"
              className="w-36 h-56 object-cover rounded-md"
            />
          </div>

          <button className="text-3xl font-bold text-gray-700 hover:text-black">
            &#8594;
          </button>
        </div>

        <div className="text-center mt-6">
          <a href="#" className="text-blue-700 font-medium hover:underline">
            Show more
          </a>
        </div>
      </main>

      <footer className="text-center mt-10 py-6 text-sm text-gray-500">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>{" "}
        ·
        <a href="#" className="hover:underline">
          Terms of Service
        </a>{" "}
        ·
        <a href="#" className="hover:underline">
          FAQ
        </a>
      </footer>
    </div>
    </div>
  );
}
