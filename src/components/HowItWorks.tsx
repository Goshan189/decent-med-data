import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, ShieldCheck, Coins, FileText, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Patients Publish Data",
      description: "Upload AI-validated, redacted medical records to IPFS with full ownership control",
      badge: "Publisher Role",
      color: "medical"
    },
    {
      icon: Search,
      title: "Researchers Subscribe",
      description: "Browse and subscribe to specific data types based on research needs and verified credentials",
      badge: "Subscriber Role", 
      color: "blockchain"
    },
    {
      icon: ShieldCheck,
      title: "Smart Contract Validation",
      description: "AI validates data quality while smart contracts enforce access rules and permissions",
      badge: "AI + Blockchain",
      color: "success"
    },
    {
      icon: Coins,
      title: "Automated Transactions",
      description: "Payments and licensing handled automatically with full audit trail on-chain",
      badge: "Decentralized",
      color: "primary"
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Off-Chain Storage",
      description: "Data stored securely on IPFS with only hashed references on blockchain for integrity"
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Only authorized researchers with verified credentials can access datasets"
    },
    {
      icon: ShieldCheck,
      title: "No Ownership Transfer",
      description: "Patients retain full ownership - researchers get temporary, purpose-bound access only"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How the <span className="bg-gradient-primary bg-clip-text text-transparent">P2P System</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A revolutionary Publisher-Subscriber model where patients control their data 
            and researchers access it through secure, AI-validated smart contracts.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-glow transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {step.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-6 bg-card rounded-lg shadow-medical">
                <div className="p-3 bg-secondary rounded-full flex-shrink-0">
                  <Icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;