import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Users, Target, Heart, Share2, Filter } from 'lucide-react';
import ContributionModal from './ContributionModal';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, ending_soon, popular
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://5001-ia65z5fdlm3fg7fvw44p4-d6ef6919.manusvm.computer' 
        : 'http://localhost:5001';

      const response = await fetch(`${API_BASE_URL}/api/v1/campaigns?status=active`);
      const result = await response.json();

      if (result.success) {
        setCampaigns(result.campaigns);
      } else {
        setError('Failed to load campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCampaigns = () => {
    let filtered = [...campaigns];
    
    switch (filter) {
      case 'ending_soon':
        filtered = filtered.filter(c => c.daysRemaining <= 7);
        filtered.sort((a, b) => a.daysRemaining - b.daysRemaining);
        break;
      case 'popular':
        filtered.sort((a, b) => b.currentAmount - a.currentAmount);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const handleSupportClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsContributionModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CampaignCard = ({ campaign }) => {
    const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Campaign Image */}
        <div className="relative h-48 bg-gradient-to-br from-macs-teal-100 to-macs-amber-100">
          {campaign.imageUrl ? (
            <img 
              src={campaign.imageUrl} 
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Target className="w-12 h-12 text-macs-teal-600 mx-auto mb-2" />
                <p className="text-macs-gray-600 text-sm">Campaign Image</p>
              </div>
            </div>
          )}
          
          {/* Days Remaining Badge */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              campaign.daysRemaining <= 7 
                ? 'bg-red-100 text-red-700' 
                : 'bg-macs-teal-100 text-macs-teal-700'
            }`}>
              {campaign.daysRemaining === 0 ? 'Last day!' : `${campaign.daysRemaining} days left`}
            </div>
          </div>
        </div>

        {/* Campaign Content */}
        <div className="p-6">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-macs-dark mb-2 line-clamp-2">
              {campaign.title}
            </h3>
            <p className="text-macs-gray text-sm line-clamp-3">
              {campaign.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-macs-dark">
                {formatCurrency(campaign.currentAmount)} raised
              </span>
              <span className="text-sm text-macs-gray">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-macs-teal-500 to-macs-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-macs-gray">
                Goal: {formatCurrency(campaign.targetAmount)}
              </span>
              <span className="text-xs text-macs-gray">
                {campaign.contributionsCount || 0} supporters
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSupportClick(campaign)}
              className="flex-1 btn-primary text-sm py-2"
            >
              <Heart className="w-4 h-4 mr-2" />
              Support Project
            </button>
            <button className="btn-secondary p-2">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-macs-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-teal-600 mx-auto"></div>
            <p className="mt-4 text-macs-gray">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-macs-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchCampaigns}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="min-h-screen bg-macs-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-macs-dark mb-4">
            Fund Creative Dreams 🎨
          </h1>
          <p className="text-xl text-macs-gray max-w-3xl mx-auto">
            Support amazing artists and help bring their creative visions to life. 
            Every contribution makes a difference in the MACS community.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <DollarSign className="w-8 h-8 text-macs-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-macs-dark">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.currentAmount, 0))}
            </div>
            <div className="text-sm text-macs-gray">Total Raised</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Target className="w-8 h-8 text-macs-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-macs-dark">{campaigns.length}</div>
            <div className="text-sm text-macs-gray">Active Campaigns</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-macs-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-macs-dark">
              {campaigns.reduce((sum, c) => sum + (c.contributionsCount || 0), 0)}
            </div>
            <div className="text-sm text-macs-gray">Total Supporters</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <Calendar className="w-8 h-8 text-macs-teal-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-macs-dark">
              {campaigns.filter(c => c.daysRemaining <= 7).length}
            </div>
            <div className="text-sm text-macs-gray">Ending Soon</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'all', label: 'All Campaigns', icon: Target },
              { id: 'ending_soon', label: 'Ending Soon', icon: Calendar },
              { id: 'popular', label: 'Most Funded', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-macs-teal-600 text-white'
                      : 'text-macs-gray hover:text-macs-dark'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-macs-gray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-macs-dark mb-2">No campaigns found</h3>
            <p className="text-macs-gray">
              {filter === 'all' 
                ? 'No active campaigns at the moment. Check back soon!'
                : 'No campaigns match your current filter. Try a different filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-macs-teal-50 to-macs-amber-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-macs-dark mb-4">
              Have a Creative Project? 🌟
            </h2>
            <p className="text-macs-gray mb-6 max-w-2xl mx-auto">
              Join the MACS community and launch your own crowdfunding campaign. 
              Turn your artistic vision into reality with the support of art lovers worldwide.
            </p>
            <button className="btn-primary">
              Start Your Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default Campaigns;

