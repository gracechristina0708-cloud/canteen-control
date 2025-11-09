import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, TrendingUp, ShoppingBag, XCircle, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  profiles: {
    name: string;
    mobile: string | null;
  };
  order_items: Array<{
    quantity: number;
    menu_items: {
      name: string;
    };
  }>;
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== "admin") {
      navigate("/");
    }
    fetchOrders();
  }, [profile, navigate]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        profiles!orders_customer_id_fkey(name, mobile),
        order_items(
          quantity,
          menu_items(name)
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAllOrders(data as any);
    }
    setLoading(false);
  };

  const completedOrders = allOrders.filter((o) => o.status === "completed");
  const cancelledOrders = allOrders.filter((o) => o.status === "cancelled");

  const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const averageOrderValue = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;

  const paymentMethodStats = completedOrders.reduce((acc, order) => {
    acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-primary">
              {(order as any).order_number || `Order #${order.id.slice(0, 8)}`}
            </CardTitle>
            <CardDescription>Customer: {order.profiles.name}</CardDescription>
            {order.profiles.mobile && (
              <p className="text-sm text-muted-foreground">📱 {order.profiles.mobile}</p>
            )}
          </div>
          <Badge
            variant={order.status === "completed" ? "default" : "destructive"}
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">
            Date: {format(new Date(order.created_at), "PPp")}
          </p>
          <p className="text-muted-foreground">
            Payment: <Badge variant="outline">{order.payment_method}</Badge>
          </p>
        </div>
        
        <div className="text-sm">
          <p className="font-semibold mb-1">Items:</p>
          <ul className="space-y-0.5">
            {order.order_items.map((item: any, index: number) => (
              <li key={index} className="text-muted-foreground">
                {item.quantity}x {item.menu_items.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-medium">Amount Paid</span>
          <span className="text-lg font-bold text-primary">
            ₹{order.total_amount.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">MEC Bites - Admin</h1>
            <p className="text-sm text-muted-foreground">Monitor all transactions and analytics</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedOrders.length} completed, {cancelledOrders.length} cancelled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From completed orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Per completed order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelledOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {allOrders.length > 0 
                  ? ((cancelledOrders.length / allOrders.length) * 100).toFixed(1)
                  : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment methods for completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(paymentMethodStats).map(([method, count]) => (
                <Badge key={method} variant="outline" className="px-4 py-2">
                  {method}: {count} orders
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="completed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="completed">
              Completed Orders ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled Orders ({cancelledOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : completedOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No completed orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : cancelledOrders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No cancelled orders</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledOrders.map(renderOrderCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
