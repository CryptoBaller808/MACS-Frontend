import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, Users, Target, Heart, Share2, Filter, Search } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'ending_soon') return matchesSearch && campaign.daysRemaining <= 7;
    if (filter === 'most_funded') return matchesSearch && campaign.progressPercentage >= 50;
    return matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-macs-teal-500';
    if (percentage >= 25) return 'bg-macs-amber-500';
    return 'bg-gray-400';
  };

  const getUrgencyBadge = (daysRemaining) => {
    if (daysRemaining <= 3) return 'bg-red-100 text-red-800';
    if (daysRemaining <= 7) return 'bg-macs-amber-100 text-macs-amber-800';
    return 'bg-macs-teal-100 text-macs-teal-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-teal-600 mx-auto mb-4"></div>
          <p className="text-macs-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-macs-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-macs-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-h1 text-macs-gray-900 font-gliker mb-4">
              Fund Creative Dreams 💰
            </h1>
            <p className="text-lg text-macs-gray-600 max-w-2xl mx-auto">
              Support amazing artists and help bring their creative visions to life. 
              Every contribution makes a difference in the MACS ʻOhana! 🌺
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-macs-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <div className="text-sm opacity-90">Active Campaigns</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.currentAmount, 0))}
              </div>
              <div className="text-sm opacity-90">Total Raised</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {campaigns.filter(c => c.progressPercentage >= 100).length}
              </div>
              <div className="text-sm opacity-90">Successful</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(campaigns.reduce((sum, c) => sum + c.progressPercentage, 0) / campaigns.length || 0)}%
              </div>
              <div className="text-sm opacity-90">Avg. Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-macs-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-macs pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-macs-teal-600 text-white'
                  : 'bg-white text-macs-gray-700 border border-macs-gray-300 hover:bg-macs-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('ending_soon')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'ending_soon'
                  ? 'bg-macs-teal-600 text-white'
                  : 'bg-white text-macs-gray-700 border border-macs-gray-300 hover:bg-macs-gray-50'
              }`}
            >
              Ending Soon
            </button>
            <button
              onClick={() => setFilter('most_funded')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'most_funded'
                  ? 'bg-macs-teal-600 text-white'
                  : 'bg-white text-macs-gray-700 border border-macs-gray-300 hover:bg-macs-gray-50'
              }`}
            >
              Most Funded
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-macs-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-macs-gray-900 mb-2">No campaigns found</h3>
            <p className="text-macs-gray-600">
              {searchQuery ? 'Try adjusting your search terms.' : 'Check back soon for new campaigns!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="card-macs overflow-hidden hover:shadow-lg transition-shadow">
                {/* Campaign Image */}
                <div className="relative h-48 bg-macs-gray-200">
                  {campaign.imageUrl ? (
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <DollarSign className="w-12 h-12 text-macs-gray-400" />
                    </div>
                  )}
                  
                  {/* Urgency Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBadge(campaign.daysRemaining)}`}>
                    {campaign.daysRemaining} days left
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-macs-gray-900 mb-2 font-gliker">
                    {campaign.title}
                  </h3>
                  <p className="text-macs-gray-600 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-macs-gray-700">
                        {formatCurrency(campaign.currentAmount)} raised
                      </span>
                      <span className="text-sm text-macs-gray-500">
                        {campaign.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-macs-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(campaign.progressPercentage)}`}
                        style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-macs-gray-500">
                      <span>Goal: {formatCurrency(campaign.targetAmount)}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {campaign.backers || 0} backers
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="btn-primary flex-1 text-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Support
                    </Link>
                    <button className="btn-secondary p-2">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;

