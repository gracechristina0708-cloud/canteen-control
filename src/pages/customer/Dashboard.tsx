import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, LogOut, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MenuItemCard from "@/components/MenuItemCard";
import CartSheet from "@/components/CartSheet";
import OrdersTab from "@/components/OrdersTab";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

const CustomerDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (profile?.role !== "customer") {
      navigate("/");
    }
    fetchMenuItems();
  }, [profile, navigate]);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("category", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const categories = [
    { value: "all", label: "All Items" },
    { value: "veg", label: "Veg", color: "text-food-veg" },
    { value: "non_veg", label: "Non-Veg", color: "text-food-nonveg" },
    { value: "meals", label: "Meals", color: "text-primary" },
    { value: "starters", label: "Starters", color: "text-accent" },
    { value: "beverages", label: "Beverages", color: "text-secondary" },
    { value: "snacks", label: "Snacks", color: "text-food-warm" },
  ];

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">MEC Bites</h1>
            <p className="text-sm text-muted-foreground">Welcome, {profile?.name}! Browse and order your favorite food</p>
          </div>
          <div className="flex items-center gap-4">
            <CartSheet cart={cart} setCart={setCart} />
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">
              <Clock className="mr-2 h-4 w-4" />
              My Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Menu Categories</CardTitle>
                <CardDescription>Select a category to filter items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Badge
                      key={cat.value}
                      variant={selectedCategory === cat.value ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm ${cat.color || ""}`}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading menu...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomerDashboard;
