import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChefHat, Shield } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Welcome to SmartCanteen</h1>
          <p className="text-lg text-muted-foreground">Please select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary"
            onClick={() => navigate("/auth/customer")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Customer</CardTitle>
              <CardDescription className="text-base">
                Browse menu and place orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Customer Login
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-secondary"
            onClick={() => navigate("/auth/employee")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-fit">
                <ChefHat className="w-12 h-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Employee</CardTitle>
              <CardDescription className="text-base">
                Manage orders and kitchen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" variant="secondary">
                Employee Login
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent"
            onClick={() => navigate("/auth/admin")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                <Shield className="w-12 h-12 text-accent" />
              </div>
              <CardTitle className="text-2xl">Admin</CardTitle>
              <CardDescription className="text-base">
                View analytics and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}>
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
