import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Watch from "./components/Watch";
import Watchlist from "./components/Watchlist";
import History from "./components/History";
import Settings from "./components/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Main App Layout */}
        <Route path="/" element={<Layout />}>
          
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="watch/:type/:id" element={<Watch />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;