import React, { useState, useEffect } from 'react';
import { X, DollarSign, Wallet, Copy, Check, AlertCircle, Coins, CreditCard } from 'lucide-react';

const CryptoContributionModal = ({ isOpen, onClose, campaign, onContributionSuccess }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState('fiat');
  const [selectedNetwork, setSelectedNetwork] = useState('polygon');
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [errors, setErrors] = useState({});

  // Supported blockchain networks
  const supportedNetworks = [
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      color: 'bg-purple-500',
      platformWallet: '0x742d35Cc6634C0532925a3b8D6Ac492395d2912B'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      color: 'bg-green-500',
      platformWallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
    },
    {
      id: 'bnb',
      name: 'BNB Chain',
      symbol: 'BNB',
      color: 'bg-yellow-500',
      platformWallet: '0x742d35Cc6634C0532925a3b8D6Ac492395d2912B'
    },
    {
      id: 'xrp',
      name: 'XRP Ledger',
      symbol: 'XRP',
      color: 'bg-blue-500',
      platformWallet: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
    },
    {
      id: 'xdc',
      name: 'XDC Network',
      symbol: 'XDC',
      color: 'bg-indigo-500',
      platformWallet: 'xdc742d35Cc6634C0532925a3b8D6Ac492395d2912B'
    }
  ];

  const selectedNetworkData = supportedNetworks.find(n => n.id === selectedNetwork);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNote('');
      setPaymentType('fiat');
      setSelectedNetwork('polygon');
      setUserWalletAddress('');
      setConfirmationChecked(false);
      setErrors({});
    }
  }, [isOpen]);

  // Copy wallet address to clipboard
  const copyToClipboard = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid contribution amount';
    }

    if (paymentType === 'crypto') {
      if (!userWalletAddress.trim()) {
        newErrors.userWalletAddress = 'Please enter your wallet address';
      }
      if (!confirmationChecked) {
        newErrors.confirmation = 'Please confirm you have sent the contribution';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contributionData = {
        amount: parseFloat(amount),
        note: note.trim(),
        paymentType,
        ...(paymentType === 'crypto' && {
          crypto: {
            userWalletAddress: userWalletAddress.trim(),
            network: selectedNetwork,
            token: selectedNetworkData.symbol,
            platformWallet: selectedNetworkData.platformWallet
          }
        })
      };

      // Call API to submit contribution
      const response = await fetch(`https://xlhyimcjvxqq.manus.space/api/v1/campaigns/${campaign.id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contributionData)
      });

      if (response.ok) {
        const result = await response.json();
        onContributionSuccess(result.data.campaign);
        onClose();
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Failed to submit contribution' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Support This Campaign</h2>
              <p className="text-sm text-gray-600">{campaign.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Contribute *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note or Message to Artist (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Send a message of support..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Payment Method Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPaymentType('fiat')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  paymentType === 'fiat'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Fiat Currency</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('crypto')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                  paymentType === 'crypto'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Coins className="w-5 h-5" />
                <span className="font-medium">Cryptocurrency</span>
              </button>
            </div>
          </div>

          {/* Crypto Payment Options */}
          {paymentType === 'crypto' && (
            <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
              {/* Blockchain Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Blockchain Network *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supportedNetworks.map((network) => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        selectedNetwork === network.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 ${network.color} rounded-full flex items-center justify-center`}>
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{network.name}</div>
                        <div className="text-sm text-gray-600">{network.symbol}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Wallet Address *
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userWalletAddress}
                    onChange={(e) => setUserWalletAddress(e.target.value)}
                    placeholder={`Enter your ${selectedNetworkData.name} wallet address`}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.userWalletAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.userWalletAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.userWalletAddress}</p>
                )}
              </div>

              {/* MACS Platform Wallet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MACS Platform Wallet ({selectedNetworkData.symbol})
                </label>
                <div className="flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {selectedNetworkData.platformWallet}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedNetworkData.platformWallet)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedAddress === selectedNetworkData.platformWallet ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Send your {selectedNetworkData.symbol} contribution to this address
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="text-sm">
                    <span className="text-gray-700">
                      I confirm that I have sent <strong>${amount || '0'}</strong> worth of{' '}
                      <strong>{selectedNetworkData.symbol}</strong> to the MACS platform wallet address above.
                    </span>
                  </div>
                </label>
                {errors.confirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmation}</p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {paymentType === 'crypto' ? 'Confirm Crypto Contribution' : 'Contribute Now'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CryptoContributionModal;

