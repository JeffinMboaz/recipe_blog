

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { logout } from "../services/userServices";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     isLoggedIn: false,
//     role: null,
//     user: null,
//   });

//   // ✅ Fetch user session on mount
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const res = await checkSession()

//         if (res.data?.isLoggedIn) {
//           const { role, user } = res.data;

//           setAuth({ isLoggedIn: true, role, user });
//           localStorage.setItem("authData", JSON.stringify({ isLoggedIn: true, role, user }));
//         } else {
//           setAuth({ isLoggedIn: false, role: null, user: null });
//           localStorage.removeItem("authData");
//         }
//       } catch (err) {
//         console.error("Session check failed:", err.message);
//         setAuth({ isLoggedIn: false, role: null, user: null });
//         localStorage.removeItem("authData");
//       }
//     };

//     checkSession();
//   }, []);

//   // ✅ Keep localStorage in sync
//   useEffect(() => {
//     if (auth.isLoggedIn) {
//       localStorage.setItem("authData", JSON.stringify(auth));
//     } else {
//       localStorage.removeItem("authData");
//     }
//   }, [auth]);

//   // ✅ Logout helper (prevents auto-login after refresh)
//   const logoutUser = async () => {
//     try {
//       await logout()
//     } catch (err) {
//       console.error("Logout API failed:", err.message);
//     } finally {
//       setAuth({ isLoggedIn: false, role: null, user: null });
//       localStorage.removeItem("authData");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState, useEffect } from "react";
import { logout, checkSession as checkUserSession } from "../services/userServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    user: null,
  });

  // ✅ Fetch user session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await checkUserSession();

        if (res.data?.isLoggedIn) {
          const { role, user } = res.data;
          setAuth({ isLoggedIn: true, role, user });
          localStorage.setItem("authData", JSON.stringify({ isLoggedIn: true, role, user }));
        } else {
          setAuth({ isLoggedIn: false, role: null, user: null });
          localStorage.removeItem("authData");
        }
      } catch (err) {
        console.error("Session check failed:", err?.response?.data || err.message);
        setAuth({ isLoggedIn: false, role: null, user: null });
        localStorage.removeItem("authData");
      }
    };

    verifySession();
  }, []);

  // ✅ Keep localStorage in sync
  useEffect(() => {
    if (auth.isLoggedIn) {
      localStorage.setItem("authData", JSON.stringify(auth));
    } else {
      localStorage.removeItem("authData");
    }
  }, [auth]);

  // ✅ Logout helper
  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout API failed:", err.message);
    } finally {
      setAuth({ isLoggedIn: false, role: null, user: null });
      localStorage.removeItem("authData");
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
