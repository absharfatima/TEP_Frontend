import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = false; // Replace with your logic to check if the user is logged in or not.

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-centers">
          <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill="white" fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clip-rule="evenodd" />
              <path fill="white" d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
            </svg>
            <Link to="/" className="text-white text-xl font-bold">
              Trainer Engagement Platform
            </Link>
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-10">
              {/* Additional links */}
              <li>
                <Link to="/about-us" className="text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-white">
                  Contact Us
                </Link>
              </li>
              {/* Conditional rendering based on login status */}
              {isLoggedIn ? (
                <li>
                  <Link to="/profile" className="text-white">
                    Profile
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/business-register" className="text-white">
                      Register as Business
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign-in" className="text-white">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/trainer-register" className="text-white">
                      Register as Trainer
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
