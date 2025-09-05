import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Menu, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { account, connectWallet, isConnected } = useWallet();

  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-full">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MedData</h1>
              <p className="text-xs text-muted-foreground">Decentralized • AI-Powered</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                  How it Works
                </a>
                <a href="#for-patients" className="text-foreground hover:text-primary transition-colors">
                  For Patients
                </a>
                <a href="#for-researchers" className="text-foreground hover:text-primary transition-colors">
                  For Researchers
                </a>
                <a href="#technology" className="text-foreground hover:text-primary transition-colors">
                  Technology
                </a>
              </>
            ) : (
              <>
                <Link to="/register" className="text-foreground hover:text-primary transition-colors">
                  Register Data
                </Link>
                <Link to="/storage" className="text-foreground hover:text-primary transition-colors">
                  IPFS Storage
                </Link>
                <Link to="/verify" className="text-foreground hover:text-primary transition-colors">
                  Verify Data
                </Link>
                <Link to="/transactions" className="text-foreground hover:text-primary transition-colors">
                  Transactions
                </Link>
              </>
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-success rounded-full mr-2" />
              Mainnet Live
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={isConnected ? () => {} : connectWallet}
              asChild={isConnected}
            >
              {isConnected ? (
                <Link to="/wallet">
                  <Wallet className="w-4 h-4 mr-2" />
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </Link>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <nav className="py-4 space-y-4">
              {isHomePage ? (
                <>
                  <a href="#how-it-works" className="block text-foreground hover:text-primary transition-colors">
                    How it Works
                  </a>
                  <a href="#for-patients" className="block text-foreground hover:text-primary transition-colors">
                    For Patients
                  </a>
                  <a href="#for-researchers" className="block text-foreground hover:text-primary transition-colors">
                    For Researchers
                  </a>
                  <a href="#technology" className="block text-foreground hover:text-primary transition-colors">
                    Technology
                  </a>
                </>
              ) : (
                <>
                  <Link to="/register" className="block text-foreground hover:text-primary transition-colors">
                    Register Data
                  </Link>
                  <Link to="/storage" className="block text-foreground hover:text-primary transition-colors">
                    IPFS Storage
                  </Link>
                  <Link to="/verify" className="block text-foreground hover:text-primary transition-colors">
                    Verify Data
                  </Link>
                  <Link to="/transactions" className="block text-foreground hover:text-primary transition-colors">
                    Transactions
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-border space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={isConnected ? () => {} : connectWallet}
                  asChild={isConnected}
                >
                  {isConnected ? (
                    <Link to="/wallet">
                      <Wallet className="w-4 h-4 mr-2" />
                      {account?.slice(0, 6)}...{account?.slice(-4)}
                    </Link>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
                <Button variant="hero" size="sm" className="w-full" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;