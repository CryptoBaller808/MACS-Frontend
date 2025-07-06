import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Zap, 
  Plane, 
  Heart,
  BarChart3,
  Hash
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const sidebarSections = [
    {
      title: 'Fixed',
      icon: Home,
      path: '/fixed',
      active: true
    },
    {
      title: 'Daspeak',
      icon: Users,
      path: '/daspeak'
    },
    {
      title: 'Voltage Zones',
      icon: Zap,
      path: '/voltage-zones'
    },
    {
      title: 'Live Zaness',
      icon: TrendingUp,
      path: '/live-zaness'
    },
    {
      title: 'Fly Horfile',
      icon: Plane,
      path: '/fly-horfile'
    },
    {
      title: 'Pesssages',
      icon: Heart,
      path: '/pesssages'
    }
  ];

  const trendingItems = [
    { name: 'Senam 10', icon: BarChart3, growth: '+12%' },
    { name: 'Sool uns Trawu400', icon: TrendingUp, growth: '+8%' },
    { name: 'Sremrurato', icon: Hash, growth: '+15%' }
  ];

  const suggestedArtists = [
    {
      name: 'Tavi Lao Saya',
      type: 'Digital Sculptor',
      followers: '12.5K followers',
      verified: true,
      avatar: '👨‍🎨'
    },
    {
      name: 'Deball Offruab 10',
      type: 'Heritage Curator',
      followers: '8.2K followers',
      verified: false,
      avatar: '👩‍🎨'
    },
    {
      name: 'Sartaviamo',
      type: 'Mixed Media',
      followers: '15.7K followers',
      verified: true,
      avatar: '🎭'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-macs-gray-200 h-screen overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-6">
        {/* Navigation Sections */}
        <div className="space-y-2">
          {sidebarSections.map((section) => {
            const Icon = section.icon;
            const isActive = section.active || location.pathname === section.path;
            
            return (
              <Link
                key={section.title}
                to={section.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-macs-amber-100 text-macs-amber-700'
                    : 'text-macs-gray-600 hover:bg-macs-gray-50 hover:text-macs-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{section.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Trending Section */}
        <div>
          <h3 className="text-sm font-semibold text-macs-blue-600 uppercase tracking-wide mb-3">
            TRENSINGS
          </h3>
          <div className="space-y-2">
            {trendingItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-macs-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-macs-blue-500" />
                    <span className="text-sm text-macs-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    {item.growth}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Artists */}
        <div>
          <h3 className="text-sm font-semibold text-macs-blue-600 uppercase tracking-wide mb-3">
            SUSSESTED ARTISTS
          </h3>
          <div className="space-y-3">
            {suggestedArtists.map((artist) => (
              <div
                key={artist.name}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-macs-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-macs-blue-100 rounded-full flex items-center justify-center text-lg">
                    {artist.avatar}
                  </div>
                  {artist.verified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-medium text-macs-gray-900 truncate">
                      {artist.name}
                    </p>
                  </div>
                  <p className="text-xs text-macs-gray-500">{artist.type}</p>
                  <p className="text-xs text-macs-gray-400">{artist.followers}</p>
                </div>
                <button className="btn-primary text-xs px-3 py-1">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Streams */}
        <div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700 font-medium">LIVE</span>
              <span className="text-sm text-macs-gray-600">Live sculpting session</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700 font-medium">LIVE</span>
              <span className="text-sm text-macs-gray-600">Heritage storytelling</span>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <div className="space-y-2">
            {[
              { tag: '#DigitalArt', posts: '2.1K posts', growth: '+12%' },
              { tag: '#Heritage', posts: '1.8K posts', growth: '+8%' },
              { tag: '#Collaboration', posts: '1.5K posts', growth: '+15%' },
              { tag: '#Traditional', posts: '1.2K posts', growth: '+5%' },
              { tag: '#Contemporary', posts: '980 posts', growth: '+22%' }
            ].map((hashtag) => (
              <div
                key={hashtag.tag}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-macs-gray-50 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-macs-blue-600">{hashtag.tag}</p>
                  <p className="text-xs text-macs-gray-500">{hashtag.posts}</p>
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {hashtag.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-macs-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-macs-blue-600">12,847</p>
              <p className="text-xs text-macs-gray-600">Artists</p>
            </div>
            <div>
              <p className="text-lg font-bold text-macs-blue-600">89,234</p>
              <p className="text-xs text-macs-gray-600">Artworks</p>
            </div>
            <div>
              <p className="text-lg font-bold text-macs-blue-600">5,672</p>
              <p className="text-xs text-macs-gray-600">Collections</p>
            </div>
            <div>
              <p className="text-lg font-bold text-macs-blue-600">2,847</p>
              <p className="text-xs text-macs-gray-600">Volume (24h)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

