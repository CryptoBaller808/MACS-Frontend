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
  X
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
    type: 'creator'
  })

  // Check for first-time user
  useEffect(() => {
    const hasVisited = localStorage.getItem('macs-has-visited')
    if (!hasVisited) {
      setIsFirstTime(true)
      localStorage.setItem('macs-has-visited', 'true')
    }
  }, [])

  // Mock wallet connection
  const connectWallet = async (chain) => {
    try {
      // Simulate wallet connection
      const mockAddress = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
      setConnectedWallets(prev => ({
        ...prev,
        [chain]: mockAddress
      }))
      
      // Add success notification
      addNotification({
        type: 'success',
        title: t('auth.walletConnected'),
        message: `${chain.charAt(0).toUpperCase() + chain.slice(1)} wallet connected successfully`
      })
    } catch (error) {
      console.error('Wallet connection failed:', error)
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Failed to connect wallet. Please try again.'
      })
    }
  }

  // Add notification function
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Navigation items
  const navigationItems = [
    { id: 'feed', label: t('navigation.home'), icon: Activity },
    { id: 'marketplace', label: t('navigation.marketplace'), icon: Globe },
    { id: 'discover', label: t('navigation.discover'), icon: Users },
    { id: 'profile', label: t('navigation.profile'), icon: Users },
    { id: 'wallet', label: t('navigation.wallet'), icon: Wallet },
    { id: 'dashboard', label: t('navigation.dashboard'), icon: BarChart3 },
    { id: 'activity', label: t('navigation.activity'), icon: Clock },
    { id: 'invite', label: 'Invite Friends', icon: Gift },
    { id: 'bridge', label: t('navigation.bridge'), icon: RefreshCw }
  ]

  // Render current page content
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

  // Feed page content
  const renderFeedPage = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-teal-500 text-white p-8 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('common.welcome')} to MACS</h1>
          <p className="text-xl opacity-90 mb-6">The Muse Art Creative Sphere - Where creativity meets Web3</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => setCurrentPage('marketplace')}
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Explore Marketplace
            </Button>
            <Button 
              onClick={() => setCurrentPage('discover')}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              Discover Creators
            </Button>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Live Platform Activity</h2>
        <LiveActivityFeed limit={10} showHeader={false} />
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <AIRecommendations 
          userAddress={userAddress} 
          userType={userType}
          preferences={userPreferences}
        />
      </div>
    </div>
  )

  // Marketplace page content
  const renderMarketplacePage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t('marketplace.title')}</h1>
        <p className="text-gray-600">{t('marketplace.subtitle')}</p>
      </div>
      
      {/* Marketplace content would go here */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Card key={item} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-teal-100 rounded-t-lg"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Artwork #{item}</h3>
                <p className="text-sm text-gray-600 mb-3">By Artist Name</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">250 MACS</span>
                  <Button size="sm">Buy Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Discover page content
  const renderDiscoverPage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Discover Creators</h1>
        <p className="text-gray-600">Find amazing artists and support their creative journey</p>
      </div>
      
      {/* Creator grid would go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>A{item}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Artist {item}</h3>
                  <p className="text-sm text-gray-600">Digital Artist</p>
                  <Badge variant="secondary" className="mt-1">Verified</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Creating beautiful digital art that explores the intersection of technology and creativity.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">156 followers</span>
                <Button size="sm">Follow</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Profile page content
  const renderProfilePage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Avatar className="h-24 w-24 mx-auto mb-4">
          <AvatarImage src={userData.avatar} />
          <AvatarFallback>KN</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
        <p className="text-gray-600">Digital Artist & Creator</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button>Edit Profile</Button>
          <SocialSharing 
            type="profile"
            data={{
              title: `Check out ${userData.username} on MACS`,
              url: `https://macs.art/profile/${userData.username}`,
              description: "Amazing digital artist creating beautiful Web3 art"
            }}
          />
        </div>
      </div>
      
      {/* Profile content tabs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="collected">Collected</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-teal-100 rounded-t-lg"></div>
                  <div className="p-4">
                    <h3 className="font-semibold">Artwork #{item}</h3>
                    <p className="text-sm text-gray-600">250 MACS</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="collected">
          <p className="text-center text-gray-500 py-8">No collected items yet</p>
        </TabsContent>
        
        <TabsContent value="favorites">
          <p className="text-center text-gray-500 py-8">No favorites yet</p>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Wallet page content
  const renderWalletPage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t('wallet.title')}</h1>
        <p className="text-gray-600">Manage your multichain MACS portfolio</p>
      </div>

      {/* Total Balance */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-bold mb-1">{balances.total.macs.toLocaleString()} MACS</p>
            <p className="text-xl text-gray-600">${balances.total.usd.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Chain Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(balances).filter(([key]) => key !== 'total').map(([chain, balance]) => (
          <Card key={chain} className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize">{chain}</h3>
                <Badge variant={connectedWallets[chain] ? 'default' : 'secondary'}>
                  {connectedWallets[chain] ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{balance.macs.toLocaleString()}</p>
              <p className="text-sm text-gray-600">MACS</p>
              <p className="text-lg text-gray-600">${balance.usd.toLocaleString()}</p>
              {!connectedWallets[chain] && (
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => connectWallet(chain)}
                >
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Bridge page content
  const renderBridgePage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Cross-Chain Bridge</h1>
        <p className="text-gray-600">Transfer MACS tokens between different blockchains</p>
      </div>

      <Card className="border-0 shadow-lg max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label>From Chain</Label>
              <select className="w-full p-2 border rounded-lg mt-1">
                <option value="polygon">Polygon</option>
                <option value="solana">Solana</option>
                <option value="xrp">XRP</option>
                <option value="xdc">XDC</option>
              </select>
            </div>
            
            <div>
              <Label>To Chain</Label>
              <select className="w-full p-2 border rounded-lg mt-1">
                <option value="solana">Solana</option>
                <option value="polygon">Polygon</option>
                <option value="xrp">XRP</option>
                <option value="xdc">XDC</option>
              </select>
            </div>
            
            <div>
              <Label>Amount</Label>
              <Input 
                type="number" 
                placeholder="Enter MACS amount"
                value={bridgeAmount}
                onChange={(e) => setBridgeAmount(e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Bridge Fee:</span>
                <span>0.5 MACS + Gas</span>
              </div>
            </div>
            
            <Button className="w-full">
              Bridge Tokens
            </Button>
          </div>
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
      <NotificationSystem 
        notifications={notifications}
        onNotificationRead={(id) => {
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === id ? { ...notif, read: true } : notif
            )
          )
        }}
        onNotificationDismiss={(id) => {
          setNotifications(prev => prev.filter(notif => notif.id !== id))
        }}
      />

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
                {navigationItems.slice(0, 6).map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

              {/* Right side controls */}
              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <LanguageSwitcher variant="button" />
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>

                {/* Dark mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* User Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>KN</AvatarFallback>
                </Avatar>

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
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 space-y-1">
                {navigationItems.map((item) => {
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
              </div>
            </div>
          )}
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

