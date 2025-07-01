import { useState, useEffect } from 'react'
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Settings, 
  Copy, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Plus,
  Minus,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import macsLogo from './assets/MuseArtLogo.png'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedChain, setSelectedChain] = useState('polygon')
  const [connectedWallets, setConnectedWallets] = useState({
    polygon: null,
    solana: null
  })
  const [balances, setBalances] = useState({
    polygon: { macs: 1250.75, usd: 2501.50 },
    solana: { macs: 875.25, usd: 1750.50 },
    total: { macs: 2126.00, usd: 4252.00 }
  })
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [bridgeDirection, setBridgeDirection] = useState('polygon-to-solana')

  // Mock data for charts
  const priceData = [
    { time: '00:00', price: 1.95 },
    { time: '04:00', price: 2.10 },
    { time: '08:00', price: 2.05 },
    { time: '12:00', price: 2.25 },
    { time: '16:00', price: 2.15 },
    { time: '20:00', price: 2.00 },
    { time: '24:00', price: 2.00 }
  ]

  const volumeData = [
    { chain: 'Polygon', volume: 45.2, color: '#8247E5' },
    { chain: 'Solana', volume: 54.8, color: '#9945FF' }
  ]

  const transactions = [
    {
      id: 1,
      type: 'tip',
      amount: 25.5,
      chain: 'polygon',
      artist: 'Clara Vincent',
      time: '2 hours ago',
      status: 'completed',
      hash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'bridge',
      amount: 100.0,
      from: 'solana',
      to: 'polygon',
      time: '5 hours ago',
      status: 'completed',
      hash: 'ABC123...XYZ789'
    },
    {
      id: 3,
      type: 'booking',
      amount: 150.0,
      chain: 'solana',
      artist: 'Kenji Nakamura',
      time: '1 day ago',
      status: 'completed',
      hash: 'DEF456...UVW012'
    },
    {
      id: 4,
      type: 'crowdfunding',
      amount: 50.0,
      chain: 'polygon',
      campaign: 'Traditional Maori Art',
      time: '2 days ago',
      status: 'completed',
      hash: '0x9876...5432'
    }
  ]

  const connectWallet = async (chain, walletType) => {
    // Mock wallet connection
    const mockAddresses = {
      polygon: {
        metamask: '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87',
        trust: '0x8ba1f109551bD432803012645Hac136c22C501e'
      },
      solana: {
        phantom: 'DQyrAcCrDXQ7NeoqGgDCZwBvz7dffGnJRdvGy6sLzVhc',
        backpack: 'FNnt6cDVqJGGvJKKGvdKsRJCGy4GQv8JKKGvdKsRJCGy'
      }
    }
    
    setConnectedWallets(prev => ({
      ...prev,
      [chain]: {
        type: walletType,
        address: mockAddresses[chain][walletType],
        connected: true
      }
    }))
  }

  const disconnectWallet = (chain) => {
    setConnectedWallets(prev => ({
      ...prev,
      [chain]: null
    }))
  }

  const executeBridge = () => {
    if (!bridgeAmount || parseFloat(bridgeAmount) <= 0) return
    
    // Mock bridge execution
    console.log(`Bridging ${bridgeAmount} MACS from ${bridgeDirection}`)
    setBridgeAmount('')
    
    // Show success notification (in real app)
    alert(`Bridge transaction initiated for ${bridgeAmount} MACS`)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getChainIcon = (chain) => {
    const icons = {
      polygon: '⬟',
      solana: '◎'
    }
    return icons[chain] || '●'
  }

  const getTransactionIcon = (type) => {
    const icons = {
      tip: '💝',
      bridge: '🌉',
      booking: '📅',
      crowdfunding: '🎯'
    }
    return icons[type] || '💰'
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={macsLogo} alt="MACS" className="h-12" />
              <div>
                <h1 className="text-2xl font-bold">MACS Multichain Wallet</h1>
                <p className="text-sm text-muted-foreground">Polygon & Solana Bridge</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Total Balance */}
          <Card className="lg:col-span-2 chain-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Portfolio</span>
                <Badge variant="secondary" className="macs-gradient text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="wallet-balance">{balances.total.macs.toLocaleString()} MACS</div>
                  <div className="text-lg text-muted-foreground">${balances.total.usd.toLocaleString()}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="stat-card polygon-gradient text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Polygon</span>
                      <span className="text-2xl">⬟</span>
                    </div>
                    <div className="text-xl font-bold">{balances.polygon.macs.toLocaleString()} MACS</div>
                    <div className="text-sm opacity-90">${balances.polygon.usd.toLocaleString()}</div>
                  </div>
                  
                  <div className="stat-card solana-gradient text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Solana</span>
                      <span className="text-2xl">◎</span>
                    </div>
                    <div className="text-xl font-bold">{balances.solana.macs.toLocaleString()} MACS</div>
                    <div className="text-sm opacity-90">${balances.solana.usd.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card className="chain-card">
            <CardHeader>
              <CardTitle className="text-lg">MACS Price (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--macs-terracotta)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--macs-terracotta)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="var(--macs-terracotta)" 
                      fillOpacity={1} 
                      fill="url(#priceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-primary">$2.00</div>
                <div className="text-sm text-green-600">+$0.05 (2.56%)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="bridge">Bridge</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Polygon Wallet */}
              <Card className="chain-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full polygon-gradient flex items-center justify-center text-white text-lg">⬟</div>
                    <span>Polygon Network</span>
                    <div className={`network-status ${connectedWallets.polygon ? 'connected' : 'disconnected'}`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>{connectedWallets.polygon ? 'Connected' : 'Disconnected'}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectedWallets.polygon ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{connectedWallets.polygon.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatAddress(connectedWallets.polygon.address)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(connectedWallets.polygon.address)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>MACS Balance</span>
                          <span className="font-bold">{balances.polygon.macs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>USD Value</span>
                          <span>${balances.polygon.usd.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ArrowDownLeft className="h-4 w-4 mr-2" />
                          Receive
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectWallet('polygon')}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-center py-4">
                        Connect your Polygon wallet to view balance and make transactions
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full polygon-gradient text-white"
                          onClick={() => connectWallet('polygon', 'metamask')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect MetaMask
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => connectWallet('polygon', 'trust')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Trust Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Solana Wallet */}
              <Card className="chain-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full solana-gradient flex items-center justify-center text-white text-lg">◎</div>
                    <span>Solana Network</span>
                    <div className={`network-status ${connectedWallets.solana ? 'connected' : 'disconnected'}`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      <span>{connectedWallets.solana ? 'Connected' : 'Disconnected'}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectedWallets.solana ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{connectedWallets.solana.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatAddress(connectedWallets.solana.address)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(connectedWallets.solana.address)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>MACS Balance</span>
                          <span className="font-bold">{balances.solana.macs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>USD Value</span>
                          <span>${balances.solana.usd.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ArrowDownLeft className="h-4 w-4 mr-2" />
                          Receive
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => disconnectWallet('solana')}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-center py-4">
                        Connect your Solana wallet to view balance and make transactions
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full solana-gradient text-white"
                          onClick={() => connectWallet('solana', 'phantom')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Phantom
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => connectWallet('solana', 'backpack')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Backpack
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bridge Tab */}
          <TabsContent value="bridge" className="space-y-6">
            <Card className="chain-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Cross-Chain Bridge</span>
                  <Badge variant="secondary">Wormhole Powered</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bridge-flow">
                  <div className="flex-1">
                    <Label>From</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full polygon-gradient flex items-center justify-center text-white">⬟</div>
                        <div>
                          <div className="font-medium">Polygon</div>
                          <div className="text-sm text-muted-foreground">
                            Balance: {balances.polygon.macs.toLocaleString()} MACS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bridge-arrow"
                    onClick={() => setBridgeDirection(prev => 
                      prev === 'polygon-to-solana' ? 'solana-to-polygon' : 'polygon-to-solana'
                    )}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="flex-1">
                    <Label>To</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full solana-gradient flex items-center justify-center text-white">◎</div>
                        <div>
                          <div className="font-medium">Solana</div>
                          <div className="text-sm text-muted-foreground">
                            Balance: {balances.solana.macs.toLocaleString()} MACS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bridge-amount">Amount to Bridge</Label>
                    <div className="mt-2 relative">
                      <Input
                        id="bridge-amount"
                        type="number"
                        placeholder="0.00"
                        value={bridgeAmount}
                        onChange={(e) => setBridgeAmount(e.target.value)}
                        className="pr-16"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        MACS
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 250].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setBridgeAmount(amount.toString())}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bridge Fee</span>
                      <span>0.001 ETH + 1 MACS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Time</span>
                      <span>~15 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>You'll Receive</span>
                      <span>{bridgeAmount ? (parseFloat(bridgeAmount) - 1).toFixed(2) : '0.00'} MACS</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full macs-gradient text-white"
                    onClick={executeBridge}
                    disabled={!bridgeAmount || parseFloat(bridgeAmount) <= 1}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Bridge Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="chain-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Transactions</span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map(tx => (
                    <div key={tx.id} className="transaction-item">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium capitalize">{tx.type}</span>
                            {tx.chain && (
                              <Badge variant="outline" className="text-xs">
                                {getChainIcon(tx.chain)} {tx.chain}
                              </Badge>
                            )}
                            {tx.from && tx.to && (
                              <Badge variant="outline" className="text-xs">
                                {getChainIcon(tx.from)} → {getChainIcon(tx.to)}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tx.artist && `To ${tx.artist}`}
                            {tx.campaign && `To ${tx.campaign}`}
                            {tx.from && tx.to && 'Cross-chain bridge'}
                            {!tx.artist && !tx.campaign && !tx.from && 'Transaction'}
                          </div>
                          <div className="text-xs text-muted-foreground">{tx.time}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {tx.type === 'tip' || tx.type === 'booking' || tx.type === 'crowdfunding' ? '-' : ''}
                          {tx.amount.toLocaleString()} MACS
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={tx.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {tx.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {tx.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="chain-card">
                <CardHeader>
                  <CardTitle>Chain Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={volumeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="volume"
                        >
                          {volumeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {volumeData.map(item => (
                      <div key={item.chain} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span>{item.chain}</span>
                        </div>
                        <span className="font-medium">{item.volume}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="chain-card">
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="multichain-stats">
                    <div className="stat-card">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Total Volume</span>
                      </div>
                      <div className="text-2xl font-bold">$2.1M</div>
                      <div className="text-sm text-green-600">+15.2% this month</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium">Bridge Volume</span>
                      </div>
                      <div className="text-2xl font-bold">$450K</div>
                      <div className="text-sm text-green-600">+8.7% this week</div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-chart-3" />
                        <span className="text-sm font-medium">Active Users</span>
                      </div>
                      <div className="text-2xl font-bold">12.5K</div>
                      <div className="text-sm text-green-600">+22.1% this month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

