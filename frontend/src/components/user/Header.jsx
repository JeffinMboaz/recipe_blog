
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { IoMdClose } from "react-icons/io";
// import { IoMenu } from "react-icons/io5";
// import { toast } from "react-toastify";

// import {
//   FaUser,
//   FaUtensils,
//   FaStar,
//   FaHeart,
//   FaTachometerAlt,
//   FaPlus,
// } from "react-icons/fa";
// import { logout, myProfile } from "../../services/userServices";

// function Header() {
//   const [open, setOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const { auth, setAuth } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [previewImage, setPreviewImage] = useState("");

//   // ✅ Fetch user profile image
//   useEffect(() => {
//     if (!auth?.isLoggedIn || auth?.role !== "user") return;

//   myProfile()
//       .then((res) => {
//         const u = res.data.user;
//         if (u?.profilePicture) setPreviewImage(u.profilePicture);
//       })
//       .catch((err) => console.log("PROFILE ERROR:", err));
//   }, [auth]);

//   const activeClass =
//     "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1";
//   const defaultClass = "hover:text-orange-600 transition-all duration-200";

//   const handleLogout = async () => {
//     try {
//       await logout()
      
//       setAuth({ isLoggedIn: false, role: null, user: null });
//       localStorage.removeItem("authData");
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       setOpen(false);
//     }
//   };

//   const handleProtectedRecipe = (e) => {
//     e.preventDefault();
//     if (!auth.isLoggedIn) {
//       toast.warn("Please login first", {
//         position: "top-center",
//         autoClose: 3000,
//         theme: "colored",
//       });
//       return;
//     }

//     navigate("/userdashboard");
//     setOpen(false);
//   };

//   const handleNavClick = () => setOpen(false);

//   // ✅ Public Nav Links
//   const renderPublicLinks = () => (
//     <>
//       <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Home</NavLink>
//       <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>About</NavLink>
//       <NavLink
//         to="/recipe"
//         onClick={(e) => {
//           handleProtectedRecipe(e);
//           handleNavClick();
//         }}
//         className={({ isActive }) => (isActive ? activeClass : defaultClass)}
//       >
//         Recipes
//       </NavLink>
//       <NavLink to="/login" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Login</NavLink>
//       <NavLink to="/signup" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Sign Up</NavLink>
//     </>
//   );

//   // ✅ User Links
//   const renderUserLinks = () => (
//     <>
//       <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Home</NavLink>
//       <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>About</NavLink>
//       <NavLink
//         to="/recipe"
//         onClick={(e) => {
//           handleProtectedRecipe(e);
//           handleNavClick();
//         }}
//         className={({ isActive }) => (isActive ? activeClass : defaultClass)}
//       >
//         Recipes
//       </NavLink>
//       <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
//         Logout
//       </button>
//     </>
//   );

//   // ✅ Admin Links (Top Nav)
//   const renderAdminLinks = () => (
//     <>
//       <NavLink
//         to="/admindashboard"
//         onClick={handleNavClick}
//         className={({ isActive }) => (isActive ? activeClass : defaultClass)}
//       >
//         Dashboard
//       </NavLink>


//       <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
//         Logout
//       </button>
//     </>
//   );

//   const getActiveIcon = (tab) =>
//     location.state?.tab === tab ? "text-yellow-400" : "text-gray-300";

//   // ✅ Active highlight for admin nav bottom
//   const isActivePath = (path) =>
//     location.pathname === path ? "text-yellow-400" : "text-gray-300";

//   return (
//     <header className="bg-white/20 backdrop-blur-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <NavLink to="/" onClick={handleNavClick} style={{ fontFamily: 'Roba', fontSize: '46px' }} className="text-2xl font-bold text-orange-600 ">
//           RB
//         </NavLink>

//         {/* DESKTOP NAV */}
//         <div className="hidden md:flex items-center space-x-6">



//           {/* Nav Links */}
//           <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
//             {!auth.isLoggedIn && renderPublicLinks()}
//             {auth.isLoggedIn && auth.role === "user" && renderUserLinks()}
//             {auth.isLoggedIn && auth.role === "admin" && renderAdminLinks()}
//           </nav>

//           {/* User Avatar */}
//           {auth.isLoggedIn && auth.role === "user" && (
//             <div
//               onClick={() => navigate("/userprofile")}
//               className="w-9 h-9 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-orange-600 text-white font-semibold"
//             >
//               {previewImage ? (
//                 <img src={previewImage} alt="User" className="w-full h-full object-cover" />
//               ) : (
//                 <span>{auth?.user?.email?.[0]?.toUpperCase()}</span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* MOBILE MENU TOGGLE */}
//         <button className="md:hidden" onClick={() => setOpen(!open)}>
//           {open ? <IoMdClose /> : <IoMenu />}
//         </button>
//       </div>

