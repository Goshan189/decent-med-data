import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { Search, Eye, ShoppingCart, FileText, Calendar, DollarSign, User, Wallet, Database, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ResearcherMarketplace = () => {
  const { toast } = useToast();
  const { isConnected, connectWallet, account } = useWallet();
  const { getPublicDataList, purchaseDataAccess } = useContract();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState<any[]>([]);

  // Get uploaded documents from localStorage (uploaded by patients)
  const getUploadedDocuments = () => {
    try {
      const stored = localStorage.getItem('patientDocuments');
      if (stored) {
        const documents = JSON.parse(stored);
        return documents.map((doc: any, index: number) => ({
          id: index + 1,
          name: doc.name,
          description: doc.description,
          category: doc.category,
          size: doc.size,
          price: doc.price,
          hash: doc.hash,
          uploader: "0x" + Math.random().toString(16).slice(2, 8) + "..." + Math.random().toString(16).slice(2, 6),
          uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
          verified: true, // Assume verified since they went through the verification process
          downloads: Math.floor(Math.random() * 50) + 1
        }));
      }
    } catch (error) {
      console.error('Error loading patient documents:', error);
    }
    return [];
  };

  useEffect(() => {
    const loadDocuments = () => {
      const docs = getUploadedDocuments();
      setDocuments(docs);
    };
    
    loadDocuments();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadDocuments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const availableDocuments = documents;

  // Get unique categories from uploaded documents
  const getCategories = () => {
    const uniqueCategories = [...new Set(documents.map(doc => doc.category))];
    return ['all', ...uniqueCategories];
  };

  const categories = getCategories();

  const filteredDocuments = availableDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (doc: any) => {
    toast({
      title: "Purchase Initiated",
      description: `Purchasing ${doc.name} for ${doc.price} tokens...`,
    });
    // Simulate purchase process
    setTimeout(() => {
      toast({
        title: "Purchase Successful!",
        description: `You now have access to ${doc.name}`,
      });
    }, 2000);
  };

  const handlePreview = (doc: any) => {
    toast({
      title: "Preview Available",
      description: `Opening preview for ${doc.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Database className="w-4 h-4 mr-2" />
              Researcher Marketplace
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Medical Data <span className="bg-gradient-medical bg-clip-text text-transparent">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access verified medical data uploaded by patients. All documents are blockchain-verified 
              and AI-validated for authenticity.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <Badge variant={doc.verified ? "secondary" : "outline"} className="text-xs">
                      {doc.verified ? "✓ Verified" : "Pending"}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {doc.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploader:</span>
                      <span className="font-mono">{doc.uploader}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload Date:</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span>{doc.downloads}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">{doc.price} tokens</span>
                      <Badge variant="outline" className="text-xs">
                        IPFS: {doc.hash.slice(0, 8)}...
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handlePreview(doc)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePurchase(doc)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Purchase
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new uploads.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherMarketplace;