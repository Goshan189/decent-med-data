import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Shield, Search, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface VerificationResult {
  isValid: boolean;
  status: 'verified' | 'invalid' | 'pending' | 'not-found';
  dataHash: string;
  timestamp: string;
  owner: string;
  blockNumber: string;
}

const Verification = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerification = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!searchHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a data hash to verify",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate blockchain verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification result
      const mockResult: VerificationResult = {
        isValid: Math.random() > 0.3, // 70% chance of being valid
        status: Math.random() > 0.3 ? 'verified' : 'invalid',
        dataHash: searchHash,
        timestamp: new Date().toISOString(),
        owner: '0x742d35Cc' + Math.random().toString(36).substring(2, 8),
        blockNumber: Math.floor(Math.random() * 1000000).toString()
      };

      setVerificationResult(mockResult);
      
      toast({
        title: mockResult.isValid ? "Verification Complete" : "Verification Failed",
        description: mockResult.isValid ? "Data authenticity confirmed" : "Data could not be verified",
        variant: mockResult.isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify data on blockchain",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success border-success';
      case 'invalid':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Data Verification
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Verify Data <span className="bg-gradient-blockchain bg-clip-text text-transparent">Authenticity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check the authenticity of medical data using React, Web3.js/Ethers.js integration 
              with smart contracts on the blockchain.
            </p>
          </div>

          <div className="space-y-8">
            {/* Verification Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Data Hash Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="dataHash">Enter Data Hash</Label>
                  <Input
                    id="dataHash"
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    placeholder="0x... or Qm... (IPFS hash)"
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the blockchain hash or IPFS hash of the data you want to verify
                  </p>
                </div>

                <Button 
                  onClick={handleVerification}
                  disabled={isVerifying}
                  className="w-full"
                  size="lg"
                  variant="blockchain"
                >
                  {isVerifying ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Verifying on Blockchain...
                    </>
                  ) : isConnected ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Authenticity
                    </>
                  ) : (
                    'Connect Wallet to Verify'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(verificationResult.status)}
                    Verification Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`text-lg px-4 py-2 ${getStatusColor(verificationResult.status)}`}
                    >
                      {verificationResult.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Data Hash</Label>
                        <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                          {verificationResult.dataHash}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Owner Address</Label>
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          {verificationResult.owner}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Block Number</Label>
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          {verificationResult.blockNumber}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Timestamp</Label>
                        <p className="text-sm font-mono bg-muted p-2 rounded">
                          {new Date(verificationResult.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {verificationResult.isValid ? (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <h4 className="font-semibold text-success">Data Verified</h4>
                      </div>
                      <p className="text-sm text-success/80">
                        This data has been successfully verified on the blockchain. 
                        The smart contract confirms its authenticity and integrity.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <h4 className="font-semibold text-destructive">Verification Failed</h4>
                      </div>
                      <p className="text-sm text-destructive/80">
                        This data could not be verified on the blockchain. 
                        It may have been tampered with or does not exist in our records.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Technology Stack Info */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">React Frontend</h4>
                    <p className="text-sm text-muted-foreground">User interface for hash input and result display</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-semibold mb-2">Web3.js/Ethers.js</h4>
                    <p className="text-sm text-muted-foreground">Blockchain interaction and smart contract calls</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-secondary/50 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h4 className="font-semibold mb-2">Smart Contracts</h4>
                    <p className="text-sm text-muted-foreground">On-chain verification logic and data integrity checks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Verification;