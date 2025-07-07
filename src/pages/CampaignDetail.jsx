import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, Users, Target, Heart, Share2, Clock, CheckCircle } from 'lucide-react';
import ContributionModal from '../components/ContributionModal';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/v1/campaigns/${id}`);
      const data = await response.json();
      setCampaign(data.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSupportClick = () => {
    setIsContributionModalOpen(true);
  };

  const handleContributionSuccess = () => {
    setIsContributionModalOpen(false);
    fetchCampaign(); // Refresh campaign data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-macs-teal-600 mx-auto mb-4"></div>
          <p className="text-macs-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-macs-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-macs-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-macs-gray-900 mb-2">Campaign not found</h2>
          <p className="text-macs-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
          <Link to="/campaigns" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-macs-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-macs-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/campaigns"
            className="inline-flex items-center text-macs-teal-600 hover:text-macs-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Image */}
            <div className="relative h-64 md:h-96 bg-macs-gray-200 rounded-lg overflow-hidden mb-6">
              {campaign.imageUrl ? (
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DollarSign className="w-16 h-16 text-macs-gray-400" />
                </div>
              )}
            </div>

            {/* Campaign Info */}
            <div className="card-macs p-6">
              <h1 className="text-h2 text-macs-gray-900 font-gliker mb-4">
                {campaign.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-macs-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  By {campaign.artistName || 'Anonymous Artist'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {campaign.daysRemaining} days remaining
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-macs-gray-700 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              {/* Campaign Updates */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-macs-gray-900 mb-4">Campaign Updates</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-macs-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-macs-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-macs-gray-900">Campaign launched!</p>
                      <p className="text-xs text-macs-gray-600">Thank you for your support. Let's make this dream a reality! 🌺</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-macs p-6 sticky top-4">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-macs-gray-900">
                    {formatCurrency(campaign.currentAmount)}
                  </span>
                  <span className="text-sm text-macs-gray-500">
                    {campaign.progressPercentage}%
                  </span>
                </div>
                <p className="text-sm text-macs-gray-600 mb-3">
                  raised of {formatCurrency(campaign.targetAmount)} goal
                </p>
                
                <div className="w-full bg-macs-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(campaign.progressPercentage)}`}
                    style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-macs-gray-900">
                      {campaign.backers || 0}
                    </div>
                    <div className="text-xs text-macs-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-macs-gray-900">
                      {campaign.daysRemaining}
                    </div>
                    <div className="text-xs text-macs-gray-600">days to go</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSupportClick}
                  className="btn-primary w-full"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Support this project
                </button>
                
                <button className="btn-secondary w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>

              {/* Campaign Stats */}
              <div className="mt-6 pt-6 border-t border-macs-gray-200">
                <h4 className="text-sm font-medium text-macs-gray-900 mb-3">Campaign Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-macs-gray-600">Created</span>
                    <span className="text-macs-gray-900">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-macs-gray-600">Deadline</span>
                    <span className="text-macs-gray-900">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-macs-gray-600">Category</span>
                    <span className="text-macs-gray-900">Art & Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        campaign={campaign}
        onSuccess={handleContributionSuccess}
      />
    </div>
  );
};

export default CampaignDetail;

