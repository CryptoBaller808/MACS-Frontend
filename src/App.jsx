import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ArtistDashboard from './components/ArtistDashboard';
import PublicArtistProfile from './components/PublicArtistProfile';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-blue-600 mx-auto mb-4"></div>
          <p className="text-macs-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Placeholder components for missing pages
const Marketplace = () => (
  <div className="p-8">
    <h1 className="text-h1 text-macs-blue-600 mb-4">Marketplace</h1>
    <p className="text-body text-macs-gray-600">NFT Marketplace - Buy and sell amazing artwork</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card-macs p-6">
          <div className="w-full h-48 bg-macs-gray-200 rounded-lg mb-4"></div>
          <h3 className="font-semibold text-macs-gray-900 mb-2">Artwork {i}</h3>
          <p className="text-macs-amber-600 font-bold">{42 + i} MACS</p>
          <button className="btn-accent w-full mt-4">Buy Now</button>
        </div>
      ))}
    </div>
  </div>
);

const Discover = () => (
  <div className="p-8">
    <h1 className="text-h1 text-macs-blue-600 mb-4">Discover</h1>
    <p className="text-body text-macs-gray-600 mb-8">Discover amazing artists and trending artwork</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {['Digital Art', 'Traditional', 'Mixed Media', 'Sculpture'].map((category) => (
        <div key={category} className="card-macs p-6 text-center">
          <div className="w-16 h-16 bg-macs-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="font-semibold text-macs-gray-900 mb-2">{category}</h3>
          <p className="text-sm text-macs-gray-600">Explore {category.toLowerCase()}</p>
        </div>
      ))}
    </div>
  </div>
);

const Profile = () => (
  <div className="p-8">
    <h1 className="text-h1 text-macs-blue-600 mb-4">Profile</h1>
    <p className="text-body text-macs-gray-600">Your artist profile and portfolio</p>
  </div>
);

const Wallet = () => (
  <div className="p-8">
    <h1 className="text-h1 text-macs-blue-600 mb-4">Wallet</h1>
    <p className="text-body text-macs-gray-600 mb-8">Multichain wallet for Polygon & Solana</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card-macs p-6">
        <h3 className="font-semibold text-macs-gray-900 mb-4">MACS Balance</h3>
        <p className="text-3xl font-bold text-macs-amber-600">1,247 MACS</p>
        <p className="text-sm text-macs-gray-600 mt-2">≈ $2,494 USD</p>
      </div>
      <div className="card-macs p-6">
        <h3 className="font-semibold text-macs-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Artwork Purchase</span>
            <span className="text-red-600">-45 MACS</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Sale Commission</span>
            <span className="text-green-600">+120 MACS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Settings = () => (
  <div className="p-8">
    <h1 className="text-h1 text-macs-blue-600 mb-4">Settings</h1>
    <p className="text-body text-macs-gray-600 mb-8">Account settings and preferences</p>
    <div className="max-w-2xl space-y-6">
      <div className="card-macs p-6">
        <h3 className="font-semibold text-macs-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-macs-gray-700 mb-1">Username</label>
            <input type="text" className="w-full px-3 py-2 border border-macs-gray-300 rounded-lg" placeholder="@username" />
          </div>
        </div>
      </div>
      <div className="card-macs p-6">
        <h3 className="font-semibold text-macs-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-macs-gray-700">Email notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-macs-gray-700">Push notifications</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

function AppContent() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleAuthClick = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen bg-macs-gray-50">
      <Navbar onAuthClick={handleAuthClick} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<ArtistDashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/artists/:username" element={<PublicArtistProfile />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ArtistDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

