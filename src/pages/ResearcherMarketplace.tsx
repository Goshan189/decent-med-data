import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import {
  Search,
  Eye,
  ShoppingCart,
  FileText,
  Calendar,
  DollarSign,
  User,
  Wallet,
  Database,
  Filter,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { parseEther } from "ethers";
import React from "react";
// zero address const (avoid relying on external `ethers` namespace)
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const GATEWAY_PORT =
  (import.meta.env.VITE_IPFS_GATEWAY_PORT as string) ?? "8081";
const makeGatewayUrl = (cid: string) =>
  `http://127.0.0.1:${GATEWAY_PORT}/ipfs/${cid}`;

const ResearcherMarketplace = () => {
  const { toast } = useToast();
  const { provider, account } = useWallet();
  const { contract } = useContract(); // Your contract instance
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [documents, setDocuments] = useState<any[]>([]);
  const [balance, setBalance] = useState<string>("0");

  // Get uploaded documents from localStorage (uploaded by patients)
  const getUploadedDocuments = () => {
    try {
      const stored = localStorage.getItem("patientDocuments");
      let documents: any[] = [];
      if (stored) {
        documents = JSON.parse(stored);
      }

      // Ensure each stored entry yields the fields the marketplace expects
      const mapped = (documents || []).map((doc: any, index: number) => ({
        id: index + 1,
        name: doc.name ?? `Document ${index + 1}`,
        description: doc.description ?? "",
        category: doc.category ?? "Medical Record",
        size: doc.size ?? "0 MB",
        price: doc.price ?? "0",
        hash: doc.hash ?? null,
        dataHash: doc.dataHash ?? null, // IMPORTANT: use on-chain bytes32 when available
        uploader:
          doc.owner ??
          doc.uploader ??
          `0x${Math.random().toString(16).slice(2, 8)}...`,
        uploadDate: doc.uploadDate
          ? new Date(doc.uploadDate).toLocaleDateString()
          : new Date().toLocaleDateString(),
        verified: !!doc.dataHash, // mark verified only if on-chain id exists
        downloads: doc.downloads ?? Math.floor(Math.random() * 50) + 1,
      }));

      // If there are very few documents, duplicate them for demo/testing so the grid shows many items.
      // This does not mutate localStorage; it's only for display.
      const desiredCount = 8;
      const output = [...mapped];
      let i = 0;
      while (output.length < desiredCount && mapped.length > 0) {
        const base = mapped[i % mapped.length];
        output.push({
          ...base,
          id: output.length + 1,
          name: `${base.name} (${output.length + 1})`,
        });
        i++;
      }

      console.debug("[Marketplace] loaded documents:", output);
      return output;
    } catch (error) {
      console.error("Error loading patient documents:", error);
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

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const availableDocuments = documents;

  // Get unique categories from uploaded documents
  const getCategories = () => {
    const uniqueCategories = [...new Set(documents.map((doc) => doc.category))];
    return ["all", ...uniqueCategories];
  };

  const categories = getCategories();

  const filteredDocuments = availableDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isValidBytes32 = (val?: string) => {
    if (!val) return false;
    // accept 0x + 64 hex chars
    return /^0x[0-9a-fA-F]{64}$/.test(val);
  };

  // helper keys & localStorage helpers for purchases
  const purchasesKey = (addr?: string) =>
    `purchases_${addr?.toLowerCase() ?? "unknown"}`;
  const hasPurchased = (addr: string | undefined, dataHash?: string | null) => {
    if (!addr || !dataHash) return false;
    try {
      const arr = JSON.parse(localStorage.getItem(purchasesKey(addr)) ?? "[]");
      return Array.isArray(arr) && arr.includes(dataHash);
    } catch {
      return false;
    }
  };
  const markAsPurchased = (
    addr: string | undefined,
    dataHash?: string | null
  ) => {
    if (!addr || !dataHash) return;
    try {
      const key = purchasesKey(addr);
      const arr = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (!Array.isArray(arr)) return;
      if (!arr.includes(dataHash)) {
        arr.push(dataHash);
        localStorage.setItem(key, JSON.stringify(arr));
      }
    } catch (err) {
      console.error("markAsPurchased failed", err);
    }
  };

  // decide if current user may download this doc
  const canDownload = (doc: any) => {
    // uploader allowed to download without purchase (if uploader stored as full address)
    if (
      account &&
      doc?.uploader &&
      typeof doc.uploader === "string" &&
      doc.uploader.toLowerCase() === account.toLowerCase()
    ) {
      return true;
    }
    // if doc has on-chain id, require purchase or owner (owner check only if contract available)
    if (doc?.dataHash) {
      if (hasPurchased(account, doc.dataHash)) return true;
      // if connected and contract available, check on-chain owner
      return false;
    }
    // fallback: require purchase even for unregistered items (enforce purchase-only policy)
    return hasPurchased(account, doc.hash ?? doc.dataHash);
  };

  const handlePurchase = async (doc: any) => {
    if (!provider || !contract || !account) {
      toast({
        title: "Wallet/Contract not ready",
        description: "Connect wallet and try again",
        variant: "destructive",
      });
      return;
    }

    try {
      const signer = await provider.getSigner();
      const buyerAddr = await signer.getAddress();

      // IMPORTANT: use on-chain identifier (bytes32) that was returned by registerMedicalData
      const dataHash = doc.dataHash ?? null;

      if (!dataHash || !isValidBytes32(dataHash)) {
        toast({
          title: "Not registered on-chain",
          description:
            "This document is not registered (missing on‑chain bytes32 id).",
          variant: "destructive",
        });
        return;
      }

      // safe call
      const md = await contract.getMedicalData(dataHash);
      const onChainOwner = md?.owner ?? md?.[4] ?? null;
      if (!onChainOwner || onChainOwner === ZERO_ADDRESS) {
        toast({ title: "Not registered on-chain", variant: "destructive" });
        return;
      }
      if (onChainOwner.toLowerCase() === buyerAddr.toLowerCase()) {
        toast({
          title: "Buyer is owner - cannot purchase",
          variant: "destructive",
        });
        return;
      }

      // ensure price valid then purchase
      const priceStr = String(doc.price ?? "0");
      if (Number.isNaN(Number(priceStr)) || Number(priceStr) <= 0) {
        toast({
          title: "Invalid price",
          description: "Document price invalid",
          variant: "destructive",
        });
        return;
      }

      const contractWithSigner = (contract as any).connect(signer);
      const tx = await contractWithSigner.purchaseDataAccess(dataHash, {
        value: parseEther(priceStr),
      });
      await tx.wait();
      // record purchase locally so download is enabled
      markAsPurchased(buyerAddr, dataHash);
      // refresh documents state to update UI (buyer state)
      setDocuments((prev) => [...prev]);
      toast({ title: "Purchase successful" });
    } catch (err: any) {
      console.error("Purchase error:", err);
      toast({
        title: "Purchase Failed",
        description: err?.message ?? String(err),
        variant: "destructive",
      });
    }
  };

  const handlePreview = (doc: any) => {
    if (!doc?.hash) {
      console.warn("No CID for preview", doc);
      toast({
        title: "No IPFS CID",
        description: "This document has no IPFS CID",
        variant: "destructive",
      });
      return;
    }
    const url = makeGatewayUrl(doc.hash);
    window.open(url, "_blank");
  };

  const handleDownload = async (doc: any) => {
    // Only allow download if user has purchased (or is uploader/owner)
    if (!canDownload(doc)) {
      if (!account) {
        toast({
          title: "Connect Wallet",
          description:
            "You must connect your wallet to download this document after purchase.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Purchase required",
        description:
          "You must purchase access to this document before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (!doc?.hash) {
      toast({
        title: "No IPFS CID",
        description: "This document has no IPFS CID",
        variant: "destructive",
      });
      return;
    }

    const url = makeGatewayUrl(doc.hash);
    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(
          `Gateway fetch failed: ${res.status} ${res.statusText}`
        );
      const blob = await res.blob();
      const filename = doc.name ?? `${doc.hash}.bin`;
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);
      toast({ title: "Download started", description: filename });
    } catch (err: any) {
      console.error("Download failed:", err);
      toast({
        title: "Download failed",
        description: err?.message ?? String(err),
        variant: "destructive",
      });
    }
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
              Medical Data{" "}
              <span className="bg-gradient-medical bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access verified medical data uploaded by patients. All documents
              are blockchain-verified and AI-validated for authenticity.
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <Badge
                      variant={doc.verified ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {doc.verified ? "✓ Verified" : "Not registered"}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {doc.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>

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
                      <span className="text-lg font-bold text-primary">
                        {doc.price} tokens
                      </span>
                      <Badge variant="outline" className="text-xs">
                        IPFS:{" "}
                        {doc.hash
                          ? String(doc.hash).slice(0, 8) + "..."
                          : "N/A"}
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
                        onClick={() => handleDownload(doc)}
                        disabled={!doc.hash || !canDownload(doc)}
                      >
                        Download
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePurchase(doc)}
                        disabled={!doc.dataHash} // disable purchase if not registered on-chain
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
              <h3 className="text-lg font-medium text-foreground mb-2">
                No documents found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new
                uploads.
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
