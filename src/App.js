import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GetStarted from "./components/GetStarted"; // Landing Page
import Signup from "./components/Signup"; // Signup Page
import Login from "./components/Login"; // Login Page
import Home from "./components/Home"; // Homepage after login
import UploadBook from "./components/UploadBook"; // Upload Book Page
import MyUploads from "./components/MyUploads"; // My Uploads Page
import Profile from "./components/Profile"; // Profile Page
import AboutUs from "./components/AboutUs";
import ChatRoom from "./components/ChatRoom";
import { UserProvider } from "./components/UserContext";
 // User Context

const App = () => {
  return (
    <UserProvider> {/* Wrap the app with UserProvider to manage global user state */}
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<GetStarted />} />

          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Homepage after login */}
          <Route path="/home" element={<Home />} />

          {/* Upload Book Page */}
          <Route path="/upload-book" element={<UploadBook />} />

          {/* My Uploads Page */}
          <Route path="/my-uploads" element={<MyUploads />} />

          {/* About Us Page */}
          <Route path="/about-us" element={<AboutUs />} />

          {/* Chat Room */}
          <Route path="/chat/:chatID" element={<ChatRoom />} />

          {/* Profile Page */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
