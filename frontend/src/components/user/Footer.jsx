import React from "react";
import { Link } from "react-router-dom";
import creamypasta from "../../assets/logo/creamypasta.jpg";
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 ">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">About RecipeBlog</h2>
          <p className="text-sm leading-6">
            Discover delicious recipes, cooking tips, and food stories.  
            We bring flavors from around the world to your kitchen.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/recipe" className="hover:text-orange-400">Recipes</Link></li>
            <li><Link to="/about" className="hover:text-orange-400">About Us</Link></li>
            <li><Link to="/signin" className="hover:text-orange-400">Sign Up</Link></li>
            <li><Link to="/login" className="hover:text-orange-400">Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li>Email: support@recipeblog.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Kochi, India</li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-orange-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2 .9 0 1.8.1 2 .1v2.2h-1.1c-1 0-1.3.6-1.3 1.2V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12"></path>
              </svg>
            </a>

            <a href="#" className="hover:text-orange-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.5.58-2.33.7a4.18 4.18 0 0 0 1.84-2.3 8.1 8.1 0 0 1-2.6 1A4.14 4.14 0 0 0 16.11 4c-2.27 0-4.1 1.92-4.1 4.29 0 .34.03.66.1.97-3.41-.2-6.43-1.9-8.45-4.53a4.43 4.43 0 0 0-.55 2.17c0 1.5.72 2.84 1.83 3.62-.67-.02-1.32-.22-1.86-.52v.05c0 2.1 1.4 3.85 3.26 4.25-.34.1-.7.15-1.1.15-.26 0-.53-.01-.78-.07.53 1.7 2.03 2.94 3.8 2.98A8.3 8.3 0 0 1 2 19.54 11.68 11.68 0 0 0 8.29 21c7.55 0 11.68-6.54 11.68-12.2 0-.19 0-.38-.01-.57A8.67 8.67 0 0 0 22.46 6z"/>
              </svg>
            </a>

            <a href="#" className="hover:text-orange-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2C6.5 2.2 2 6.7 2 12.2a9.9 9.9 0 0 0 6.8 9.4c.5.1.7-.2.7-.5v-2c-2.7.6-3.3-1.3-3.3-1.3-.5-1.2-1.2-1.5-1.2-1.5-.9-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1 .9 1.7 2.6 1.2 3.2.9 .1-.7.4-1.2.7-1.5-2.2-.3-4.5-1.2-4.5-5.1 0-1.1.4-2 .9-2.8-.1-.3-.4-1.3.1-2.5 0 0 .8-.3 2.7 1a9.2 9.2 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.2.2 2.2.1 2.5 .6.8.9 1.7.9 2.8 0 3.9-2.3 4.8-4.5 5.1 .4.3.8 1 .8 2v3c0 .3.2.6.7.5A9.9 9.9 0 0 0 22 12.2C22 6.7 17.5 2.2 12 2.2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Food Advertisement / Promo */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Featured Recipe</h2>

          <div className="bg-gray-800 rounded-lg p-4 hover:shadow-lg transition">
            <img
              src={creamypasta}
              alt="Featured Dish"
              className="rounded-lg mb-3"
            />
            <h3 className="text-orange-400 font-semibold text-lg mb-2">
              Try Our Special Creamy Pasta!
            </h3>
            <p className="text-sm mb-3">
              A delicious blend of cream, herbs, and fresh veggies.  
              Perfect for dinner tonight!
            </p>
            <Link
              to="/recipe"
              className="text-orange-400 underline font-medium"
            >
              View Recipe →
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} RecipeBlog — All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
