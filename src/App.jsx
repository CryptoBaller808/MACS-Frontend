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
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
        <p className="text-gray-600">Discover and collect unique digital artworks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Marketplace items would go here */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="font-semibold mb-2">Artwork Title</h3>
            <p className="text-sm text-gray-600 mb-2">by Artist Name</p>
            <div className="flex items-center justify-between">
              <span className="font-bold">250 MACS</span>
              <Button size="sm">Buy Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Discover page content
  const renderDiscoverPage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Discover</h1>
        <p className="text-gray-600">Find new artists and trending content</p>
      </div>
      
      <Tabs defaultValue="creators" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="creators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedArtists.map((artist) => (
              <Card key={artist.id}>
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
                  <p className="text-sm text-gray-600 mb-2">{artist.specialty}</p>
                  <p className="text-sm text-gray-500 mb-4">{artist.followers}</p>
                  <Button className="w-full">Follow</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="trending">
          <p>Trending content will be displayed here</p>
        </TabsContent>
        <TabsContent value="collections">
          <p>Collections will be displayed here</p>
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
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{userData.username}</h1>
                {userData.verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 mb-4">{userData.bio}</p>
              <div className="flex items-center gap-6 text-sm">
                <span><strong>{userData.followers.toLocaleString()}</strong> followers</span>
                <span><strong>{userData.following.toLocaleString()}</strong> following</span>
                <span><strong>{userData.artworks}</strong> artworks</span>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="artworks" className="w-full">
        <TabsList>
          <TabsTrigger value="artworks">Artworks</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="artworks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User's artworks would be displayed here */}
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="font-semibold mb-2">My Artwork</h3>
                <p className="text-sm text-gray-600">Created 2 days ago</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="collections">
          <p>Collections will be displayed here</p>
        </TabsContent>
        <TabsContent value="activity">
          <p>Activity feed will be displayed here</p>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Wallet page content
  const renderWalletPage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Wallet</h1>
        <p className="text-gray-600">Manage your MACS tokens and NFTs</p>
      </div>

      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-600 mb-2">
              {balances.total.macs.toLocaleString()} MACS
            </p>
            <p className="text-xl text-gray-600">
              ≈ ${balances.total.usd.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chain Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(balances).filter(([key]) => key !== 'total').map(([chain, balance]) => (
          <Card key={chain}>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold capitalize mb-2">{chain}</h3>
                <p className="text-lg font-bold">{balance.macs} MACS</p>
                <p className="text-sm text-gray-600">${balance.usd}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wallet Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => setCurrentPage('bridge')}>
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Bridge Tokens
        </Button>
        <Button variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </Button>
      </div>
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
              <nav className="hidden lg:flex items-center space-x-1">
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
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
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

