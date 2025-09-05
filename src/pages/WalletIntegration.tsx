import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Wallet, CheckCircle, AlertCircle, ExternalLink, Coins, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WalletIntegration = () => {
  const { account, provider, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();
  const [balance, setBalance] = useState<string>('0');
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && provider) {
      fetchWalletInfo();
    }
  }, [isConnected, provider]);

  const fetchWalletInfo = async () => {
    if (!provider || !account) return;
    
    setIsLoading(true);
    try {
      // Get balance
      const balance = await provider.getBalance(account);
      setBalance(parseFloat(balance.toString()) / 1e18 + '');
      
      // Get network info
      const network = await provider.getNetwork();
      setNetworkInfo({
        name: network.name,
        chainId: network.chainId.toString()
      });
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "MetaMask wallet connected successfully",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect MetaMask wallet",
        variant: "destructive"
      });
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setBalance('0');
    setNetworkInfo(null);
    toast({
      title: "Wallet Disconnected",
      description: "MetaMask wallet disconnected",
    });
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet Integration
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              MetaMask <span className="bg-gradient-primary bg-clip-text text-transparent">Wallet Integration</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your MetaMask wallet to interact with our blockchain-based 
              medical data platform. Secure, decentralized, and user-controlled.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasMetaMask ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">MetaMask Not Detected</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please install MetaMask browser extension to continue
                      </p>
                      <Button onClick={installMetaMask} variant="medical">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Install MetaMask
                      </Button>
                    </div>
                  </div>
                ) : !isConnected ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect MetaMask to access all platform features
                      </p>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        variant="medical"
                        size="lg"
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect MetaMask
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-success" />
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connected
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Wallet Address</label>
                        <div className="mt-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                          {account}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Balance</label>
                          <div className="mt-1 p-3 bg-muted rounded-lg text-center">
                            {isLoading ? (
                              <div className="animate-pulse">Loading...</div>
                            ) : (
                              <span className="font-semibold">{parseFloat(balance).toFixed(4)} ETH</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Network</label>
                          <div className="mt-1 p-3 bg-muted rounded-lg text-center">
                            {isLoading ? (
                              <div className="animate-pulse">Loading...</div>
                            ) : (
                              <span className="font-semibold">{networkInfo?.name || 'Unknown'}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleDisconnectWallet}
                        variant="outline"
                        className="w-full"
                      >
                        Disconnect Wallet
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features & Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Why Connect Your Wallet?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data Ownership</h4>
                      <p className="text-sm text-muted-foreground">
                        Register and own your medical data on the blockchain
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Coins className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Earn Rewards</h4>
                      <p className="text-sm text-muted-foreground">
                        Get paid for sharing your data with researchers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Secure Transactions</h4>
                      <p className="text-sm text-muted-foreground">
                        All transactions secured by blockchain technology
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Complete Control</h4>
                      <p className="text-sm text-muted-foreground">
                        You decide who can access your medical information
                      </p>
                    </div>
                  </div>
                </div>

                {isConnected && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Ready to Go!</h4>
                    <p className="text-sm text-primary/80 mb-3">
                      Your wallet is connected. You can now access all platform features.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="medical">
                        Register Data
                      </Button>
                      <Button size="sm" variant="outline">
                        View Transactions
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* MetaMask Integration Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>MetaMask Integration Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Wallet Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Seamless integration with MetaMask browser extension
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Transaction Signing</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure transaction signing and smart contract interaction
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-secondary/50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Real-time Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Live balance and transaction status updates
                  </p>
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

export default WalletIntegration;