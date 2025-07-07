import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CampaignCreation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    imageUrl: ''
  });
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.targetAmount || !formData.deadline) {
        setErrorMessage('Please fill in all required fields');
        setSubmitStatus('error');
        return;
      }

      // Validate target amount
      const targetAmount = parseFloat(formData.targetAmount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        setErrorMessage('Please enter a valid target amount');
        setSubmitStatus('error');
        return;
      }

      // Validate deadline
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        setErrorMessage('Deadline must be in the future');
        setSubmitStatus('error');
        return;
      }

      // Prepare campaign data
      const campaignData = {
        artistId: user?.id || '1', // Default to artist ID 1 for demo
        title: formData.title,
        description: formData.description,
        targetAmount: targetAmount,
        deadline: deadlineDate.toISOString(),
        imageUrl: formData.imageUrl
      };

      // Submit to backend
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://5001-ia65z5fdlm3fg7fvw44p4-d6ef6919.manusvm.computer' 
        : 'http://localhost:5001';

      const response = await fetch(`${API_BASE_URL}/api/v1/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Show success message
        if (window.showToast) {
          window.showToast('Campaign created successfully! 🎉', 'success');
        }
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            targetAmount: '',
            deadline: '',
            imageUrl: ''
          });
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Failed to create campaign');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setErrorMessage('Network error. Please try again.');
      setSubmitStatus('error');
    }
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-h2 text-macs-dark mb-2">Create New Campaign</h2>
          <p className="text-macs-gray">Launch a crowdfunding campaign to bring your artistic vision to life</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-macs-dark mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Traditional Ceramic Art Exhibition"
              className="input-macs"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-macs-dark mb-2">
              Campaign Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your project, what you plan to create, and why people should support you..."
              rows={6}
              className="input-macs resize-none"
              required
            />
            <p className="text-xs text-macs-gray mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Target Amount and Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-macs-dark mb-2">
                Target Amount ($) *
              </label>
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                placeholder="5000"
                min="1"
                step="1"
                className="input-macs"
                required
              />
            </div>

            {/* Campaign Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-macs-dark mb-2">
                Campaign Deadline *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={minDate}
                className="input-macs"
                required
              />
            </div>
          </div>

          {/* Campaign Image */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-macs-dark mb-2">
              Campaign Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/your-campaign-image.jpg"
              className="input-macs"
            />
            <p className="text-xs text-macs-gray mt-1">
              Optional: Add an image to make your campaign more appealing
            </p>
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                🎉 Campaign created successfully! Your campaign is now live and ready to receive contributions.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  targetAmount: '',
                  deadline: '',
                  imageUrl: ''
                });
                setSubmitStatus('idle');
                setErrorMessage('');
              }}
              className="btn-secondary"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'loading' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Campaign...
                </span>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>

        {/* Campaign Guidelines */}
        <div className="mt-8 p-6 bg-macs-light rounded-lg">
          <h3 className="text-lg font-semibold text-macs-dark mb-3">Campaign Guidelines</h3>
          <ul className="text-sm text-macs-gray space-y-2">
            <li>• Be clear and specific about your artistic project and goals</li>
            <li>• Set a realistic funding target and timeline</li>
            <li>• Include high-quality images or videos of your work</li>
            <li>• Engage with your supporters and provide regular updates</li>
            <li>• Honor your commitments and deliver on your promises</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreation;

