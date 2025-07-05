import { ethers } from 'ethers';
import MACSTokenABI from '../abis/MACSToken.json';
import MACSBookingABI from '../abis/MACSBooking.json';

// Contract addresses (from deployment)
const CONTRACTS = {
  137: { // Polygon Mainnet
    MACSToken: '0x1234567890123456789012345678901234567890',
    MACSBooking: '0x2345678901234567890123456789012345678901',
    MACSCrowdfunding: '0x3456789012345678901234567890123456789012',
    MACSBridge: '0x4567890123456789012345678901234567890123'
  },
  80001: { // Polygon Mumbai
    MACSToken: '0x5678901234567890123456789012345678901234',
    MACSBooking: '0x6789012345678901234567890123456789012345',
    MACSCrowdfunding: '0x7890123456789012345678901234567890123456',
    MACSBridge: '0x8901234567890123456789012345678901234567'
  }
};

const SUPPORTED_NETWORKS = {
  137: {
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  80001: {
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com'
  }
};

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.chainId = null;
    this.account = null;
  }

  // Wallet connection methods
  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Set up provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = accounts[0];

      // Get network info
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      // Check if network is supported
      if (!SUPPORTED_NETWORKS[this.chainId]) {
        await this.switchToPolygon();
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.account = accounts[0];
          window.location.reload(); // Refresh to update UI
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload(); // Refresh to update UI
      });

      return {
        account: this.account,
        chainId: this.chainId,
        network: SUPPORTED_NETWORKS[this.chainId]?.name || 'Unknown'
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToPolygon() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com']
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.chainId = null;
    this.account = null;
  }

  isConnected() {
    return this.account !== null && this.signer !== null;
  }

  // MACS Token methods
  async getMACSBalance(address = null) {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const targetAddress = address || this.account;
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const contractAddress = CONTRACTS[this.chainId]?.MACSToken;
      if (!contractAddress) {
        throw new Error('MACS token not available on this network');
      }

      const contract = new ethers.Contract(
        contractAddress,
        MACSTokenABI,
        this.provider
      );

      const balance = await contract.balanceOf(targetAddress);
      const decimals = await contract.decimals();

      return {
        balance: ethers.formatUnits(balance, decimals),
        balanceWei: balance.toString(),
        decimals: Number(decimals),
        symbol: 'MACS',
        address: targetAddress
      };
    } catch (error) {
      console.error('Error getting MACS balance:', error);
      throw error;
    }
  }

  async transferMACS(toAddress, amount) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = CONTRACTS[this.chainId]?.MACSToken;
      if (!contractAddress) {
        throw new Error('MACS token not available on this network');
      }

      const contract = new ethers.Contract(
        contractAddress,
        MACSTokenABI,
        this.signer
      );

      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount.toString(), decimals);

      const tx = await contract.transfer(toAddress, amountWei);
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error transferring MACS:', error);
      throw error;
    }
  }

  async tipArtist(artistAddress, amount, message = '') {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = CONTRACTS[this.chainId]?.MACSToken;
      if (!contractAddress) {
        throw new Error('MACS token not available on this network');
      }

      const contract = new ethers.Contract(
        contractAddress,
        MACSTokenABI,
        this.signer
      );

      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount.toString(), decimals);

      const tx = await contract.tipArtist(artistAddress, amountWei, message);
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error tipping artist:', error);
      throw error;
    }
  }

  async getArtistTips(artistAddress) {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = CONTRACTS[this.chainId]?.MACSToken;
      if (!contractAddress) {
        throw new Error('MACS token not available on this network');
      }

      const contract = new ethers.Contract(
        contractAddress,
        MACSTokenABI,
        this.provider
      );

      const tips = await contract.getArtistTips(artistAddress);
      const decimals = await contract.decimals();

      return {
        totalTips: ethers.formatUnits(tips, decimals),
        totalTipsWei: tips.toString(),
        artist: artistAddress
      };
    } catch (error) {
      console.error('Error getting artist tips:', error);
      throw error;
    }
  }

  // Booking methods
  async createBooking(artistAddress, amount, startTime, duration, description) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tokenAddress = CONTRACTS[this.chainId]?.MACSToken;
      const bookingAddress = CONTRACTS[this.chainId]?.MACSBooking;
      
      if (!tokenAddress || !bookingAddress) {
        throw new Error('Contracts not available on this network');
      }

      // First approve MACS tokens for booking contract
      const tokenContract = new ethers.Contract(
        tokenAddress,
        MACSTokenABI,
        this.signer
      );

      const decimals = await tokenContract.decimals();
      const amountWei = ethers.parseUnits(amount.toString(), decimals);

      const approveTx = await tokenContract.approve(bookingAddress, amountWei);
      await approveTx.wait();

      // Create booking
      const bookingContract = new ethers.Contract(
        bookingAddress,
        MACSBookingABI,
        this.signer
      );

      const tx = await bookingContract.createBooking(
        artistAddress,
        amountWei,
        startTime,
        duration,
        description
      );

      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBooking(bookingId) {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const bookingAddress = CONTRACTS[this.chainId]?.MACSBooking;
      if (!bookingAddress) {
        throw new Error('Booking contract not available on this network');
      }

      const contract = new ethers.Contract(
        bookingAddress,
        MACSBookingABI,
        this.provider
      );

      const booking = await contract.getBooking(bookingId);

      return {
        bookingId: bookingId,
        client: booking[0],
        artist: booking[1],
        amount: ethers.formatUnits(booking[2], 18),
        startTime: Number(booking[3]),
        duration: Number(booking[4]),
        status: Number(booking[5]),
        description: booking[6]
      };
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  // Utility methods
  async getTokenInfo() {
    try {
      if (!this.provider) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = CONTRACTS[this.chainId]?.MACSToken;
      if (!contractAddress) {
        throw new Error('MACS token not available on this network');
      }

      const contract = new ethers.Contract(
        contractAddress,
        MACSTokenABI,
        this.provider
      );

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        contractAddress,
        network: SUPPORTED_NETWORKS[this.chainId]?.name || 'Unknown'
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  getNetworkInfo() {
    return SUPPORTED_NETWORKS[this.chainId] || null;
  }

  getSupportedNetworks() {
    return SUPPORTED_NETWORKS;
  }

  formatMACS(amount, decimals = 4) {
    const num = parseFloat(amount);
    if (num === 0) return '0';
    if (num < 0.0001) return '<0.0001';
    return num.toFixed(decimals);
  }

  shortenAddress(address, chars = 4) {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }
}

// Export singleton instance
export default new BlockchainService();

