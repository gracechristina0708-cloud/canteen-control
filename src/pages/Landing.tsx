import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-card p-8 rounded-full shadow-2xl">
              <UtensilsCrossed className="w-24 h-24 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SmartCanteen
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your digital solution for hassle-free canteen ordering and management
          </p>
        </div>

        <Button 
          size="lg" 
          className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => navigate("/select-role")}
        >
          Get Started
        </Button>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-primary">For Customers</h3>
            <p className="text-sm text-muted-foreground">Browse menu, order food, and track your orders in real-time</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-secondary">For Employees</h3>
            <p className="text-sm text-muted-foreground">Manage incoming orders and update preparation status</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border shadow-lg">
            <h3 className="font-semibold text-lg mb-2 text-accent">For Admins</h3>
            <p className="text-sm text-muted-foreground">Monitor all transactions and analyze order history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
