import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Zap,
  Target,
  BarChart3,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const CreatorDashboard = ({ creatorAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4" }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in production, this would come from API calls
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalEarnings: 15847.32,
      totalEarningsMACS: 7923.66,
      monthlyGrowth: 23.5,
      activeBookings: 8,
      completedBookings: 47,
      activeCampaigns: 3,
      totalBackers: 156,
      profileViews: 2847,
      followers: 892,
      avgRating: 4.8,
      responseRate: 98
    },
    earnings: {
      thisMonth: 3247.89,
      lastMonth: 2634.12,
      bookingRevenue: 8934.56,
      campaignRevenue: 4567.23,
      tipRevenue: 2345.53,
      breakdown: [
        { name: 'Bookings', value: 8934.56, color: '#8B5CF6' },
        { name: 'Campaigns', value: 4567.23, color: '#06B6D4' },
        { name: 'Tips', value: 2345.53, color: '#10B981' }
      ]
    },
    bookings: [
      {
        id: 'book-1',
        client: 'Sarah Chen',
        clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        service: 'Custom Digital Portrait',
        amount: 450,
        amountMACS: 225,
        status: 'active',
        deadline: '2025-01-15',
        progress: 65,
        lastUpdate: '2 hours ago'
      },
      {
        id: 'book-2',
        client: 'Marcus Johnson',
        clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        service: 'Album Cover Design',
        amount: 800,
        amountMACS: 400,
        status: 'review',
        deadline: '2025-01-20',
        progress: 90,
        lastUpdate: '1 day ago'
      },
      {
        id: 'book-3',
        client: 'Luna Rodriguez',
        clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        service: 'Brand Identity Package',
        amount: 1200,
        amountMACS: 600,
        status: 'pending',
        deadline: '2025-02-01',
        progress: 25,
        lastUpdate: '3 hours ago'
      }
    ],
    campaigns: [
      {
        id: 'camp-1',
        title: 'Ocean Dreams Collection',
        raised: 2847,
        goal: 5000,
        backers: 23,
        status: 'active',
        endDate: '2025-03-01',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300'
      },
      {
        id: 'camp-2',
        title: 'Interactive Music Experience',
        raised: 1250,
        goal: 8000,
        backers: 12,
        status: 'active',
        endDate: '2025-04-10',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'
      }
    ],
    analytics: {
      earningsChart: [
        { date: '2024-12-01', earnings: 1200, bookings: 800, campaigns: 400 },
        { date: '2024-12-08', earnings: 1450, bookings: 950, campaigns: 500 },
        { date: '2024-12-15', earnings: 1680, bookings: 1100, campaigns: 580 },
        { date: '2024-12-22', earnings: 1890, bookings: 1200, campaigns: 690 },
        { date: '2024-12-29', earnings: 2100, bookings: 1350, campaigns: 750 },
        { date: '2025-01-05', earnings: 2340, bookings: 1500, campaigns: 840 }
      ],
      engagementChart: [
        { date: '2024-12-01', views: 120, likes: 45, shares: 12 },
        { date: '2024-12-08', views: 145, likes: 52, shares: 15 },
        { date: '2024-12-15', views: 168, likes: 61, shares: 18 },
        { date: '2024-12-22', views: 189, likes: 68, shares: 22 },
        { date: '2024-12-29', views: 210, likes: 78, shares: 25 },
        { date: '2025-01-05', views: 234, likes: 89, shares: 28 }
      ]
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'review': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Keoni! Here's your creative journey overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold">${dashboardData.overview.totalEarnings.toLocaleString()}</p>
                  <p className="text-purple-200 text-sm">{dashboardData.overview.totalEarningsMACS.toLocaleString()} MACS</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
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
                  <p className="text-teal-100 text-sm font-medium">Active Bookings</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.activeBookings}</p>
                  <p className="text-teal-200 text-sm">{dashboardData.overview.completedBookings} completed</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{dashboardData.overview.responseRate}% response rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Campaign Backers</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.totalBackers}</p>
                  <p className="text-blue-200 text-sm">{dashboardData.overview.activeCampaigns} active campaigns</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm">67% avg. funding rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Profile Engagement</p>
                  <p className="text-2xl font-bold">{dashboardData.overview.profileViews.toLocaleString()}</p>
                  <p className="text-green-200 text-sm">{dashboardData.overview.followers} followers</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm">{dashboardData.overview.avgRating}/5.0 rating</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Earnings Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-500" />
                    Earnings Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.earnings.breakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {dashboardData.earnings.breakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {dashboardData.earnings.breakdown.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <p className="text-lg font-bold">${item.value.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Payment received</p>
                        <p className="text-sm text-gray-600">$450 from Sarah Chen</p>
                      </div>
                      <span className="text-sm text-gray-500">2h ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New campaign backer</p>
                        <p className="text-sm text-gray-600">Alex Kim backed Ocean Dreams</p>
                      </div>
                      <span className="text-sm text-gray-500">4h ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New 5-star review</p>
                        <p className="text-sm text-gray-600">Marcus Johnson left a review</p>
                      </div>
                      <span className="text-sm text-gray-500">1d ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Booking deadline reminder</p>
                        <p className="text-sm text-gray-600">Album Cover due in 5 days</p>
                      </div>
                      <span className="text-sm text-gray-500">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-500" />
                    Active Bookings
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={booking.clientAvatar} />
                            <AvatarFallback>{booking.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{booking.service}</h3>
                            <p className="text-sm text-gray-600">Client: {booking.client}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${booking.amount}</p>
                          <p className="text-sm text-gray-600">{booking.amountMACS} MACS</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className={`${getStatusColor(booking.status)} text-white`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">Due: {booking.deadline}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} className="h-2" />
                        <p className="text-xs text-gray-500">Last update: {booking.lastUpdate}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Active Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Raised</span>
                              <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                            </div>
                            <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                            <div className="flex justify-between text-sm mt-1">
                              <span className="font-medium">${campaign.raised.toLocaleString()} MACS</span>
                              <span className="text-gray-600">of ${campaign.goal.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{campaign.backers} backers</span>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {campaign.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">Ends: {campaign.endDate}</p>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Earnings Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.analytics.earningsChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                        <Area type="monotone" dataKey="earnings" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="bookings" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="campaigns" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-500" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.analytics.engagementChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="likes" stroke="#06B6D4" strokeWidth={2} />
                        <Line type="monotone" dataKey="shares" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDashboard;

