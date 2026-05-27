import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Watch from "./components/Watch";
import Watchlist from "./components/Watchlist";
import Auth from "./components/Auth";
import History from "./components/History";
import Settings from "./components/Settings";

function App() {
  // Initialize state by looking for an existing active user token
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("pixora_token"));

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // If user isn't authenticated, completely block navigation and show the Auth screen
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="watch/:type/:id" element={<Watch />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="history" element={<div className="p-10 text-2xl text-center text-gray-400 mt-20">History Coming Soon</div>} />
          <Route path="settings" element={<div className="p-10 text-2xl text-center text-gray-400 mt-20">Settings Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;