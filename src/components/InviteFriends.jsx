import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gift, 
  Copy, 
  CheckCircle, 
  Share2,
  Award,
  Star,
  Zap,
  Heart,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Link,
  QrCode,
  Download,
  ExternalLink,
  UserPlus,
  Coins,
  Trophy,
  Crown,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';

const InviteFriends = ({ userAddress, userType = 'creator' }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteStats, setInviteStats] = useState({
    totalInvites: 0,
    successfulSignups: 0,
    totalRewards: 0,
    pendingRewards: 0,
    currentTier: 'Bronze',
    nextTierProgress: 0
  });
  const [inviteHistory, setInviteHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Reward tiers and benefits
  const rewardTiers = {
    'Bronze': {
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      minInvites: 0,
      rewardPerInvite: 10,
      bonusReward: 0,
      benefits: ['10 MACS per successful invite', 'Basic referral tracking']
    },
    'Silver': {
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      minInvites: 10,
      rewardPerInvite: 15,
      bonusReward: 50,
      benefits: ['15 MACS per successful invite', '50 MACS tier bonus', 'Priority support']
    },
    'Gold': {
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      minInvites: 25,
      rewardPerInvite: 20,
      bonusReward: 150,
      benefits: ['20 MACS per successful invite', '150 MACS tier bonus', 'Exclusive events access']
    },
    'Platinum': {
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      minInvites: 50,
      rewardPerInvite: 30,
      bonusReward: 500,
      benefits: ['30 MACS per successful invite', '500 MACS tier bonus', 'VIP status', 'Custom profile badge']
    },
    'Diamond': {
      icon: Sparkles,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      minInvites: 100,
      rewardPerInvite: 50,
      bonusReward: 1000,
      benefits: ['50 MACS per successful invite', '1000 MACS tier bonus', 'Ambassador status', 'Revenue sharing']
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    // Generate unique invite code
    const code = `MACS${userAddress?.slice(-6).toUpperCase() || 'DEMO123'}`;
    setInviteCode(code);

    // Mock invite stats
    setInviteStats({
      totalInvites: 23,
      successfulSignups: 15,
      totalRewards: 225,
      pendingRewards: 45,
      currentTier: 'Silver',
      nextTierProgress: 60
    });

    // Mock invite history
    setInviteHistory([
      {
        id: 1,
        invitedUser: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        status: 'completed',
        reward: 15,
        joinDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userType: 'creator'
      },
      {
        id: 2,
        invitedUser: 'Marcus Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        status: 'completed',
        reward: 15,
        joinDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        userType: 'collector'
      },
      {
        id: 3,
        invitedUser: 'Luna Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        status: 'pending',
        reward: 15,
        joinDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userType: 'creator'
      },
      {
        id: 4,
        invitedUser: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        status: 'completed',
        reward: 15,
        joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        userType: 'collector'
      }
    ]);

    // Mock leaderboard
    setLeaderboard([
      { rank: 1, name: 'Alex Rivera', invites: 127, tier: 'Diamond', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      { rank: 2, name: 'Maria Santos', invites: 89, tier: 'Platinum', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
      { rank: 3, name: 'John Chen', invites: 67, tier: 'Platinum', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { rank: 4, name: 'Lisa Wang', invites: 45, tier: 'Gold', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
      { rank: 5, name: 'You', invites: 15, tier: 'Silver', avatar: null, isCurrentUser: true }
    ]);
  }, [userAddress]);

  const inviteUrl = `https://macs.art/invite/${inviteCode}`;
  const currentTierData = rewardTiers[inviteStats.currentTier];
  const nextTierName = Object.keys(rewardTiers)[Object.keys(rewardTiers).indexOf(inviteStats.currentTier) + 1];
  const nextTierData = nextTierName ? rewardTiers[nextTierName] : null;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform) => {
    const message = `Join me on MACS - the amazing Web3 art platform! Use my invite code ${inviteCode} and we both get MACS tokens! 🎨✨`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(inviteUrl);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inviteUrl)}`;
    window.open(qrUrl, '_blank');
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inviteStats.successfulSignups}</p>
                <p className="text-sm text-gray-600">Successful Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inviteStats.totalRewards}</p>
                <p className="text-sm text-gray-600">MACS Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 ${currentTierData.bgColor} rounded-lg flex items-center justify-center`}>
                <currentTierData.icon className={`h-6 w-6 ${currentTierData.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{inviteStats.currentTier}</p>
                <p className="text-sm text-gray-600">Current Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inviteStats.pendingRewards}</p>
                <p className="text-sm text-gray-600">Pending Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invite" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invite">Invite Friends</TabsTrigger>
          <TabsTrigger value="history">Invite History</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Tiers</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Invite Friends Tab */}
        <TabsContent value="invite" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-500" />
                Invite Friends & Earn MACS
              </CardTitle>
              <p className="text-gray-600">
                Share MACS with friends and earn {currentTierData.rewardPerInvite} MACS for each successful signup!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Tier Progress */}
              {nextTierData && (
                <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress to {nextTierName}</span>
                    <span className="text-sm text-gray-600">
                      {inviteStats.successfulSignups}/{nextTierData.minInvites} invites
                    </span>
                  </div>
                  <Progress value={(inviteStats.successfulSignups / nextTierData.minInvites) * 100} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">
                    {nextTierData.minInvites - inviteStats.successfulSignups} more invites to unlock {nextTierData.rewardPerInvite} MACS per invite!
                  </p>
                </div>
              )}

              {/* Invite Link */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Unique Invite Link</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={inviteUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Invite Code */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Invite Code</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={inviteCode}
                    readOnly
                    className="flex-1 font-mono text-lg font-bold text-center"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(inviteCode)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Social Sharing */}
              <div>
                <h4 className="text-sm font-medium mb-3">Share on Social Media</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4 text-blue-400" />
                    Twitter
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('whatsapp')}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateQRCode}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </Button>
                </div>
              </div>

              {/* How it Works */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  How It Works
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>Share your unique invite link or code with friends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>They sign up using your link and complete their profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>You both receive MACS tokens as a reward!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invite History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                Invite History
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {inviteHistory.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={invite.avatar} />
                        <AvatarFallback>{invite.invitedUser.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{invite.invitedUser}</h4>
                        <p className="text-sm text-gray-600">
                          Joined as {invite.userType} • {formatDate(invite.joinDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(invite.status)}
                      {invite.status === 'completed' && (
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+{invite.reward} MACS</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards & Tiers Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(rewardTiers).map(([tierName, tier]) => {
              const isCurrentTier = tierName === inviteStats.currentTier;
              const isUnlocked = inviteStats.successfulSignups >= tier.minInvites;
              
              return (
                <Card 
                  key={tierName} 
                  className={`border-2 ${isCurrentTier ? tier.borderColor : 'border-gray-200'} ${isCurrentTier ? tier.bgColor : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <tier.icon className={`h-6 w-6 ${tier.color}`} />
                        <CardTitle className="text-lg">{tierName}</CardTitle>
                      </div>
                      {isCurrentTier && (
                        <Badge className="bg-orange-500 hover:bg-orange-500">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{tier.minInvites}+ successful invites</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{tier.rewardPerInvite} MACS</p>
                        <p className="text-sm text-gray-600">per successful invite</p>
                        {tier.bonusReward > 0 && (
                          <p className="text-sm text-orange-600">+{tier.bonusReward} MACS tier bonus</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      {!isUnlocked && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            {tier.minInvites - inviteStats.successfulSignups} more invites to unlock
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-500" />
                Top Inviters
              </CardTitle>
              <p className="text-gray-600">See how you rank among the MACS community</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      user.isCurrentUser ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {user.rank}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} />
                        ) : (
                          <AvatarFallback>You</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <h4 className={`font-semibold ${user.isCurrentUser ? 'text-orange-600' : ''}`}>
                          {user.name}
                          {user.isCurrentUser && ' (You)'}
                        </h4>
                        <p className="text-sm text-gray-600">{user.invites} successful invites</p>
                      </div>
                    </div>
                    
                    <Badge className={`${rewardTiers[user.tier].bgColor} ${rewardTiers[user.tier].color} border-0`}>
                      {user.tier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InviteFriends;

