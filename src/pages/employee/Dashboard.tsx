import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, CheckCircle, XCircle, Clock, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  profiles: {
    name: string;
    email: string | null;
  };
  order_items: Array<{
    quantity: number;
    price: number;
    menu_items: {
      name: string;
      category: string;
    };
  }>;
}

const EmployeeDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== "employee") {
      navigate("/");
    }
    fetchOrders();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('employee-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, navigate]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        profiles!orders_customer_id_fkey(name, email),
        order_items(
          quantity,
          price,
          menu_items(name, category)
        )
      `)
      .in("status", ["pending", "accepted", "preparing", "ready"])
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled", message: string) => {
    try {
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (orderError) throw orderError;

      const { error: statusError } = await supabase
        .from("order_status_updates")
        .insert([{
          order_id: orderId,
          status,
          message,
          updated_by: profile?.id,
        }]);

      if (statusError) throw statusError;

      toast({
        title: "Order Updated",
        description: message,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
        return "bg-blue-500";
      case "preparing":
        return "bg-orange-500";
      case "ready":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage incoming orders</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
            <CardDescription>
              {orders.length} order{orders.length !== 1 ? "s" : ""} pending
            </CardDescription>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active orders at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        Customer: {order.profiles.name}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "PPp")}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Items:</h4>
                    <ul className="space-y-1">
                      {order.order_items.map((item: any, index: number) => (
                        <li key={index} className="text-sm flex justify-between">
                          <span>{item.quantity}x {item.menu_items.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.menu_items.category}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {order.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "accepted",
                              "Order accepted and being prepared"
                            )
                          }
                          className="flex-1"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "cancelled",
                              "Sorry, order cancelled"
                            )
                          }
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    )}

                    {order.status === "accepted" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "preparing",
                            "Food is getting ready"
                          )
                        }
                        className="w-full"
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}

                    {order.status === "preparing" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "ready",
                            "Your food is ready! You can come and collect it now"
                          )
                        }
                        className="w-full"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Ready
                      </Button>
                    )}

                    {order.status === "ready" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "completed",
                            "Order completed"
                          )
                        }
                        className="w-full"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
