import { Activity, Github, Twitter, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-full">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">MedData</h3>
                <p className="text-xs text-muted-foreground">Decentralized • AI-Powered</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Revolutionizing medical data sharing through blockchain technology and AI validation.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">For Patients</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">For Researchers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Smart Contracts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">IPFS Storage</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">AI Validation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Github className="w-4 h-4 mr-2" />
                GitHub
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 MedData. Empowering healthcare through decentralization.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;