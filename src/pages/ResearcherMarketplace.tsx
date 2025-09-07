import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Database, Download, Eye, ShoppingCart, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ResearcherMarketplace = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for uploaded documents by patients
  const availableDocuments = [
    {
      id: 1,
      name: "Blood Test Results 2024",
      description: "Complete blood panel including CBC, lipids, and glucose levels",
      category: "Laboratory Results",
      size: "2.4 MB",
      price: "45",
      hash: "QmX7vKj9sH2pL3mN8qR4tY6uI0oP1zX2cV3bN4mM5sA6dF7g",
      uploader: "0x742d...8e9f",
      uploadDate: "2024-01-15",
      verified: true,
      downloads: 23
    },
    {
      id: 2,
      name: "MRI Brain Scan Report",
      description: "High-resolution brain MRI with radiologist interpretation",
      category: "Imaging",
      size: "15.7 MB",
      price: "120",
      hash: "QmY8wLk0tH3qM4nO9rS5vZ7xJ1pQ2aY3dW4cO5nN6tB7eG8h",
      uploader: "0x8d3f...2a1b",
      uploadDate: "2024-01-12",
      verified: true,
      downloads: 8
    },
    {
      id: 3,
      name: "Cardiac Stress Test Results",
      description: "Complete cardiac stress test with ECG and echo results",
      category: "Cardiology",
      size: "5.2 MB",
      price: "75",
      hash: "QmZ9xMl1uI4rN5oP0sT6wA8yK2qR3bZ4eX5dP6oO7uC8fH9i",
      uploader: "0x1a2b...7c8d",
      uploadDate: "2024-01-10",
      verified: true,
      downloads: 15
    },
    {
      id: 4,
      name: "Genetic Testing Report",
      description: "Comprehensive genetic analysis for disease predisposition",
      category: "Genetics",
      size: "8.9 MB",
      price: "200",
      hash: "QmA0yNm2vJ5sO6pQ1tU7xB9zL3rS4cA5fY6eQ7pP8vD9gI0j",
      uploader: "0x9e8f...3c4d",
      uploadDate: "2024-01-08",
      verified: true,
      downloads: 31
    }
  ];

  const categories = ['all', 'Laboratory Results', 'Imaging', 'Cardiology', 'Genetics'];

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