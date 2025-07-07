import React, { useState } from 'react';
import { X, Heart, DollarSign, CreditCard, Smartphone, Building } from 'lucide-react';

const ContributionModal = ({ isOpen, onClose, campaign }) => {
  const [formData, setFormData] = useState({
    amount: '',
    contributorName: '',
    contributorEmail: '',
    message: '',
    paymentMethod: 'credit_card'
  });
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Preset contribution amounts
  const presetAmounts = [25, 50, 100, 250, 500];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      // Validate form data
      if (!formData.amount || !formData.contributorName || !formData.contributorEmail) {
        setErrorMessage('Please fill in all required fields');
        setSubmitStatus('error');
        return;
      }

      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setErrorMessage('Please enter a valid contribution amount');
        setSubmitStatus('error');
        return;
      }

      if (amount < 5) {
        setErrorMessage('Minimum contribution amount is $5');
        setSubmitStatus('error');
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contributorEmail)) {
        setErrorMessage('Please enter a valid email address');
        setSubmitStatus('error');
        return;
      }

      // Prepare contribution data
      const contributionData = {
        campaignId: campaign.id,
        contributorName: formData.contributorName,
        contributorEmail: formData.contributorEmail,
        amount: amount,
        message: formData.message,
        paymentMethod: formData.paymentMethod
      };

      // Submit to backend
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://5001-ia65z5fdlm3fg7fvw44p4-d6ef6919.manusvm.computer' 
        : 'http://localhost:5001';

      const response = await fetch(`${API_BASE_URL}/api/v1/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contributionData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Show success message
        if (window.showToast) {
          window.showToast(`Thank you for supporting ${campaign.title}! 🎉`, 'success');
        }
        
        // Reset form and close modal after success
        setTimeout(() => {
          setFormData({
            amount: '',
            contributorName: '',
            contributorEmail: '',
            message: '',
            paymentMethod: 'credit_card'
          });
          setSubmitStatus('idle');
          onClose();
          // Refresh the page to show updated campaign progress
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Failed to submit contribution');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contribution:', error);
      setErrorMessage('Network error. Please try again.');
      setSubmitStatus('error');
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

  if (!isOpen || !campaign) return null;

  const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-macs-teal-600" />
            <h2 className="text-xl font-bold text-macs-dark">Support This Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-macs-gray" />
          </button>
        </div>

        {/* Campaign Info */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-macs-dark mb-2">{campaign.title}</h3>
          <p className="text-macs-gray text-sm mb-4 line-clamp-2">{campaign.description}</p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-macs-dark">
                {formatCurrency(campaign.currentAmount)} raised
              </span>
              <span className="text-sm text-macs-gray">
                {progressPercentage.toFixed(1)}% of {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-macs-teal-500 to-macs-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Contribution Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-macs-dark mb-3">
              Contribution Amount *
            </label>
            
            {/* Preset Amounts */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.amount === amount.toString()
                      ? 'border-macs-teal-600 bg-macs-teal-50 text-macs-teal-700'
                      : 'border-gray-300 hover:border-macs-teal-300 text-macs-gray'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-macs-gray" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter custom amount"
                min="5"
                step="1"
                className="input-macs pl-10"
                required
              />
            </div>
            <p className="text-xs text-macs-gray mt-1">Minimum contribution: $5</p>
          </div>

          {/* Contributor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="contributorName" className="block text-sm font-medium text-macs-dark mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="contributorName"
                name="contributorName"
                value={formData.contributorName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="input-macs"
                required
              />
            </div>
            <div>
              <label htmlFor="contributorEmail" className="block text-sm font-medium text-macs-dark mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="contributorEmail"
                name="contributorEmail"
                value={formData.contributorEmail}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="input-macs"
                required
              />
            </div>
          </div>

          {/* Support Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-macs-dark mb-2">
              Support Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Leave a message of encouragement for the artist..."
              rows={3}
              className="input-macs resize-none"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-macs-dark mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'paypal', label: 'PayPal', icon: Smartphone },
                { id: 'bank_transfer', label: 'Bank Transfer', icon: Building }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.paymentMethod === method.id
                        ? 'border-macs-teal-600 bg-macs-teal-50 text-macs-teal-700'
                        : 'border-gray-300 hover:border-macs-teal-300 text-macs-gray'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {method.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-macs-gray mt-2">
              * This is a demo. No actual payment will be processed.
            </p>
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">
                🎉 Thank you for your contribution! Your support means the world to this artist.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Contribute {formData.amount ? formatCurrency(parseFloat(formData.amount)) : ''}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;

