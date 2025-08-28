import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Lock } from "lucide-react";
import heroImage from "@/assets/hero-medical-network.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Medical data network" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-10 animate-float">
        <div className="p-2 sm:p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-medical">
          <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-32 sm:top-40 right-4 sm:right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="p-2 sm:p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-blockchain">
          <Lock className="w-5 h-5 sm:w-8 sm:h-8 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-32 sm:bottom-40 left-4 sm:left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="p-2 sm:p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-glow">
          <Zap className="w-5 h-5 sm:w-8 sm:h-8 text-success" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-card/80 backdrop-blur-sm rounded-full shadow-glow">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <span className="text-xs sm:text-sm font-medium text-foreground">AI-Powered • Blockchain-Secured</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Decentralized AI-Powered
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Medical Data Marketplace
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 max-w-4xl mx-auto leading-relaxed px-2">
            Empowering patients to own their medical data while enabling researchers to access 
            verified, AI-validated datasets through secure smart contracts and P2P blockchain technology.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm font-medium px-2">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-secondary/50 rounded-full">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
              <span className="hidden sm:inline">Publisher-Subscriber Model</span>
              <span className="sm:hidden">Publisher-Subscriber</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-accent/20 rounded-full">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
              <span className="hidden sm:inline">Smart Contract Security</span>
              <span className="sm:hidden">Smart Contracts</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-success/20 rounded-full">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
              <span>AI Validation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button variant="hero" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Start as Patient Publisher
            </Button>
            <Button variant="medical" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              Join as Researcher
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 sm:pt-8 text-xs sm:text-sm text-foreground/80 px-2">
            <p className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <span>Powered by</span>
              <span>•</span>
              <span>Ethereum Smart Contracts</span>
              <span>•</span>
              <span>IPFS Storage</span>
              <span>•</span>
              <span>MetaMask Integration</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;