//       {/* MOBILE MENU */}
//       {open && (
//         <nav className="md:hidden bg-white shadow-lg py-4 px-6 space-y-5 text-gray-700 font-medium flex flex-col">
//           {!auth.isLoggedIn && renderPublicLinks()}
//           {auth.isLoggedIn && auth.role === "user" && renderUserLinks()}
//           {auth.isLoggedIn && auth.role === "admin" && renderAdminLinks()}
//         </nav>
//       )}

//       {/* ✅ USER Bottom Nav */}
//       {auth.isLoggedIn && auth.role === "user" && (
//         <div className="fixed md:hidden bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 shadow-lg z-40">
//           <button
//             onClick={() => navigate("/userprofile", { state: { tab: "recipes" } })}
//             className={`flex flex-col items-center ${getActiveIcon("recipes")}`}
//           >
//             <FaUtensils size={20} />
//             <span className="text-xs">My Recipes</span>
//           </button>

//           <button
//             onClick={() => navigate("/userprofile", { state: { tab: "reviews" } })}
//             className={`flex flex-col items-center ${getActiveIcon("reviews")}`}
//           >
//             <FaStar size={20} />
//             <span className="text-xs">My Reviews</span>
//           </button>

//           <button
//             onClick={() => navigate("/userprofile", { state: { tab: "favorites" } })}
//             className={`flex flex-col items-center ${getActiveIcon("favorites")}`}
//           >
//             <FaHeart size={20} />
//             <span className="text-xs">Favorites</span>
//           </button>

//           <button
//             onClick={() => navigate("/userprofile", { state: { tab: "profile" } })}
//             className={`flex flex-col items-center ${getActiveIcon("profile")}`}
//           >
//             <FaUser size={20} />
//             <span className="text-xs">Profile</span>
//           </button>
//         </div>
//       )}

      
//       {auth.isLoggedIn && auth.role === "admin" && (
//         <div className="fixed md:hidden bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 shadow-lg z-40">
//           <NavLink
//             to="/admindashboard"
//             className={`flex flex-col items-center ${isActivePath("/admindashboard")}`}
//           >
//             <FaTachometerAlt size={20} />
//             <span className="text-xs">Dashboard</span>
//           </NavLink>

//           <NavLink
//             to="/admindashboard/add"
//             className={`flex flex-col items-center ${isActivePath("/admindashboard/add")}`}
//           >
//             <FaPlus size={20} />
//             <span className="text-xs">Add</span>
//           </NavLink>

//           <NavLink
//             to="/admindashboard/update"
//             className={`flex flex-col items-center ${isActivePath("/admindashboard/update")}`}
//           >
//             <FaUtensils size={20} />
//             <span className="text-xs">Update</span>
//           </NavLink>

//           <NavLink
//             to="/admindashboard/delete"
//             className={`flex flex-col items-center ${isActivePath("/admindashboard/delete")}`}
//           >
//             <FaStar size={20} />
//             <span className="text-xs">Delete</span>
//           </NavLink>

//           <button
//             onClick={handleLogout}
//             className="flex flex-col items-center text-gray-300 hover:text-red-400 transition"
//           >
//             <FaUser size={20} />
//             <span className="text-xs">Logout</span>
//           </button>
//         </div>
//       )}
      
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  FaUser,
  FaUtensils,
  FaStar,
  FaHeart,
  FaTachometerAlt,
  FaPlus,
} from "react-icons/fa";
import { logout, myProfile } from "../../services/userServices";

