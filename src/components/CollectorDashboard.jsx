import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Heart, 
  Star, 
  TrendingUp, 
  Eye, 
  Users, 
  Target, 
  Award,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Filter,
  Download,
  ExternalLink,
  Share2,
  MessageCircle,
  Grid3X3,
  List,
  Search,
  SortAsc,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Input } from '@/components/ui/input.jsx';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CollectorDashboard = ({ collectorAddress = "0x8901234567890123456789012345678901234567" }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in production, this would come from API calls
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalSpent: 12847.32,
      totalSpentMACS: 6423.66,
      ownedNFTs: 47,
      supportedCampaigns: 12,
      totalContributions: 8934.56,
      portfolioValue: 15234.89,
      monthlyGrowth: 18.7,
      favoriteArtists: 23
    },
    wallet: {
      balances: [
        { chain: 'Polygon', symbol: 'MACS', amount: 2847.32, usdValue: 5694.64, color: '#8B5CF6' },
        { chain: 'Solana', symbol: 'MACS', amount: 1523.45, usdValue: 3046.90, color: '#06B6D4' },
        { chain: 'XRP', symbol: 'XRP', amount: 1200.00, usdValue: 2400.00, color: '#10B981' },
        { chain: 'XDC', symbol: 'XDC', amount: 5000.00, usdValue: 1500.00, color: '#F59E0B' }
      ],
      recentTransactions: [
        {
          id: 'tx-1',
          type: 'purchase',
          description: 'Purchased "Ocean Dreams #3"',
          amount: -450,
          amountMACS: -225,
          chain: 'Polygon',
          timestamp: '2 hours ago',
          status: 'completed'
        },
        {
          id: 'tx-2',
          type: 'contribution',
          description: 'Backed "Interactive Music Experience"',
          amount: -200,
          amountMACS: -100,
          chain: 'Polygon',
          timestamp: '1 day ago',
          status: 'completed'
        },
        {
          id: 'tx-3',
          type: 'tip',
          description: 'Tipped Keoni Nakamura',
          amount: -50,
          amountMACS: -25,
          chain: 'Solana',
          timestamp: '2 days ago',
          status: 'completed'
        }
      ]
    },
    collectibles: [
      {
        id: 'nft-1',
        title: 'Ocean Dreams #3',
        artist: 'Keoni Nakamura',
        artistAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        purchasePrice: 450,
        currentValue: 520,
        chain: 'Polygon',
        rarity: 'Rare',
        purchaseDate: '2025-01-02',
        category: 'Digital Art'
      },
      {
        id: 'nft-2',
        title: 'Sunset Vibes',
        artist: 'Leilani Martinez',
        artistAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        purchasePrice: 320,
        currentValue: 380,
        chain: 'Solana',
        rarity: 'Common',
        purchaseDate: '2024-12-28',
        category: 'Photography'
      },
      {
        id: 'nft-3',
        title: 'Abstract Flow #7',
        artist: 'Marcus Johnson',
        artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        purchasePrice: 680,
        currentValue: 750,
        chain: 'Polygon',
        rarity: 'Epic',
        purchaseDate: '2024-12-25',
        category: 'Abstract'
      },
      {
        id: 'nft-4',
        title: 'Digital Portrait #12',
        artist: 'Sarah Chen',
        artistAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        purchasePrice: 280,
        currentValue: 310,
        chain: 'XRP',
        rarity: 'Common',
        purchaseDate: '2024-12-20',
        category: 'Portrait'
      }
    ],
    supportedCampaigns: [
      {
        id: 'camp-1',
        title: 'Ocean Dreams Collection',
        artist: 'Keoni Nakamura',
        artistAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300',
        contribution: 500,
        totalRaised: 2847,
        goal: 5000,
        backers: 23,
        status: 'active',
        endDate: '2025-03-01',
        rewardTier: 'NFT Collection'
      },
      {
        id: 'camp-2',
        title: 'Interactive Music Experience',
        artist: 'Leilani Martinez',
        artistAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
        contribution: 200,
        totalRaised: 1250,
        goal: 8000,
        backers: 12,
        status: 'active',
        endDate: '2025-04-10',
        rewardTier: 'Early Access'
      },
      {
        id: 'camp-3',
        title: 'Street Art Documentary',
        artist: 'Alex Rivera',
        artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300',
        contribution: 150,
        totalRaised: 4200,
        goal: 6000,
        backers: 34,
        status: 'funded',
        endDate: '2024-12-31',
        rewardTier: 'Digital Download'
      }
    ],
    analytics: {
      portfolioChart: [
        { date: '2024-12-01', value: 12000, purchases: 8000, appreciation: 4000 },
        { date: '2024-12-08', value: 12500, purchases: 8200, appreciation: 4300 },
        { date: '2024-12-15', value: 13200, purchases: 8500, appreciation: 4700 },
        { date: '2024-12-22', value: 14100, purchases: 8800, appreciation: 5300 },
        { date: '2024-12-29', value: 14800, purchases: 9100, appreciation: 5700 },
        { date: '2025-01-05', value: 15234, purchases: 9300, appreciation: 5934 }
      ]
    }
  });

  const getChainColor = (chain) => {
    switch (chain) {
      case 'Polygon': return 'bg-purple-500';
      case 'Solana': return 'bg-cyan-500';
      case 'XRP': return 'bg-green-500';
      case 'XDC': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800';
      case 'Rare': return 'bg-blue-100 text-blue-800';
      case 'Epic': return 'bg-purple-100 text-purple-800';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCollectibles = dashboardData.collectibles.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Explore your collection and discover new art.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Portfolio
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Discover Art
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Portfolio Value</p>
                  <p className="text-2xl font-bold">${dashboardData.overview.portfolioValue.toLocaleString()}</p>
                  <p className="text-purple-200 text-sm">{dashboardData.overview.ownedNFTs} collectibles</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+{dashboardData.overview.monthlyGrowth}% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">${dashboardData.overview.totalSpent.toLocaleString()}</p>
                  <p className="text-teal-200 text-sm">{dashboardData.overview.totalSpentMACS.toLocaleString()} MACS</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Award className="h-4 w-4 mr-1" />
                <span className="text-sm">Premium collector status</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Campaigns Backed</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.supportedCampaigns}</p>
                  <p className="text-blue-200 text-sm">${dashboardData.overview.totalContributions.toLocaleString()} contributed</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">Supporting {dashboardData.overview.favoriteArtists} artists</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Collection Growth</p>
                  <p className="text-2xl font-bold">+{Math.round(((dashboardData.overview.portfolioValue - dashboardData.overview.totalSpent) / dashboardData.overview.totalSpent) * 100)}%</p>
                  <p className="text-green-200 text-sm">ROI since start</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm">Top 10% collector</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="collectibles">My Collection</TabsTrigger>
            <TabsTrigger value="campaigns">Backed Campaigns</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Portfolio Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.analytics.portfolioChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                        <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="purchases" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.wallet.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`h-8 w-8 ${tx.type === 'purchase' ? 'bg-purple-500' : tx.type === 'contribution' ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
                          {tx.type === 'purchase' ? <Award className="h-4 w-4 text-white" /> :
                           tx.type === 'contribution' ? <Target className="h-4 w-4 text-white" /> :
                           <Heart className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{tx.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{tx.amountMACS} MACS</span>
                            <Badge variant="secondary" className={`${getChainColor(tx.chain)} text-white text-xs`}>
                              {tx.chain}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{tx.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collectibles Tab */}
          <TabsContent value="collectibles" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    My Collection ({filteredCollectibles.length})
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search collection..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCollectibles.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="secondary" className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={item.artistAvatar} />
                              <AvatarFallback>{item.artist.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{item.artist}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Purchase Price:</span>
                              <span className="font-medium">${item.purchasePrice}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Current Value:</span>
                              <span className={`font-medium ${item.currentValue > item.purchasePrice ? 'text-green-600' : 'text-red-600'}`}>
                                ${item.currentValue}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary" className={`${getChainColor(item.chain)} text-white text-xs`}>
                                {item.chain}
                              </Badge>
                              <span className="text-xs text-gray-500">{item.category}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCollectibles.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="secondary" className={getRarityColor(item.rarity)}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={item.artistAvatar} />
                              <AvatarFallback>{item.artist.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{item.artist}</span>
                            <Badge variant="secondary" className={`${getChainColor(item.chain)} text-white text-xs`}>
                              {item.chain}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Bought: ${item.purchasePrice}</span>
                            <span className={item.currentValue > item.purchasePrice ? 'text-green-600' : 'text-red-600'}>
                              Current: ${item.currentValue}
                            </span>
                            <span className="text-gray-500">{item.category}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Backed Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dashboardData.supportedCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <img 
                          src={campaign.image} 
                          alt={campaign.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{campaign.title}</h3>
                            <Badge variant="secondary" className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                              {campaign.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={campaign.artistAvatar} />
                              <AvatarFallback>{campaign.artist.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{campaign.artist}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Your Contribution</p>
                              <p className="font-semibold">${campaign.contribution} MACS</p>
                              <p className="text-xs text-gray-500">Reward: {campaign.rewardTier}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Campaign Progress</p>
                              <div className="flex items-center gap-2">
                                <Progress value={(campaign.totalRaised / campaign.goal) * 100} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{Math.round((campaign.totalRaised / campaign.goal) * 100)}%</span>
                              </div>
                              <p className="text-xs text-gray-500">${campaign.totalRaised.toLocaleString()} of ${campaign.goal.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Campaign Status</p>
                              <p className="font-semibold">{campaign.backers} backers</p>
                              <p className="text-xs text-gray-500">Ends: {campaign.endDate}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Campaign
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message Artist
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Wallet Balances */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-500" />
                    Wallet Balances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.wallet.balances.map((balance, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 ${balance.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{balance.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{balance.amount.toLocaleString()} {balance.symbol}</p>
                            <p className="text-sm text-gray-600">{balance.chain}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${balance.usdValue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">USD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button className="flex-1">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-500" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.wallet.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 ${tx.type === 'purchase' ? 'bg-purple-500' : tx.type === 'contribution' ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
                            {tx.type === 'purchase' ? <Award className="h-4 w-4 text-white" /> :
                             tx.type === 'contribution' ? <Target className="h-4 w-4 text-white" /> :
                             <Heart className="h-4 w-4 text-white" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tx.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={`${getChainColor(tx.chain)} text-white text-xs`}>
                                {tx.chain}
                              </Badge>
                              <span className="text-xs text-gray-500">{tx.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount)}
                          </p>
                          <p className="text-xs text-gray-600">{Math.abs(tx.amountMACS)} MACS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectorDashboard;

