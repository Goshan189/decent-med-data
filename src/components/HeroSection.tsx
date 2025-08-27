import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, Lock } from "lucide-react";
import heroImage from "@/assets/hero-background-clean.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src={heroImage} 
          alt="Medical data network" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-background/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-medical">
          <Shield className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-blockchain">
          <Lock className="w-8 h-8 text-accent" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="p-4 bg-card/80 backdrop-blur-sm rounded-full shadow-glow">
          <Zap className="w-8 h-8 text-success" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full shadow-glow">
            <Zap className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground">AI-Powered • Blockchain-Secured</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white leading-tight">
            Decentralized AI-Powered
            <br />
            <span className="text-black dark:text-white">
              Medical Data Marketplace
            </span>
          </h1>

          {/* Subtitle */}
          <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
              Empowering patients to own their medical data while enabling researchers to access 
              verified, AI-validated datasets through secure smart contracts and P2P blockchain technology.
            </p>
          </div>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
              <Users className="w-4 h-4 text-secondary-foreground" />
              Publisher-Subscriber Model
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
              <Shield className="w-4 h-4 text-accent" />
              Smart Contract Security
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-success/20 rounded-full">
              <Zap className="w-4 h-4 text-success" />
              AI Validation
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start as Patient Publisher
            </Button>
            <Button variant="medical" size="lg" className="text-lg px-8 py-4">
              Join as Researcher
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p>Powered by • Ethereum Smart Contracts • IPFS Storage • MetaMask Integration</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;