function Header() {
  const [open, setOpen] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [previewImage, setPreviewImage] = useState("");

  // ✅ Fetch user profile image
  useEffect(() => {
    if (!auth?.isLoggedIn || auth?.role !== "user") return;

    myProfile()
      .then((res) => {
        const u = res.data.user;
        if (u?.profilePicture) setPreviewImage(u.profilePicture);
      })
      .catch((err) => console.log("PROFILE ERROR:", err));
  }, [auth]);

  const activeClass =
    "text-orange-600 font-semibold border-b-2 border-orange-600 pb-1";
  const defaultClass = "hover:text-orange-600 transition-all duration-200";

  const handleLogout = async () => {
    try {
      await logout();
      setAuth({ isLoggedIn: false, role: null, user: null });
      localStorage.removeItem("authData");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setOpen(false);
    }
  };

  const handleProtectedRecipe = (e) => {
    e.preventDefault();
    if (!auth.isLoggedIn) {
      toast.warn("Please login first", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    navigate("/userdashboard");
    setOpen(false);
  };

  const handleNavClick = () => setOpen(false);

  // ✅ Public Nav Links
  const renderPublicLinks = () => (
    <>
      <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Home</NavLink>
      <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>About</NavLink>
      <NavLink
        to="/recipe"
        onClick={(e) => {
          handleProtectedRecipe(e);
          handleNavClick();
        }}
        className={({ isActive }) => (isActive ? activeClass : defaultClass)}
      >
        Recipes
      </NavLink>
      <NavLink to="/login" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Login</NavLink>
      <NavLink to="/signup" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Sign Up</NavLink>
    </>
  );

  // ✅ User Links
  const renderUserLinks = () => (
    <>
      <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>Home</NavLink>
      <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => (isActive ? activeClass : defaultClass)}>About</NavLink>
      <NavLink
        to="/recipe"
        onClick={(e) => {
          handleProtectedRecipe(e);
          handleNavClick();
        }}
        className={({ isActive }) => (isActive ? activeClass : defaultClass)}
      >
        Recipes
      </NavLink>
      <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
        Logout
      </button>
    </>
  );

  // ✅ Admin Links (Top Nav)
  const renderAdminLinks = () => (
    <>
      <NavLink
        to="/admindashboard"
        onClick={handleNavClick}
        className={({ isActive }) => (isActive ? activeClass : defaultClass)}
      >
        Dashboard
      </NavLink>
      <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
        Logout
      </button>
    </>
  );

  const getActiveIcon = (tab) =>
    location.state?.tab === tab ? "text-yellow-400" : "text-gray-300";

  const isActivePath = (path) =>
    location.pathname === path ? "text-yellow-400" : "text-gray-300";

  return (
    <>
      {/* HEADER (top bar) */}
      <header className="bg-white/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            style={{ fontFamily: "Roba", fontSize: "46px" }}
            className="text-2xl font-bold text-orange-600"
          >
            RB
          </NavLink>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
              {!auth.isLoggedIn && renderPublicLinks()}
              {auth.isLoggedIn && auth.role === "user" && renderUserLinks()}
              {auth.isLoggedIn && auth.role === "admin" && renderAdminLinks()}
            </nav>

            {/* User Avatar */}
            {auth.isLoggedIn && auth.role === "user" && (
              <div
                onClick={() => navigate("/userprofile")}
                className="w-9 h-9 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-orange-600 text-white font-semibold"
              >
                {previewImage ? (
                  <img src={previewImage} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span>{auth?.user?.email?.[0]?.toUpperCase()}</span>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <IoMdClose /> : <IoMenu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <nav className="md:hidden bg-white shadow-lg py-4 px-6 space-y-5 text-gray-700 font-medium flex flex-col">
            {!auth.isLoggedIn && renderPublicLinks()}
            {auth.isLoggedIn && auth.role === "user" && renderUserLinks()}
            {auth.isLoggedIn && auth.role === "admin" && renderAdminLinks()}
          </nav>
        )}
      </header>

      {/* ✅ USER Bottom Nav */}
      {auth.isLoggedIn && auth.role === "user" && (
        <div className="fixed md:hidden bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 shadow-lg z-[9999]">
          <button
            onClick={() => navigate("/userprofile", { state: { tab: "recipes" } })}
            className={`flex flex-col items-center ${getActiveIcon("recipes")}`}
          >
            <FaUtensils size={20} />
            <span className="text-xs">My Recipes</span>
          </button>

          <button
            onClick={() => navigate("/userprofile", { state: { tab: "reviews" } })}
            className={`flex flex-col items-center ${getActiveIcon("reviews")}`}
          >
            <FaStar size={20} />
            <span className="text-xs">My Reviews</span>
          </button>

          <button
            onClick={() => navigate("/userprofile", { state: { tab: "favorites" } })}
            className={`flex flex-col items-center ${getActiveIcon("favorites")}`}
          >
            <FaHeart size={20} />
            <span className="text-xs">Favorites</span>
          </button>

          <button
            onClick={() => navigate("/userprofile", { state: { tab: "profile" } })}
            className={`flex flex-col items-center ${getActiveIcon("profile")}`}
          >
            <FaUser size={20} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      )}

      {/* ✅ ADMIN Bottom Nav */}
      {auth.isLoggedIn && auth.role === "admin" && (
        <div className="fixed md:hidden bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center py-3 shadow-lg z-[9999]">
          <NavLink
            to="/admindashboard"
            className={`flex flex-col items-center ${isActivePath("/admindashboard")}`}
          >
            <FaTachometerAlt size={20} />
            <span className="text-xs">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admindashboard/add"
            className={`flex flex-col items-center ${isActivePath("/admindashboard/add")}`}
          >
            <FaPlus size={20} />
            <span className="text-xs">Add</span>
          </NavLink>

          <NavLink
            to="/admindashboard/update"
            className={`flex flex-col items-center ${isActivePath("/admindashboard/update")}`}
          >
            <FaUtensils size={20} />
            <span className="text-xs">Update</span>
          </NavLink>

          <NavLink
            to="/admindashboard/delete"
            className={`flex flex-col items-center ${isActivePath("/admindashboard/delete")}`}
          >
            <FaStar size={20} />
            <span className="text-xs">Delete</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-300 hover:text-red-400 transition"
          >
            <FaUser size={20} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
