import { useState } from 'react';
import { Film, Mail, Lock, User, AlertCircle, UserCircle2 } from 'lucide-react';
import { backendAPI } from '../api/backend';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Standard Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (isLogin) {
      result = await backendAPI.login(email, password);
    } else {
      result = await backendAPI.register(username, email, password);
    }

    setLoading(false);
    handleAuthResult(result);
  };

  // Guest Pass Login
  const handleGuestLogin = async () => {
    setError("");
    setLoading(true);
    const result = await backendAPI.anonymousLogin();
    setLoading(false);
    handleAuthResult(result);
  };

  // Shared function to handle the token
  const handleAuthResult = (result) => {
    if (result && result.error) {
      setError(result.error);
    } else if (result && result.token) {
      localStorage.setItem('pixora_token', result.token);
      localStorage.setItem('pixora_user', JSON.stringify(result.user));
      onAuthSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      
      {/* Background Glows for Depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>

      {/* The Ultra-Glass Card */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4 text-white">
            <Film size={28} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-widest text-white drop-shadow-md">PIXORA</h1>
          <p className="text-gray-300 text-sm mt-2">
            {isLogin ? "Welcome back to the universe" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:bg-black/60 text-white placeholder-gray-500 transition-all shadow-inner" />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:bg-black/60 text-white placeholder-gray-500 transition-all shadow-inner" />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:bg-black/60 text-white placeholder-gray-500 transition-all shadow-inner" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] active:scale-[0.98] mt-2">
            {loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 opacity-50">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-xs text-white uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Guest Button */}
        <button 
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98]"
        >
          <UserCircle2 size={18} />
          Continue as Guest
        </button>

        <div className="text-center mt-6 text-sm text-gray-400 pt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            {isLogin ? "Create one" : "Sign in here"}
          </button>
        </div>

      </div>
    </div>
  );
}