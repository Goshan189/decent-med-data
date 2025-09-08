import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useIPFS } from "@/hooks/useIPFS";
import { Upload, File, CheckCircle, Globe, HardDrive } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DataStorage = () => {
  const { toast } = useToast();
  const { uploadToIPFS, isUploading, uploadProgress } = useIPFS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    hash: string;
    size: string;
    gateway: string;
  }>>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      // Upload to IPFS using real integration
      const { hash, gateway } = await uploadToIPFS(file);

      const newFile = {
        name: file.name,
        hash: hash,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        gateway: gateway
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      toast({
        title: "Upload Successful!",
        description: `File uploaded to IPFS: ${hash.slice(0, 8)}...`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to IPFS",
        variant: "destructive"
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <HardDrive className="w-4 h-4 mr-2" />
              Data Storage
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Decentralized <span className="bg-gradient-blockchain bg-clip-text text-transparent">IPFS Storage</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Store your medical data securely on IPFS with Express backend integration. 
              Upload images, PDFs, and documents to the decentralized web.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload to IPFS
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
                        <p className="text-sm font-medium mb-2">Upload your medical files</p>
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

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <p className="text-sm font-medium">Decentralized</p>
                    <p className="text-xs text-muted-foreground">No single point of failure</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Immutable</p>
                    <p className="text-xs text-muted-foreground">Content-addressed storage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="w-5 h-5" />
                  Uploaded Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{file.name}</h4>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Stored
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">IPFS Hash:</p>
                          <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                            {file.hash}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 w-full"
                          onClick={() => window.open(file.gateway, '_blank')}
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          View on IPFS Gateway
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Technology Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>IPFS + Express Backend Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Frontend Upload</h4>
                  <p className="text-sm text-muted-foreground">React interface handles file selection and validation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Express Backend</h4>
                  <p className="text-sm text-muted-foreground">Node.js server processes and uploads to IPFS network</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-secondary/50 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">IPFS Network</h4>
                  <p className="text-sm text-muted-foreground">Decentralized storage with content addressing</p>
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

export default DataStorage;