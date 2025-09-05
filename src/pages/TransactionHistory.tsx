import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/useWallet";
import { List, ExternalLink, Filter, Clock, Coins, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Transaction {
  id: string;
  hash: string;
  type: 'registration' | 'access' | 'payment' | 'verification';
  timestamp: string;
  from: string;
  to: string;
  value: string;
  status: 'confirmed' | 'pending' | 'failed';
  gasUsed: string;
  description: string;
}

const TransactionHistory = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (isConnected) {
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          hash: '0x742d35Cc6Db8D532A58C8614A2027f6Eca7fa0d2',
          type: 'registration',
          timestamp: '2024-01-15T10:30:00Z',
          from: account || '',
          to: '0x...',
          value: '0.001 ETH',
          status: 'confirmed',
          gasUsed: '21000',
          description: 'Medical data registration'
        },
        {
          id: '2',
          hash: '0x8b5c7d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
          type: 'access',
          timestamp: '2024-01-14T15:45:00Z',
          from: '0x...',
          to: account || '',
          value: '0.01 ETH',
          status: 'confirmed',
          gasUsed: '35000',
          description: 'Data access grant to researcher'
        },
        {
          id: '3',
          hash: '0x9c6d8e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
          type: 'payment',
          timestamp: '2024-01-13T09:20:00Z',
          from: '0x...',
          to: account || '',
          value: '0.05 ETH',
          status: 'confirmed',
          gasUsed: '25000',
          description: 'Data sharing reward'
        },
        {
          id: '4',
          hash: '0xa7d9e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
          type: 'verification',
          timestamp: '2024-01-12T14:10:00Z',
          from: account || '',
          to: '0x...',
          value: '0.002 ETH',
          status: 'pending',
          gasUsed: '18000',
          description: 'Data verification request'
        }
      ];
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    }
  }, [isConnected, account]);

  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, transactions]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'access':
        return <ArrowDownLeft className="w-4 h-4" />;
      case 'payment':
        return <Coins className="w-4 h-4" />;
      case 'verification':
        return <Clock className="w-4 h-4" />;
      default:
        return <List className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'bg-primary/10 text-primary border-primary';
      case 'access':
        return 'bg-accent/10 text-accent border-accent';
      case 'payment':
        return 'bg-success/10 text-success border-success';
      case 'verification':
        return 'bg-secondary/10 text-secondary-foreground border-secondary';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-6">
                Transaction History
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connect your wallet to view transaction history
              </p>
              <Button onClick={connectWallet} size="lg" variant="medical">
                Connect Wallet
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <List className="w-4 h-4 mr-2" />
              Transaction Logging
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Blockchain <span className="bg-gradient-primary bg-clip-text text-transparent">Transaction History</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete audit trail of all blockchain transactions powered by 
              smart contracts on Ganache with React frontend integration.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by transaction hash or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    All
                  </Button>
                  <Button
                    variant={filterType === 'registration' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('registration')}
                  >
                    Registration
                  </Button>
                  <Button
                    variant={filterType === 'access' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('access')}
                  >
                    Access
                  </Button>
                  <Button
                    variant={filterType === 'payment' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('payment')}
                  >
                    Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <List className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredTransactions.map((tx) => (
                <Card key={tx.id} className="hover:shadow-glow transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getTypeColor(tx.type)}`}>
                          {getTypeIcon(tx.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{tx.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                        <p className="text-sm font-semibold mt-1">{tx.value}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Transaction Hash</p>
                        <p className="font-mono text-muted-foreground break-all">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">From → To</p>
                        <p className="font-mono text-muted-foreground">
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)} → {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Gas Used</p>
                        <p className="text-muted-foreground">{tx.gasUsed}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View on Explorer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary Stats */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {transactions.filter(tx => tx.status === 'confirmed').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning mb-1">
                    {transactions.filter(tx => tx.status === 'pending').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-1">
                    {transactions.filter(tx => tx.type === 'payment').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Payments</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {transactions.reduce((sum, tx) => sum + parseInt(tx.gasUsed), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Gas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TransactionHistory;