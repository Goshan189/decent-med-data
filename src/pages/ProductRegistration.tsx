import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Database, Shield, Clock, CheckCircle, Upload, File, Globe, Eye, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductRegistration = () => {
  const { account, provider, connectWallet, isConnected } = useWallet();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<'register' | 'upload' | 'verify' | 'marketplace'>('register');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [registeredHash, setRegisteredHash] = useState<string>('');
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    dataHash: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    hash: string;
    size: string;
    gateway: string;
    price?: string;
  }>>([]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

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
      // Generate hash from form data
      const dataString = `${formData.productName}${formData.description}${formData.category}${Date.now()}`;
      const hash = `0x${Array.from(dataString).map((char, i) => 
        (char.charCodeAt(0) + i).toString(16).padStart(2, '0')
      ).join('').slice(0, 64)}`;
      
      // Simulate blockchain registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setRegisteredHash(hash);
      
      toast({
        title: "Success!",
        description: `Data registered! Hash: ${hash.slice(0, 10)}...`,
      });
      
      // Move to upload step
      setCurrentStep('upload');
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate IPFS upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Simulate IPFS hash generation
      const mockHash = `QmX${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mockGateway = `https://gateway.pinata.cloud/ipfs/${mockHash}`;

      const newFile = {
        name: file.name,
        hash: mockHash,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        gateway: mockGateway,
        price: Math.floor(Math.random() * 100 + 10).toString() // Random price between 10-110
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      toast({
        title: "Upload Successful!",
        description: `Document uploaded to IPFS: ${mockHash.slice(0, 8)}...`,
      });

      // Move to verification step
      setCurrentStep('verify');
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document to IPFS",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setVerificationStatus('verified');
      toast({
        title: "Verification Complete!",
        description: "Documents have been verified and are now available for purchase",
      });

      // Move to marketplace
      setCurrentStep('marketplace');
    } catch (error) {
      setVerificationStatus('failed');
      toast({
        title: "Verification Failed",
        description: "Document verification failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'register':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Step 1: Data Registration Form
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

              {registeredHash && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 font-medium">✓ Data registered successfully!</p>
                  <p className="text-xs text-green-600 mt-1">Hash: {registeredHash.slice(0, 20)}...</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'upload':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Step 2: Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploading to IPFS...</p>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Upload your medical documents</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Supported: PDF, JPG, PNG, DOC (Max 10MB)
                      </p>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Uploaded Documents:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{file.name}</h5>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">IPFS: {file.hash}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'verify':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Step 3: Document Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8">
                {verificationStatus === 'pending' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Ready for Verification</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your documents will be verified for authenticity and compliance
                      </p>
                      <Button 
                        onClick={handleVerification}
                        disabled={isVerifying}
                        className="w-full"
                      >
                        {isVerifying ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Verifying Documents...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Start Verification
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {verificationStatus === 'verified' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-700 mb-2">Verification Complete</h3>
                      <p className="text-sm text-green-600">
                        Documents have been verified and are now available for purchase
                      </p>
                    </div>
                  </div>
                )}

                {verificationStatus === 'failed' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-700 mb-2">Verification Failed</h3>
                      <p className="text-sm text-red-600 mb-4">
                        Please check your documents and try again
                      </p>
                      <Button 
                        onClick={() => setVerificationStatus('pending')}
                        variant="outline"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'marketplace':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Step 4: Document Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="font-medium text-green-700 mb-2">🎉 Your documents are now live!</h3>
                <p className="text-sm text-muted-foreground">
                  Users can now view and purchase your verified medical documents
                </p>
              </div>

              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{file.name}</h5>
                        <p className="text-xs text-muted-foreground">{file.size} • Verified ✓</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${file.price}</p>
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(file.gateway, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Purchase Initiated",
                            description: `Initiating purchase of ${file.name} for $${file.price}`,
                          });
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Purchase
                      </Button>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">IPFS Hash:</p>
                      <p className="text-xs font-mono bg-muted p-2 rounded mt-1 break-all">
                        {file.hash}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Button 
                  onClick={() => {
                    setCurrentStep('register');
                    setFormData({
                      productName: '',
                      description: '',
                      category: '',
                      dataHash: ''
                    });
                    setRegisteredHash('');
                    setUploadedFiles([]);
                    setVerificationStatus('pending');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Register New Product
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
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
            {/* Progress Steps */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {['register', 'upload', 'verify', 'marketplace'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step ? 'bg-primary text-primary-foreground' :
                        ['register', 'upload', 'verify', 'marketplace'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {['register', 'upload', 'verify', 'marketplace'].indexOf(currentStep) > index ? '✓' : index + 1}
                      </div>
                      {index < 3 && (
                        <div className={`h-1 w-16 ml-2 ${
                          ['register', 'upload', 'verify', 'marketplace'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Register</span>
                  <span>Upload</span>
                  <span>Verify</span>
                  <span>Marketplace</span>
                </div>
              </div>

              {renderStepContent()}
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