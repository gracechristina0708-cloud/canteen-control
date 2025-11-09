import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ChefHat, UserCog, ArrowLeft } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();

  const roles = [
    {
      type: "customer",
      title: "Customer Login",
      description: "Order your favorite food and track delivery",
      icon: ShoppingCart,
      color: "bg-primary hover:bg-primary/90",
      borderColor: "border-primary/30 hover:border-primary",
    },
    {
      type: "employee",
      title: "Employee Login",
      description: "Manage orders and update preparation status",
      icon: ChefHat,
      color: "bg-secondary hover:bg-secondary/90",
      borderColor: "border-secondary/30 hover:border-secondary",
    },
    {
      type: "admin",
      title: "Admin Login",
      description: "Monitor orders and analyze business insights",
      icon: UserCog,
      color: "bg-accent hover:bg-accent/90",
      borderColor: "border-accent/30 hover:border-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Welcome to MEC Bites
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.type}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 ${role.borderColor}`}
              onClick={() => navigate(`/auth/${role.type}`)}
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-6 bg-gradient-to-br from-background to-muted rounded-2xl w-fit">
                  <role.icon className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className={`w-full ${role.color} text-white font-semibold py-6 text-lg rounded-xl`}
                  size="lg"
                >
                  Login as {role.type.charAt(0).toUpperCase() + role.type.slice(1)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
