import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Database, Shield, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductRegistration = () => {
  const { account, provider, connectWallet, isConnected } = useWallet();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    dataHash: ''
  });

  const handleRegister = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!formData.productName || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Simulate blockchain registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Medical data registered on blockchain",
      });
      
      // Reset form
      setFormData({
        productName: '',
        description: '',
        category: '',
        dataHash: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register data on blockchain",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Database className="w-4 h-4 mr-2" />
              Product Registration
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Register Medical Data <span className="bg-gradient-medical bg-clip-text text-transparent">On-Chain</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Securely register your medical data on the blockchain using Solidity smart contracts, 
              Ganache testnet, and Truffle framework.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Registration Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product/Data Name *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData(prev => ({...prev, productName: e.target.value}))}
                      placeholder="e.g., Blood Test Results 2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder="Detailed description of the medical data"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                      placeholder="e.g., Laboratory Results, Imaging, Prescriptions"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataHash">Data Hash (Auto-generated)</Label>
                    <Input
                      id="dataHash"
                      value={formData.dataHash}
                      onChange={(e) => setFormData(prev => ({...prev, dataHash: e.target.value}))}
                      placeholder="0x..."
                      disabled
                    />
                  </div>

                  <Button 
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="w-full"
                    size="lg"
                    variant="medical"
                  >
                    {isRegistering ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Registering on Blockchain...
                      </>
                    ) : isConnected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Register Data On-Chain
                      </>
                    ) : (
                      'Connect Wallet to Register'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connected
                      </Badge>
                      <p className="text-sm text-muted-foreground break-all">
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline" className="w-full justify-center">
                      Not Connected
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Solidity Smart Contracts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Ganache Blockchain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Truffle Framework</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">MetaMask Integration</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductRegistration;