import { useState, useEffect } from 'react'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Settings, 
  Copy, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Plus,
  Minus,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Users,
  Gift,
  Bell,
  HelpCircle,
  Menu,
  X,
  Heart,
  MessageCircle,
  Eye,
  Share,
  Bookmark,
  Home,
  MessageSquare,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Import new Phase 5 components
import CreatorDashboard from './components/CreatorDashboard.jsx'
import CollectorDashboard from './components/CollectorDashboard.jsx'
import LiveActivityFeed from './components/LiveActivityFeed.jsx'
import GuidedOnboarding from './components/GuidedOnboarding.jsx'
import NotificationSystem from './components/NotificationSystem.jsx'
import SocialSharing from './components/SocialSharing.jsx'
import InviteFriends from './components/InviteFriends.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'

// Import new Phase 6 AI components
import AIRecommendations from './components/AIRecommendations.jsx'
import EnhancedSearch from './components/EnhancedSearch.jsx'
import { LanguageProvider, useTranslation } from './contexts/LanguageContext.jsx'

import macsLogo from './assets/MuseArtLogo.png'
import './App.css'

// Main App Component wrapped with Language Provider
function AppContent() {
  const { t } = useTranslation()
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('feed')
  const [selectedChain, setSelectedChain] = useState('polygon')
  const [connectedWallets, setConnectedWallets] = useState({
    polygon: null,
    solana: null,
    xrp: null,
    xdc: null
  })
  const [balances, setBalances] = useState({
    polygon: { macs: 1250.75, usd: 2501.50 },
    solana: { macs: 875.25, usd: 1750.50 },
    xrp: { macs: 450.00, usd: 900.00 },
    xdc: { macs: 320.50, usd: 641.00 },
    total: { macs: 2896.50, usd: 5792.00 }
  })
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [userType, setUserType] = useState('creator') // 'creator' or 'collector'
  const [userAddress, setUserAddress] = useState('0x1234...5678')
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Phase 6 AI-related state
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [userPreferences, setUserPreferences] = useState({
    categories: ['digital_art', 'photography'],
    priceRange: '100-500',
    chains: ['polygon', 'solana']
  })

  // Mock user data
  const [userData, setUserData] = useState({
    username: 'keoni_art',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    verified: true,
    followers: 12500,
    following: 890,
    artworks: 156,
    collections: 23,
    totalSales: 45600,
    bio: 'Digital artist exploring the intersection of traditional Hawaiian culture and modern technology. Creating immersive experiences that bridge worlds.',
    location: 'Honolulu, Hawaii',
    website: 'https://keoni.art',
    specialties: ['Digital Art', 'NFT Collections', 'Cultural Heritage'],
    achievements: ['Top Creator 2024', 'Heritage Ambassador', 'Community Choice Award']
  })

  // Navigation items
  const navigationItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: Globe },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'bridge', label: 'Bridge', icon: ArrowUpRight },
    { id: 'invite', label: 'Invite Friends', icon: Gift }
  ]

  // Mock data for trending and suggested artists
  const trendingItems = [
    { id: 1, title: 'Senam 10', icon: '📊' },
    { id: 2, title: 'Sool uns Trawu400', icon: '🎯' },
    { id: 3, title: 'Sremrurato', icon: '🎨' }
  ]

  const suggestedArtists = [
    {
      id: 1,
      name: 'Tavi Lao Saya',
      specialty: 'Digital Sculptor',
      followers: '12.5K followers',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 2,
      name: 'Deball Offruab 10',
      specialty: 'Heritage Curator',
      followers: '8.2K followers',
      verified: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    {
      id: 3,
      name: 'Sartaviamo',
      specialty: 'Mixed Media',
      followers: '15.7K followers',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  ]

  // Mock feed posts
  const feedPosts = [
    {
      id: 1,
      artist: 'Urri aiSive',
      username: 'Sio4brrained',
      location: "Côte d'Ivoire",
      timeAgo: '2 hours ago',
      verified: true,
      title: "Hnak in qir's Cilier Sonwar",
      description: 'Traditional ceramic vase with intricate blue and orange patterns, representing the rich cultural heritage of West African pottery traditions.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
      tags: ['Ceramics', 'Traditional', 'Heritage'],
      likes: 253,
      comments: 89,
      views: 21020,
      price: null,
      action: 'Make Offer'
    },
    {
      id: 2,
      artist: 'Artist Name',
      username: 'username',
      location: 'Romania',
      timeAgo: '5 hours ago',
      verified: true,
      title: 'Collaboration With Colo samatel',
      description: 'Mixed media artwork exploring the intersection of digital and traditional art forms, featuring vibrant colors and geometric patterns.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
      tags: ['Digital Art', 'Collaboration', 'Mixed Media'],
      likes: 147,
      comments: 32,
      views: 9720,
      price: null,
      action: 'Bid Now'
    },
    {
      id: 3,
      artist: 'Artist Name',
      username: 'username',
      location: 'Singapore',
      timeAgo: '1 day ago',
      verified: false,
      title: 'Buverness are fre including prodeseoiv both ang lekl',
      description: 'Contemporary sculpture installation that challenges perceptions of space and form through innovative use of materials and lighting.',
      image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600',
      tags: ['Sculpture', 'Installation', 'Contemporary'],
      likes: 89,
      comments: 15,
      views: 4520,
      price: '320 MACS',
      action: 'Buy Now'
    },
    {
      id: 4,
      artist: 'Artist Name',
      username: 'username',
      location: 'Netherlands',
      timeAgo: '3 days ago',
      verified: true,
      title: 'Heritage Zone: Traditional Weaving',
      description: 'Documenting the ancient art of traditional weaving techniques passed down through generations in rural communities.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      tags: ['Heritage', 'Weaving', 'Documentary'],
      likes: 312,
      comments: 67,
      views: 15840,
      price: null,
      action: 'Support'
    }
  ]

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return userType === 'creator' ? (
          <CreatorDashboard userAddress={userAddress} />
        ) : (
          <CollectorDashboard userAddress={userAddress} />
        )
      case 'activity':
        return <LiveActivityFeed userAddress={userAddress} />
      case 'invite':
        return <InviteFriends userAddress={userAddress} userType={userType} />
      case 'feed':
        return renderFeedPage()
      case 'marketplace':
        return renderMarketplacePage()
      case 'discover':
        return renderDiscoverPage()
      case 'profile':
        return renderProfilePage()
      case 'wallet':
        return renderWalletPage()
      case 'bridge':
        return renderBridgePage()
      default:
        return renderFeedPage()
    }
  }

  // Feed page content - Approved Design Layout
  const renderFeedPage = () => (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 space-y-6">
        {/* Navigation Menu */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-amber-100 rounded-lg">
                <Home className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800">Fixed</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Daspeak</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Zap className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Voltage Zones</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <Globe className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Live Zaness</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <ArrowUpRight className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Fly Horfile</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Pesssages</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-800">TRENSINGS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {trendingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggested Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-800">SUSSESTED ARTISTS</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {suggestedArtists.map((artist) => (
                <div key={artist.id} className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={artist.avatar} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{artist.name}</span>
                      {artist.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{artist.specialty}</p>
                    <p className="text-xs text-gray-500">{artist.followers}</p>
                    <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                      Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Feed Content */}
      <div className="flex-1 space-y-6">
        {feedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{post.artist.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.artist}</span>
                    {post.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {post.location} • {post.timeAgo}
                  </p>
                </div>
              </div>

              {/* Post Title */}
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>

              {/* Post Description */}
              <p className="text-gray-700 mb-4">{post.description}</p>

              {/* Post Image */}
              <div className="mb-4">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{post.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{post.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {post.price && (
                    <span className="font-semibold text-orange-600">{post.price}</span>
                  )}
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    {post.action}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="w-64 space-y-6">
        {/* Live Events */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
              <div>
                <p className="text-sm font-medium">Live sculpting session</p>
                <p className="text-xs text-gray-600">247 watching</p>
              </div>
              <div>
                <p className="text-sm font-medium">Heritage storytelling</p>
                <p className="text-xs text-gray-600">189 watching</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Hashtags */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">#DigitalArt</span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">2.1K posts</p>
                  <p className="text-xs text-green-600">+12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">#Heritage</span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">1.8K posts</p>
                  <p className="text-xs text-green-600">+8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">#Collaboration</span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">1.5K posts</p>
                  <p className="text-xs text-green-600">+15%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">#Traditional</span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">1.2K posts</p>
                  <p className="text-xs text-green-600">+5%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">#Contemporary</span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">980 posts</p>
                  <p className="text-xs text-green-600">+22%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Artists</span>
                <span className="text-sm font-medium">12,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Artworks</span>
                <span className="text-sm font-medium">89,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Collections</span>
                <span className="text-sm font-medium">5,672</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Volume (24h)</span>
                <span className="text-sm font-medium">2,847 MACS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Marketplace page content
  const renderMarketplacePage = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
        <p className="text-gray-600">Discover and collect unique digital artworks</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">All Categories</Button>
          <Button variant="outline" size="sm">Digital Art</Button>
          <Button variant="outline" size="sm">Photography</Button>
          <Button variant="outline" size="sm">3D Art</Button>
          <Button variant="outline" size="sm">Music</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Price: Low to High</Button>
          <Button variant="outline" size="sm">Recently Listed</Button>
        </div>
      </div>

      {/* Trending Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2,847</div>
              <div className="text-sm text-gray-600">Total Volume (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">New Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Sales Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Artworks */}
      <div>
        <h2 className="text-xl font-bold mb-4">Featured Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              id: 1,
              title: "Digital Dreams #001",
              artist: "CryptoArtist",
              price: "250 MACS",
              image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
              likes: 45,
              verified: true
            },
            {
              id: 2,
              title: "Neon Cityscape",
              artist: "UrbanVisions",
              price: "180 MACS",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
              likes: 32,
              verified: false
            },
            {
              id: 3,
              title: "Abstract Emotions",
              artist: "ModernMuse",
              price: "320 MACS",
              image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400",
              likes: 67,
              verified: true
            },
            {
              id: 4,
              title: "Digital Portrait",
              artist: "PixelMaster",
              price: "420 MACS",
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
              likes: 89,
              verified: true
            },
            {
              id: 5,
              title: "Cyber Landscape",
              artist: "FutureArt",
              price: "275 MACS",
              image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
              likes: 54,
              verified: false
            },
            {
              id: 6,
              title: "Geometric Harmony",
              artist: "MathArtist",
              price: "195 MACS",
              image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
              likes: 38,
              verified: true
            }
          ].map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={artwork.image} 
                  alt={artwork.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <Heart className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{artwork.title}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm text-gray-600">by {artwork.artist}</span>
                  {artwork.verified && (
                    <CheckCircle className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600">{artwork.price}</span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-gray-600">{artwork.likes}</span>
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Artworks</Button>
      </div>
    </div>
  )

  // Discover page content
  const renderDiscoverPage = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Discover</h1>
        <p className="text-gray-600">Find new artists and trending content</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">12,847</div>
            <div className="text-sm text-gray-600">Active Creators</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">89,234</div>
            <div className="text-sm text-gray-600">Total Artworks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">5,672</div>
            <div className="text-sm text-gray-600">Collections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">2,847</div>
            <div className="text-sm text-gray-600">Daily Volume</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">All Categories</Button>
        <Button variant="outline" size="sm">Digital Art</Button>
        <Button variant="outline" size="sm">Photography</Button>
        <Button variant="outline" size="sm">3D Art</Button>
        <Button variant="outline" size="sm">Music</Button>
        <Button variant="outline" size="sm">Gaming</Button>
      </div>
      
      <Tabs defaultValue="creators" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creators">Top Creators</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="creators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ...suggestedArtists,
              {
                id: 4,
                name: 'Elena Rodriguez',
                specialty: 'Digital Photographer',
                followers: '18.3K followers',
                verified: true,
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
                artworks: 89,
                sales: '1.2K MACS'
              },
              {
                id: 5,
                name: 'Marcus Chen',
                specialty: '3D Artist',
                followers: '22.1K followers',
                verified: true,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                artworks: 156,
                sales: '3.4K MACS'
              },
              {
                id: 6,
                name: 'Sofia Andersson',
                specialty: 'Concept Artist',
                followers: '14.7K followers',
                verified: false,
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
                artworks: 67,
                sales: '890 MACS'
              }
            ].map((artist) => (
              <Card key={artist.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={artist.avatar} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <h3 className="font-semibold">{artist.name}</h3>
                    {artist.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{artist.specialty}</p>
                  <p className="text-sm text-gray-500 mb-2">{artist.followers}</p>
                  {artist.artworks && (
                    <div className="flex justify-center gap-4 text-xs text-gray-600 mb-4">
                      <span>{artist.artworks} artworks</span>
                      <span>{artist.sales} earned</span>
                    </div>
                  )}
                  <Button className="w-full">Follow</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: '#DigitalArt',
                posts: '2.1K posts',
                growth: '+12%',
                color: 'bg-blue-500'
              },
              {
                id: 2,
                title: '#Heritage',
                posts: '1.8K posts',
                growth: '+8%',
                color: 'bg-green-500'
              },
              {
                id: 3,
                title: '#Collaboration',
                posts: '1.5K posts',
                growth: '+15%',
                color: 'bg-purple-500'
              },
              {
                id: 4,
                title: '#Traditional',
                posts: '1.2K posts',
                growth: '+5%',
                color: 'bg-orange-500'
              },
              {
                id: 5,
                title: '#Contemporary',
                posts: '980 posts',
                growth: '+22%',
                color: 'bg-pink-500'
              },
              {
                id: 6,
                title: '#Photography',
                posts: '856 posts',
                growth: '+18%',
                color: 'bg-teal-500'
              }
            ].map((trend) => (
              <Card key={trend.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${trend.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <span className="text-white font-bold">#</span>
                  </div>
                  <h3 className="font-semibold mb-2">{trend.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{trend.posts}</p>
                  <p className="text-sm text-green-600 font-medium">{trend.growth}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="collections" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: 'Digital Dreamscapes',
                creator: 'CryptoArtist',
                items: 24,
                floorPrice: '150 MACS',
                image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400'
              },
              {
                id: 2,
                title: 'Urban Visions',
                creator: 'CityArt',
                items: 18,
                floorPrice: '200 MACS',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400'
              },
              {
                id: 3,
                title: 'Abstract Emotions',
                creator: 'ModernMuse',
                items: 32,
                floorPrice: '120 MACS',
                image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400'
              }
            ].map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{collection.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {collection.creator}</p>
                  <div className="flex justify-between text-sm">
                    <span>{collection.items} items</span>
                    <span className="font-medium">Floor: {collection.floorPrice}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Profile page content
  const renderProfilePage = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{userData.username}</h1>
                {userData.verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{userData.bio}</p>
              <div className="flex items-center gap-6 text-sm mb-4">
                <span><strong>{userData.followers.toLocaleString()}</strong> followers</span>
                <span><strong>{userData.following.toLocaleString()}</strong> following</span>
                <span><strong>{userData.artworks}</strong> artworks</span>
                <span><strong>{userData.collections}</strong> collections</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {userData.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">{specialty}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>{userData.location}</span>
                <ExternalLink className="h-4 w-4 ml-2" />
                <a href={userData.website} className="text-blue-600 hover:underline">
                  {userData.website}
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button>Edit Profile</Button>
              <Button variant="outline">Share Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userData.totalSales.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Sales (MACS)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userData.artworks}</div>
            <div className="text-sm text-gray-600">Artworks Created</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userData.collections}</div>
            <div className="text-sm text-gray-600">Collections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{userData.followers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userData.achievements.map((achievement, index) => (
              <Badge key={index} className="bg-yellow-100 text-yellow-800">
                🏆 {achievement}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="artworks" className="w-full">
        <TabsList>
          <TabsTrigger value="artworks">Artworks ({userData.artworks})</TabsTrigger>
          <TabsTrigger value="collections">Collections ({userData.collections})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="artworks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "Hawaiian Sunset Dreams",
                price: "450 MACS",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
                likes: 89,
                created: "2 days ago"
              },
              {
                id: 2,
                title: "Digital Aloha",
                price: "320 MACS",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
                likes: 67,
                created: "1 week ago"
              },
              {
                id: 3,
                title: "Island Vibes",
                price: "280 MACS",
                image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400",
                likes: 45,
                created: "2 weeks ago"
              },
              {
                id: 4,
                title: "Ocean Depths",
                price: "380 MACS",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                likes: 92,
                created: "3 weeks ago"
              },
              {
                id: 5,
                title: "Tropical Paradise",
                price: "520 MACS",
                image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
                likes: 134,
                created: "1 month ago"
              },
              {
                id: 6,
                title: "Cultural Heritage",
                price: "650 MACS",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
                likes: 156,
                created: "1 month ago"
              }
            ].map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{artwork.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-orange-600">{artwork.price}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-gray-600">{artwork.likes}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{artwork.created}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="collections">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                title: "Hawaiian Heritage",
                items: 12,
                floorPrice: "280 MACS",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"
              },
              {
                id: 2,
                title: "Digital Landscapes",
                items: 8,
                floorPrice: "320 MACS",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400"
              },
              {
                id: 3,
                title: "Cultural Fusion",
                items: 15,
                floorPrice: "450 MACS",
                image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400"
              }
            ].map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{collection.title}</h3>
                  <div className="flex justify-between text-sm">
                    <span>{collection.items} items</span>
                    <span className="font-medium">Floor: {collection.floorPrice}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: "sale",
                title: "Sold 'Hawaiian Sunset Dreams'",
                amount: "450 MACS",
                time: "2 hours ago"
              },
              {
                id: 2,
                type: "mint",
                title: "Minted 'Digital Aloha'",
                amount: null,
                time: "1 day ago"
              },
              {
                id: 3,
                type: "follow",
                title: "Gained 50 new followers",
                amount: null,
                time: "3 days ago"
              },
              {
                id: 4,
                type: "sale",
                title: "Sold 'Island Vibes'",
                amount: "280 MACS",
                time: "1 week ago"
              }
            ].map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <span className="font-bold text-green-600">{activity.amount}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About {userData.username}</h3>
                  <p className="text-gray-600">{userData.bio}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <a href={userData.website} className="text-blue-600 hover:underline">
                        {userData.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Wallet page content
  const renderWalletPage = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Wallet</h1>
        <p className="text-gray-600">Manage your MACS tokens and NFTs across multiple chains</p>
      </div>

      {/* Network Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Network Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'polygon', name: 'Polygon', color: 'bg-purple-500', active: selectedChain === 'polygon' },
              { id: 'solana', name: 'Solana', color: 'bg-green-500', active: selectedChain === 'solana' },
              { id: 'xrp', name: 'XRP Ledger', color: 'bg-blue-500', active: selectedChain === 'xrp' },
              { id: 'xdc', name: 'XDC Network', color: 'bg-yellow-500', active: selectedChain === 'xdc' }
            ].map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedChain(network.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  network.active 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 ${network.color} rounded-full mx-auto mb-2`}></div>
                <div className="text-sm font-medium">{network.name}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Portfolio Value</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-orange-600 mb-2">
              {balances.total.macs.toLocaleString()} MACS
            </p>
            <p className="text-2xl text-gray-600">
              ≈ ${balances.total.usd.toLocaleString()}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="flex flex-col gap-1 h-auto py-3">
              <ArrowUpRight className="h-5 w-5" />
              <span className="text-xs">Send</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3">
              <ArrowDownLeft className="h-5 w-5" />
              <span className="text-xs">Receive</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3" onClick={() => setCurrentPage('bridge')}>
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs">Bridge</span>
            </Button>
            <Button variant="outline" className="flex flex-col gap-1 h-auto py-3">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chain Balances */}
      <div>
        <h2 className="text-xl font-bold mb-4">Chain Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(balances).filter(([key]) => key !== 'total').map(([chain, balance]) => (
            <Card key={chain} className={`cursor-pointer transition-all ${selectedChain === chain ? 'ring-2 ring-orange-500' : 'hover:shadow-lg'}`} onClick={() => setSelectedChain(chain)}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${
                      chain === 'polygon' ? 'bg-purple-500' :
                      chain === 'solana' ? 'bg-green-500' :
                      chain === 'xrp' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <h3 className="font-semibold capitalize">{chain}</h3>
                  </div>
                  <p className="text-lg font-bold">{balance.macs} MACS</p>
                  <p className="text-sm text-gray-600">${balance.usd}</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Wallet Content Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {[
              {
                id: 1,
                type: 'send',
                amount: '-250 MACS',
                to: '0x1234...5678',
                time: '2 hours ago',
                status: 'completed'
              },
              {
                id: 2,
                type: 'receive',
                amount: '+450 MACS',
                from: '0x9876...4321',
                time: '1 day ago',
                status: 'completed'
              },
              {
                id: 3,
                type: 'bridge',
                amount: '100 MACS',
                from: 'Polygon',
                to: 'Solana',
                time: '3 days ago',
                status: 'completed'
              },
              {
                id: 4,
                type: 'mint',
                amount: 'NFT Minted',
                collection: 'Hawaiian Heritage',
                time: '1 week ago',
                status: 'completed'
              }
            ].map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'send' ? 'bg-red-100' :
                        tx.type === 'receive' ? 'bg-green-100' :
                        tx.type === 'bridge' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {tx.type === 'send' && <ArrowUpRight className="h-5 w-5 text-red-600" />}
                        {tx.type === 'receive' && <ArrowDownLeft className="h-5 w-5 text-green-600" />}
                        {tx.type === 'bridge' && <RefreshCw className="h-5 w-5 text-blue-600" />}
                        {tx.type === 'mint' && <Plus className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-600">{tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        tx.type === 'send' ? 'text-red-600' :
                        tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {tx.amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {tx.to && `To: ${tx.to}`}
                        {tx.from && `From: ${tx.from}`}
                        {tx.collection && `Collection: ${tx.collection}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="nfts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My NFTs</h3>
            <Button variant="outline" size="sm">Create NFT</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                title: "Hawaiian Sunset #001",
                collection: "Hawaiian Heritage",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300"
              },
              {
                id: 2,
                title: "Digital Aloha #042",
                collection: "Digital Landscapes",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300"
              },
              {
                id: 3,
                title: "Island Vibes #123",
                collection: "Cultural Fusion",
                image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=300"
              },
              {
                id: 4,
                title: "Ocean Dreams #089",
                collection: "Hawaiian Heritage",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300"
              }
            ].map((nft) => (
              <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={nft.image} 
                  alt={nft.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm mb-1">{nft.title}</h4>
                  <p className="text-xs text-gray-600">{nft.collection}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="staking" className="space-y-4">
          <div className="text-center py-8">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Staking Coming Soon</h3>
            <p className="text-gray-600 mb-4">Earn rewards by staking your MACS tokens</p>
            <Button variant="outline">Learn More</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-approve transactions</h4>
                  <p className="text-sm text-gray-600">Automatically approve small transactions</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Security settings</h4>
                  <p className="text-sm text-gray-600">Manage your wallet security</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Connected apps</h4>
                  <p className="text-sm text-gray-600">View and manage connected applications</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Bridge page content
  const renderBridgePage = () => (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Bridge Tokens</h1>
        <p className="text-gray-600">Transfer MACS tokens between chains</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={bridgeAmount}
              onChange={(e) => setBridgeAmount(e.target.value)}
            />
          </div>
          
          <div>
            <Label>From Chain</Label>
            <select className="w-full p-2 border rounded-md">
              <option value="polygon">Polygon</option>
              <option value="solana">Solana</option>
              <option value="xrp">XRP</option>
              <option value="xdc">XDC</option>
            </select>
          </div>

          <div>
            <Label>To Chain</Label>
            <select className="w-full p-2 border rounded-md">
              <option value="solana">Solana</option>
              <option value="polygon">Polygon</option>
              <option value="xrp">XRP</option>
              <option value="xdc">XDC</option>
            </select>
          </div>

          <Button className="w-full">
            Bridge Tokens
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Guided Onboarding for first-time users */}
      {isFirstTime && (
        <GuidedOnboarding 
          userType={userType}
          onComplete={() => setIsFirstTime(false)}
          onSkip={() => setIsFirstTime(false)}
        />
      )}

      {/* Notification System */}
      <NotificationSystem />

      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img src={macsLogo} alt="MACS" className="h-16" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent">
                    MACS
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Muse Art Creative Sphere</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigationItems.slice(0, 5).map((item) => {
                  const Icon = item.icon
                  const colors = {
                    feed: 'bg-orange-500 text-white',
                    marketplace: 'bg-blue-500 text-white',
                    discover: 'bg-yellow-500 text-white',
                    profile: 'bg-purple-500 text-white',
                    wallet: 'bg-teal-500 text-white'
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === item.id
                          ? colors[item.id] || 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:block">
                  <Input
                    placeholder="Search with disoulting"
                    className="w-64"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  🔔
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="sm">
                  💬
                </Button>

                {/* Join as Creator */}
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Join as Creator
                </Button>

                {/* Connect Wallet */}
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  Connect Wallet
                </Button>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                <nav className="space-y-2">
                  {navigationItems.slice(0, 5).map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === item.id
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentPage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2024 MACS - Muse Art Creative Sphere. Empowering creators worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Main App component with Language Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App

