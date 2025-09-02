import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck, Database, Shield, Coins, Brain } from "lucide-react";
import securityImage from "@/assets/security-medical.jpg";
import researchImage from "@/assets/research-lab.jpg";

const RoleBasedSections = () => {
  const patientFeatures = [
    "Upload and own your medical data",
    "AI validation ensures data quality",
    "Control who accesses your information",
    "Earn tokens from data sharing",
    "Full audit trail of all access",
    "HIPAA-compliant data handling"
  ];

  const researcherFeatures = [
    "Access verified, high-quality datasets",
    "Subscribe to specific data types",
    "Role-based permission system",
    "Automated licensing and payments",
    "Purpose-bound access restrictions",
    "Blockchain-verified authenticity"
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Patients Section */}
        <div id="for-patients" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-20 lg:mb-24">
          <div className="order-2 lg:order-1">
            <img 
              src={securityImage} 
              alt="Medical data security" 
              className="rounded-lg shadow-medical w-full h-auto"
            />
          </div>
          <div className="order-1 lg:order-2">
            <Badge variant="outline" className="mb-3 sm:mb-4 text-secondary-foreground border-secondary">
              <User className="w-4 h-4 mr-2" />
              For Patients
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Your Data, <span className="bg-gradient-medical bg-clip-text text-transparent">Your Control</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Take ownership of your medical data and contribute to medical research 
              while maintaining complete privacy and control. Earn rewards for sharing 
              validated data with verified researchers.
            </p>
            
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {patientFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-secondary rounded-full flex-shrink-0">
                    <Shield className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="medical" size="lg" className="w-full sm:w-auto">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Publishing Data
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Researchers Section */}
        <div id="for-researchers" className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div>
            <Badge variant="outline" className="mb-3 sm:mb-4 text-accent-foreground border-accent">
              <UserCheck className="w-4 h-4 mr-2" />
              For Researchers
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Access Verified <span className="bg-gradient-blockchain bg-clip-text text-transparent">Research Data</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Subscribe to high-quality, AI-validated medical datasets with complete 
              transparency and blockchain-verified authenticity. Focus on research, 
              not data acquisition challenges.
            </p>
            
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {researcherFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-accent/20 rounded-full flex-shrink-0">
                    <Brain className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="blockchain" size="lg" className="w-full sm:w-auto">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Browse Datasets
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </div>
          </div>
          <div>
            <img 
              src={researchImage} 
              alt="Research laboratory" 
              className="rounded-lg shadow-blockchain w-full h-auto"
            />
          </div>
        </div>

        {/* Technology Stack */}
        <div id="technology" className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">
            Built on Cutting-Edge Technology
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {[
              { name: "Solidity", desc: "Smart Contracts" },
              { name: "IPFS", desc: "Data Storage" },
              { name: "Ganache", desc: "Blockchain" },
              { name: "MetaMask", desc: "Wallet Integration" },
              { name: "React", desc: "Frontend" }
            ].map((tech, index) => (
              <Card key={index} className="p-3 sm:p-4 hover:shadow-glow transition-all duration-300">
                <CardContent className="text-center p-0">
                  <h4 className="font-semibold text-sm sm:text-base text-primary mb-1">{tech.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{tech.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleBasedSections;