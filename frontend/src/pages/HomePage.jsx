


import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdStar } from "react-icons/md";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getAllReviews } from "../services/userServices";
const featuredRecipes = [
  { id: 1, title: "Grilled Lemon Chicken", img: "https://www.chewoutloud.com/wp-content/uploads/2025/05/lemon-grilled-chicken-square.jpg" },
  { id: 2, title: "Sushi Platter", img: "https://images.unsplash.com/photo-1663334038419-71e6f82e333f?q=80&w=2039&auto=format&fit=crop" },
  { id: 3, title: "Avocado Toast", img: "https://whatsgabycooking.com/wp-content/uploads/2023/01/Master.jpg" },
  { id: 4, title: "Tiramisu Dessert", img: "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2024/09/THUMB-VIDEO-2_rev1-56.jpeg" },
  { id: 5, title: "Biscoff Cheesecake", img: "https://www.tamingtwins.com/wp-content/uploads/2023/06/image-57.jpeg" },
  { id: 6, title: "BBQ Ribs", img: "https://www.marthastewart.com/thmb/GL2chyMKQYGrNCVelNPJoh0J1Ck=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MS-318389-oven-roasted-ribs-with-barbecue-sauce-hero-3x2-26714-f4b156a93dd44990b38fa7c6e6ef8c78.jpg" },
];

