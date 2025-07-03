import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Award, 
  Target, 
  Heart, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  MessageCircle,
  Star,
  Calendar,
  Eye,
  TrendingUp,
  Globe,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Chain configurations with colors and icons
  const chainConfig = {
    'Polygon': { 
      color: 'bg-purple-500', 
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '⬟',
      name: 'Polygon'
    },
    'Solana': { 
      color: 'bg-cyan-500', 
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      icon: '◉',
      name: 'Solana'
    },
    'XRP': { 
      color: 'bg-green-500', 
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '◈',
      name: 'XRP'
    },
    'XDC': { 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '◆',
      name: 'XDC'
    }
  };

  // Activity types with icons and colors
  const activityTypes = {
    'nft_purchase': { icon: Award, color: 'bg-purple-500', label: 'NFT Purchase' },
    'campaign_contribution': { icon: Target, color: 'bg-blue-500', label: 'Campaign Backed' },
    'artist_tip': { icon: Heart, color: 'bg-pink-500', label: 'Artist Tipped' },
    'booking_created': { icon: Calendar, color: 'bg-orange-500', label: 'Booking Created' },
    'booking_completed': { icon: CheckCircle, color: 'bg-green-500', label: 'Booking Completed' },
    'profile_created': { icon: Users, color: 'bg-indigo-500', label: 'New Creator' },
    'campaign_launched': { icon: Zap, color: 'bg-yellow-500', label: 'Campaign Launched' },
    'milestone_reached': { icon: Star, color: 'bg-amber-500', label: 'Milestone Reached' },
    'cross_chain_bridge': { icon: ArrowUpRight, color: 'bg-teal-500', label: 'Cross-Chain Bridge' },
    'collection_created': { icon: Globe, color: 'bg-violet-500', label: 'Collection Created' }
  };

  // Mock real-time activity data
  const mockActivities = [
    {
      id: 'act-1',
      type: 'nft_purchase',
      user: 'Sarah Chen',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      action: 'purchased',
      target: 'Ocean Dreams #3',
      targetImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100',
      artist: 'Keoni Nakamura',
      amount: 450,
      amountMACS: 225,
      chain: 'Polygon',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      txHash: '0x1234...5678'
    },
    {
      id: 'act-2',
      type: 'campaign_contribution',
      user: 'Marcus Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      action: 'backed',
      target: 'Interactive Music Experience',
      targetImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100',
      artist: 'Leilani Martinez',
      amount: 200,
      amountMACS: 100,
      chain: 'Solana',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      txHash: '0xabcd...efgh'
    },
    {
      id: 'act-3',
      type: 'artist_tip',
      user: 'Luna Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      action: 'tipped',
      target: 'Alex Rivera',
      artist: 'Alex Rivera',
      amount: 25,
      amountMACS: 12.5,
      chain: 'XRP',
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      txHash: '0x9876...5432'
    },
    {
      id: 'act-4',
      type: 'booking_created',
      user: 'David Kim',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      action: 'booked',
      target: 'Custom Album Cover Design',
      artist: 'Sarah Chen',
      amount: 800,
      amountMACS: 400,
      chain: 'Polygon',
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      txHash: '0xfedc...ba98'
    },
    {
      id: 'act-5',
      type: 'profile_created',
      user: 'Yuki Tanaka',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      action: 'joined as',
      target: 'Digital Artist',
      chain: 'Solana',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: 'act-6',
      type: 'campaign_launched',
      user: 'Carlos Mendez',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      action: 'launched',
      target: 'Street Photography Collection',
      targetImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100',
      goal: 5000,
      chain: 'XDC',
      timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
    },
    {
      id: 'act-7',
      type: 'cross_chain_bridge',
      user: 'Emma Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
      action: 'bridged',
      amount: 1000,
      amountMACS: 1000,
      fromChain: 'Polygon',
      toChain: 'Solana',
      chain: 'Bridge',
      timestamp: new Date(Date.now() - 22 * 60 * 1000), // 22 minutes ago
      txHash: '0x1111...2222'
    },
    {
      id: 'act-8',
      type: 'milestone_reached',
      user: 'Ocean Dreams Campaign',
      action: 'reached',
      target: '50% funding milestone',
      artist: 'Keoni Nakamura',
      amount: 2500,
      amountMACS: 1250,
      chain: 'Polygon',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setActivities(mockActivities);

    // Simulate real-time updates
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate new activity every 30 seconds
        const newActivity = {
          ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
          id: `act-${Date.now()}`,
          timestamp: new Date(),
          user: ['Alex Chen', 'Maria Garcia', 'John Smith', 'Lisa Wang'][Math.floor(Math.random() * 4)]
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only latest 20
        setLastUpdate(new Date());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getChainBadge = (chain) => {
    if (chain === 'Bridge') {
      return (
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          Bridge
        </Badge>
      );
    }
    
    const config = chainConfig[chain];
    if (!config) return null;
    
    return (
      <Badge variant="secondary" className={`${config.color} text-white text-xs`}>
        <span className="mr-1">{config.icon}</span>
        {config.name}
      </Badge>
    );
  };

  const getActivityIcon = (type) => {
    const config = activityTypes[type];
    if (!config) return Activity;
    return config.icon;
  };

  const getActivityColor = (type) => {
    const config = activityTypes[type];
    return config ? config.color : 'bg-gray-500';
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'purchases') return ['nft_purchase', 'booking_created'].includes(activity.type);
    if (filter === 'campaigns') return ['campaign_contribution', 'campaign_launched', 'milestone_reached'].includes(activity.type);
    if (filter === 'social') return ['artist_tip', 'profile_created'].includes(activity.type);
    if (filter === 'bridge') return activity.type === 'cross_chain_bridge';
    return activity.chain === filter;
  });

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'nft_purchase':
        return (
          <span>
            <strong>{activity.user}</strong> purchased <strong>{activity.target}</strong> from <strong>{activity.artist}</strong> for <strong>{activity.amountMACS} MACS</strong>
          </span>
        );
      case 'campaign_contribution':
        return (
          <span>
            <strong>{activity.user}</strong> backed <strong>{activity.target}</strong> by <strong>{activity.artist}</strong> with <strong>{activity.amountMACS} MACS</strong>
          </span>
        );
      case 'artist_tip':
        return (
          <span>
            <strong>{activity.user}</strong> tipped <strong>{activity.target}</strong> <strong>{activity.amountMACS} MACS</strong>
          </span>
        );
      case 'booking_created':
        return (
          <span>
            <strong>{activity.user}</strong> booked <strong>{activity.target}</strong> with <strong>{activity.artist}</strong> for <strong>{activity.amountMACS} MACS</strong>
          </span>
        );
      case 'profile_created':
        return (
          <span>
            <strong>{activity.user}</strong> joined MACS as a <strong>{activity.target}</strong>
          </span>
        );
      case 'campaign_launched':
        return (
          <span>
            <strong>{activity.user}</strong> launched <strong>{activity.target}</strong> with a goal of <strong>{activity.goal} MACS</strong>
          </span>
        );
      case 'cross_chain_bridge':
        return (
          <span>
            <strong>{activity.user}</strong> bridged <strong>{activity.amountMACS} MACS</strong> from <strong>{activity.fromChain}</strong> to <strong>{activity.toChain}</strong>
          </span>
        );
      case 'milestone_reached':
        return (
          <span>
            <strong>{activity.user}</strong> reached <strong>{activity.target}</strong> with <strong>{activity.amountMACS} MACS</strong> raised
          </span>
        );
      default:
        return <span><strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong></span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Live Activity Feed</CardTitle>
                <p className="text-sm text-gray-600">Real-time platform activity across all chains</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isLive ? 'Live' : 'Paused'}</span>
                <span>•</span>
                <span>Updated {formatTimeAgo(lastUpdate)}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? 'Pause' : 'Resume'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActivities([...mockActivities]);
                  setLastUpdate(new Date());
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="Polygon">Polygon</TabsTrigger>
              <TabsTrigger value="Solana">Solana</TabsTrigger>
              <TabsTrigger value="bridge">Bridge</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Activity Feed */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities found for the selected filter.</p>
              </div>
            ) : (
              filteredActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const activityColor = getActivityColor(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                    {/* Activity Icon */}
                    <div className={`h-10 w-10 ${activityColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <ActivityIcon className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* User Avatar and Description */}
                          <div className="flex items-center gap-2 mb-2">
                            {activity.userAvatar && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={activity.userAvatar} />
                                <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="text-sm">
                              {getActivityDescription(activity)}
                            </div>
                          </div>
                          
                          {/* Target Image (if available) */}
                          {activity.targetImage && (
                            <div className="flex items-center gap-2 mb-2">
                              <img 
                                src={activity.targetImage} 
                                alt={activity.target}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          {/* Chain and Transaction Info */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {getChainBadge(activity.chain)}
                            
                            {activity.txHash && (
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {activity.txHash}
                              </Button>
                            )}
                            
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Amount (if applicable) */}
                        {activity.amount && (
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-sm">${activity.amount}</p>
                            <p className="text-xs text-gray-600">{activity.amountMACS} MACS</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Chain Statistics */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold mb-4">Chain Activity Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(chainConfig).map(([chain, config]) => {
                const chainActivities = activities.filter(a => a.chain === chain);
                const totalVolume = chainActivities.reduce((sum, a) => sum + (a.amountMACS || 0), 0);
                
                return (
                  <div key={chain} className={`p-3 ${config.bgColor} rounded-lg`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{config.icon}</span>
                      <span className={`font-semibold text-sm ${config.textColor}`}>{chain}</span>
                    </div>
                    <p className="text-xs text-gray-600">{chainActivities.length} activities</p>
                    <p className="text-xs text-gray-600">{totalVolume.toLocaleString()} MACS volume</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveActivityFeed;

