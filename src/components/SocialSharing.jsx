import React, { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Instagram, 
  Facebook, 
  Link, 
  Copy, 
  CheckCircle,
  ExternalLink,
  Download,
  QrCode,
  MessageCircle,
  Mail,
  Users,
  Award,
  Target,
  Calendar,
  Heart,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';

const SocialSharing = ({ 
  type = 'profile', // 'profile', 'nft', 'campaign', 'booking'
  data = {},
  onShare = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Generate sharing content based on type
  const getShareContent = () => {
    const baseUrl = 'https://macs.art';
    
    switch (type) {
      case 'profile':
        return {
          title: `Check out ${data.name || 'this amazing artist'} on MACS!`,
          description: `Discover incredible art and support talented creators in the Web3 ecosystem. ${data.bio || ''}`,
          url: `${baseUrl}/profile/${data.address || data.id}`,
          image: data.avatar || data.coverImage,
          hashtags: ['MACS', 'Web3Art', 'NFT', 'DigitalArt', 'Blockchain']
        };
      
      case 'nft':
        return {
          title: `"${data.title || 'Amazing NFT'}" by ${data.artist || 'Artist'}`,
          description: `Discover this unique piece on MACS - the multichain art platform. ${data.description || ''}`,
          url: `${baseUrl}/nft/${data.id}`,
          image: data.image,
          hashtags: ['MACS', 'NFT', 'DigitalArt', 'Collectible', data.artist?.replace(/\s+/g, '') || 'Art']
        };
      
      case 'campaign':
        return {
          title: `Support "${data.title || 'Creative Campaign'}" on MACS!`,
          description: `Help fund this amazing creative project. ${Math.round((data.raised / data.goal) * 100)}% funded so far! ${data.description || ''}`,
          url: `${baseUrl}/campaign/${data.id}`,
          image: data.image,
          hashtags: ['MACS', 'Crowdfunding', 'SupportArtists', 'Web3', 'CreativeProjects']
        };
      
      case 'booking':
        return {
          title: `Book ${data.artist || 'this talented artist'} on MACS!`,
          description: `Professional art services with secure payments and escrow protection. ${data.description || ''}`,
          url: `${baseUrl}/booking/${data.id}`,
          image: data.image || data.artistAvatar,
          hashtags: ['MACS', 'BookArtist', 'Commission', 'DigitalArt', 'Web3Services']
        };
      
      default:
        return {
          title: 'Discover Amazing Art on MACS!',
          description: 'The Muse Art Creative Sphere - where artists connect, create, and thrive in Web3.',
          url: baseUrl,
          image: '/macs-logo.png',
          hashtags: ['MACS', 'Web3Art', 'NFT', 'DigitalArt']
        };
    }
  };

  const shareContent = getShareContent();
  const fullMessage = customMessage || shareContent.description;

  // Social platform sharing URLs
  const getSharingUrls = () => {
    const encodedUrl = encodeURIComponent(shareContent.url);
    const encodedTitle = encodeURIComponent(shareContent.title);
    const encodedDescription = encodeURIComponent(fullMessage);
    const encodedHashtags = encodeURIComponent(shareContent.hashtags.join(','));

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${encodedHashtags}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedDescription}`,
      whatsapp: `https://wa.me/?text=${encodedDescription}%20${encodedUrl}`
    };
  };

  const sharingUrls = getSharingUrls();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform) => {
    const url = sharingUrls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      onShare(platform, shareContent);
    }
  };

  const downloadImage = () => {
    if (shareContent.image) {
      const link = document.createElement('a');
      link.href = shareContent.image;
      link.download = `macs-${type}-${Date.now()}.jpg`;
      link.click();
    }
  };

  const generateQRCode = () => {
    // In a real implementation, you'd use a QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareContent.url)}`;
    window.open(qrUrl, '_blank');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Share Modal */}
      <Card className="relative w-full max-w-md mx-4 border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-orange-500" />
              Share {type.charAt(0).toUpperCase() + type.slice(1)}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3">
              {shareContent.image && (
                <img 
                  src={shareContent.image} 
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">{shareContent.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{shareContent.description}</p>
                <p className="text-xs text-blue-600 mt-1">{shareContent.url}</p>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Message (Optional)</label>
            <Textarea
              placeholder="Add your own message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Social Platforms */}
          <div>
            <h4 className="text-sm font-medium mb-3">Share to Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-blue-400 rounded flex items-center justify-center">
                  <Twitter className="h-3 w-3 text-white" />
                </div>
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center">
                  <Facebook className="h-3 w-3 text-white" />
                </div>
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://www.instagram.com/', '_blank')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <Instagram className="h-3 w-3 text-white" />
                </div>
                Instagram
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-blue-700 rounded flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Messaging Apps */}
          <div>
            <h4 className="text-sm font-medium mb-3">Share via Messaging</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-green-500 rounded flex items-center justify-center">
                  <MessageCircle className="h-3 w-3 text-white" />
                </div>
                WhatsApp
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare('telegram')}
                className="flex items-center gap-2 justify-start"
              >
                <div className="h-5 w-5 bg-blue-500 rounded flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                Telegram
              </Button>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <h4 className="text-sm font-medium mb-3">Copy Link</h4>
            <div className="flex items-center gap-2">
              <Input
                value={shareContent.url}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(shareContent.url)}
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

          {/* Additional Options */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={generateQRCode}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
            
            {shareContent.image && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadImage}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Image
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('reddit')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Reddit
            </Button>
          </div>

          {/* Hashtags */}
          <div>
            <h4 className="text-sm font-medium mb-2">Suggested Hashtags</h4>
            <div className="flex flex-wrap gap-1">
              {shareContent.hashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-orange-100"
                  onClick={() => copyToClipboard(`#${hashtag}`)}
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialSharing;

