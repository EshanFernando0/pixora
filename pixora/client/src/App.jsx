import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Watch from "./components/Watch";
import Watchlist from "./components/Watchlist";
import Auth from "./components/Auth";
import History from "./components/History";
import Settings from "./components/Settings";

// The "Bouncer" Component: Checks if user has a token before letting them in
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // If they aren't logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Initialize state by looking for an existing active user token
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("pixora_token"));

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* The Login Page is now its own separate URL */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Auth onAuthSuccess={handleAuthSuccess} />
          } 
        />

        {/* The Main App Layout */}
        <Route path="/" element={<Layout />}>
          
          {/* 🟢 PUBLIC ROUTES (Anyone on the internet can see these) */}
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="watch/:type/:id" element={<Watch />} />

          {/* 🔴 PROTECTED ROUTES (Requires an account) */}
          <Route 
            path="watchlist" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Watchlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="history" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            } 
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;