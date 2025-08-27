import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import RoleBasedSections from "@/components/RoleBasedSections";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <RoleBasedSections />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