// 🍽️ Categories for Easy Recipes
const recipeCategories = {
  Cakes: [
    { id: 1, title: "Chocolate Cake", img: "https://i.pinimg.com/736x/2d/29/ef/2d29efb91d3a1d9ffe4ede0f53717416.jpg" },
    { id: 2, title: "Strawberry Shortcake", img: "https://www.allrecipes.com/thmb/Dhb0atrypaWX3v2io2DyAACE6sQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/8201-strawberry-shortcake-ddmfs-5777-hero-1x2-1-0bde2ca6dd554b77b3ef5362b2b43a05.jpg" },
    { id: 3, title: "Turtle Cheesecake", img: "https://www.bunsenburnerbakery.com/wp-content/uploads/2022/11/turtle-cheesecake-square-9Q2B4913-735x735.jpg" },
    { id: 4, title: "Red Velvet Cake", img: "https://media.istockphoto.com/id/485832764/photo/red-velvet-cake.jpg?s=612x612&w=0&k=20&c=nMyCKKBcLWRVn3s3GBc63yGst700YF98VjSTBXwuCx4=" },
  ],
  Desserts: [
    { id: 1, title: "Tiramisu", img: "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2024/09/THUMB-VIDEO-2_rev1-56.jpeg" },
    { id: 2, title: "Brownie Sundae", img: "https://dirtydishesmessykisses.com/wp-content/uploads/2024/10/brownie-sundae-recipe-1730416956.jpg" },
    { id: 3, title: "Mango Mousse", img: "https://cdn1.foodviva.com/static-content/food-images/dessert-recipes/mango-mousse/mango-mousse.jpg" },
    { id: 4, title: "Creme Brulee", img: "https://upload.wikimedia.org/wikipedia/commons/1/17/2014_0531_Cr%C3%A8me_br%C3%BBl%C3%A9e_Doi_Mae_Salong_%28cropped%29.jpg" },
  ],
  Mandi: [
    { id: 1, title: "Chicken Yemeni Mandi", img: "https://butfirstchai.com/wp-content/uploads/2023/03/yemeni-chicken-mandi-recipe.jpg" },
    { id: 2, title: "Mutton Zurbian Mandi", img: "https://raidanmandi.ae/wp-content/uploads/2024/09/%D8%B2%D8%B1%D8%A8%D9%8A%D8%A7%D9%86-%D9%84%D8%AD%D9%85.png" },
    { id: 3, title: "Chicken Madfoon Mandi", img: "https://assets.indolj.io/upload/1627741093-Chicken-Madfoon.jpg" },
    { id: 4, title: "Arabic Fish Mandi", img: "https://salasdaily.com/cdn/shop/files/fishmandi.jpg?v=1694847828" },
  ],
  Drinks: [
    { id: 1, title: "Mango Smoothie", img: "https://cdn.loveandlemons.com/wp-content/uploads/2023/05/mango-smoothie.jpg" },
    { id: 2, title: "Iced Coffee", img: "https://cdn.loveandlemons.com/wp-content/uploads/2025/05/how-to-make-iced-coffee-at-home.jpg" },
    { id: 3, title: "Green Tea", img: "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/Life_with_j_pouch_slideshow/1800ss_getty_rf_green_tea.jpg" },
    { id: 4, title: "Berry Milkshake", img: "https://static.toiimg.com/photo/84226147.cms" },
  ],
  Snacks: [
    { id: 1, title: "Cheesy Nachos", img: "https://www.nestlegoodnes.com/ph/sites/default/files/styles/1_1_768px_width/public/srh_recipes/4a0662aa00289483c8ae8bbcccf01a3f.jpg.webp?itok=U4cWTPeH" },
    { id: 2, title: "Veggie Pizza", img: "https://dudethatcookz.com/wp-content/uploads/2024/09/classic_veggie_pizza_2.jpg" },
    { id: 3, title: "Spicy Ramen", img: "https://eatwithclarity.com/wp-content/uploads/2023/02/spicy-ramen-noodles.jpg" },
    { id: 4, title: "Garlic Breadsticks", img: "https://media.istockphoto.com/id/1196410984/photo/garlic-breadsticks.jpg?s=612x612&w=0&k=20&c=TUV2QRtjgkKB9ZpRqQ-TBHbCRwoL1MXOYg0Xx7AXtVs=" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Cakes");
  const { auth } = useAuth(); // ✅ access auth state
  const navigate = useNavigate();
  useEffect(() => {
    getAllReviews().then((res) => {
      const latest = res.data.slice(0, 5);
      setReviews(latest);
    })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle More Recipes button
  const handleMoreRecipe = () => {
    if (!auth?.isLoggedIn) {
      toast.info("Please login to view more recipes 🍽️", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } else {
      navigate("/userdashboard");
    }
  };
  return (
    <div className="w-full overflow-hidden">
      {/* 🌄 HERO SECTION */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div
          className="relative z-10 text-center px-5 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-lora italic text-white text-4xl sm:text-5xl md:text-6xl font-semibold drop-shadow-lg">
            “Good food is the foundation of genuine happiness ”
          </h1>

          <p className="text-white text-lg sm:text-xl mt-4 opacity-90">
            Explore simple, delicious recipes and discover your next favorite dish
          </p>
        </motion.div>
      </section>

      {/* ⭐ FEATURED RECIPES */}
      <motion.section
        className="py-16 px-4 sm:px-8 md:px-12 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center my-8 text-gray-800">
          Featured Recipes
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3
          "
        >
          {featuredRecipes.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="bg-gray-40 text-center shadow-md hover:shadow-xl hover:scale-[1.03] transition duration-300 overflow-hidden"
            >
              <img src={item.img} alt={item.title} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 🍲 SPICE BACKGROUND PROMO SECTION */}
      <section
        className="relative w-full py-20 bg-cover bg-center flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1340677256/photo/various-spices-a-vintage-spoons-on-stone-table-colorful-herbal-and-spices-oriental.jpg?s=612x612&w=0&k=20&c=f4BnfLiu9sMl3C5nCjR9835EV6FtPreLetWGouaKAj4=')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 px-6 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Find Your Next Favorite Dish — Simple, Tasty, Homemade
          </h2>
          <p className="text-gray-200 mb-6">
            Discover Delicious Recipes Made for Everyday Cooking
          </p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* 🍰 EASY & QUICK RECIPES (Dynamic Tabs) */}
      <motion.section
        className="py-16 px-4 sm:px-8 md:px-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center  mb-6 text-gray-800">
          Explore More
        </h2>

        {/* 🔖 Category Tabs */}
        <div className="flex justify-center gap-6 mb-10 flex-wrap">
          {Object.keys(recipeCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-semibold transition relative pb-2 ${activeCategory === category
                ? "text-orange-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-orange-600"
                : "text-gray-600 hover:text-orange-500"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 🖼️ Recipe Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {recipeCategories[activeCategory].map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="bg-white  shadow-md hover:shadow-xl hover:scale-[1.03] transition duration-300 overflow-hidden"
            >
              <img src={item.img} alt={item.title} className="w-full h-60 object-cover object-center" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="w-full flex justify-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={handleMoreRecipe}
            className="px-7 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition"
          >
            More Recipes
          </button>
        </motion.div>
      </motion.section>

      {/* 💬 USER REVIEWS */}
      <motion.section
        className="py-16  px-5 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const reviewer = review.user || {};
              const username = reviewer.name
                ? reviewer.name.charAt(0).toUpperCase() + reviewer.name.slice(1)
                : "Anonymous";
              const userImage = reviewer.profilePicture || "/default-avatar.png";
              return (
                <motion.div
                  key={review._id}
                  className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-semibold">{review.recipe.title}</h2>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={userImage}
                      alt={username}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 object-center"
                    />
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <MdStar
                          key={i}
                          className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic">“{review.review}”</p>
                  <div className="mt-4 text-right">
                    <p className="text-sm text-gray-600 font-medium italic">
                      — {username}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No reviews yet.</p>
          )}
        </div>
      </motion.section>

      <section className="bg-gray-50 text-white py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold italic text-center mb-10 text-gray-800">
          The Art of Good Food &amp; Great Company
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-10 "
        >
          {/* Add brand logos */}
          <img
            src="https://marketplace.canva.com/EAGKDhXEhoY/1/0/1600w/canva-brown-and-white-simple-modern-professional-catering-logo-Dvz9NG3gqk0.jpg"
            alt="Catering Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
          <img
            src="https://media.istockphoto.com/id/1396663450/vector/vegetarian-and-salad-restaurant-food-menu-logo.jpg?s=612x612&w=0&k=20&c=zaEVdJbdf6RxK09yC4_TAlLfxkh7kAtF3fJ2hprSM_4="
            alt="Veg Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
          <img
            src="https://media.istockphoto.com/id/1053386500/vector/steak-house-restaurant-logo.jpg?s=612x612&w=0&k=20&c=sUh5Xr4vAX9mqBhwS59EwkJ3_ePuX0u4BmWvAikQhNA="
            alt="Steak Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
          <img
            src="https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:ceccfc7c-8eb9-5c1b-af9c-dfdc953c5d4d/component?assetType=TEMPLATE&etag=4873b3126687453389a441b6d53667a1&revision=718b5a19-7286-4405-aaf9-1d66eb177efa&component_id=1ed62368-3753-4704-a8f0-1a1be0370221"
            alt="Steak Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
          <img
            src="https://png.pngtree.com/png-vector/20230420/ourmid/pngtree-vintage-italian-restaurant-logo-design-with-utensil-sign-vector-png-image_51573090.jpg"
            alt="Steak Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSBwruY2Xn866J1QoldHPTjZjmFZpxcQj4ng&s"
            alt="Steak Logo"
            className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-contain"
          />
        </motion.div>


      </section>


      <Outlet />
    </div>
  );
}

export default HomePage;

