import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { MenuItem } from "@/pages/customer/Dashboard";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      veg: "bg-food-veg text-white",
      non_veg: "bg-food-nonveg text-white",
      meals: "bg-primary text-primary-foreground",
      starters: "bg-accent text-accent-foreground",
      beverages: "bg-secondary text-secondary-foreground",
      snacks: "bg-food-warm text-white",
    };
    return colors[category] || "bg-muted";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
          <Badge className={getCategoryColor(item.category)}>
            {item.category.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-2xl font-bold text-primary">₹{item.price.toFixed(2)}</span>
        <Button onClick={() => onAddToCart(item)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
