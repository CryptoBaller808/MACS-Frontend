import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onAuthClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const navigationTabs = [
    { name: 'Feed', path: '/', icon: '📊' },
    { name: 'Marketplace', path: '/marketplace', icon: '🛒' },
    { name: 'Discover', path: '/discover', icon: '🔍' },
    { name: 'My Bookings', path: '/my-bookings', icon: '📅' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Wallet', path: '/wallet', icon: '💰' },
  ];

  const isActiveTab = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-macs-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="MUSE ART" 
                className="h-8 w-8"
              />
              <span className="font-gliker font-bold text-xl text-macs-blue-600">
                MACS
              </span>
            </Link>
          </div>

          {/* Center: Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.path}
                className={`nav-tab ${
                  isActiveTab(tab.path) 
                    ? 'nav-tab-active' 
                    : 'nav-tab-inactive'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </Link>
            ))}
          </div>

          {/* Center-Right: Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-macs-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search artists, artwork, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-macs-gray-300 rounded-lg leading-5 bg-white placeholder-macs-gray-500 focus:outline-none focus:placeholder-macs-gray-400 focus:ring-1 focus:ring-macs-blue-500 focus:border-macs-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-macs-gray-600 hover:text-macs-blue-600 hover:bg-macs-blue-50 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                </button>

                {/* Messages */}
                <button className="p-2 text-macs-gray-600 hover:text-macs-blue-600 hover:bg-macs-blue-50 rounded-lg transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </button>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm"
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={logout}
                    className="btn-ghost text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Join as Creator */}
                <button
                  onClick={() => onAuthClick('register')}
                  className="btn-secondary text-sm"
                >
                  Join as Creator
                </button>

                {/* Connect Wallet / Sign In */}
                <button
                  onClick={() => onAuthClick('login')}
                  className="btn-accent text-sm"
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-macs-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationTabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActiveTab(tab.path)
                  ? 'bg-macs-blue-600 text-white'
                  : 'text-macs-gray-600 hover:text-macs-blue-600 hover:bg-macs-blue-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

