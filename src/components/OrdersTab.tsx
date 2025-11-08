import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, CheckCircle, XCircle, ChefHat } from "lucide-react";

interface Order {
  id: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_status_updates: Array<{
    status: string;
    message: string | null;
    created_at: string;
  }>;
  order_items: Array<{
    quantity: number;
    price: number;
    menu_items: {
      name: string;
    };
  }>;
}

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user?.id}`
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_status_updates(status, message, created_at),
        order_items(
          quantity,
          price,
          menu_items(name)
        )
      `)
      .eq("customer_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
      case "preparing":
        return <ChefHat className="h-4 w-4" />;
      case "ready":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-green-500";
      case "completed":
        return "bg-green-700";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No orders yet. Start by adding items to your cart!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  {format(new Date(order.created_at), "PPp")}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="space-y-1">
                {order.order_items.map((item: any, index: number) => (
                  <li key={index} className="text-sm">
                    {item.quantity}x {item.menu_items.name} - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Payment: </span>
                <Badge variant="outline">{order.payment_method}</Badge>
              </div>
              <div className="text-lg font-bold text-primary">
                Total: ₹{order.total_amount.toFixed(2)}
              </div>
            </div>

            {order.order_status_updates.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">Status Updates:</h4>
                <div className="space-y-2">
                  {order.order_status_updates
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 3)
                    .map((update, index) => (
                      <div key={index} className="text-sm flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getStatusColor(update.status)}`}></div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{update.status.replace("_", " ")}</p>
                          {update.message && (
                            <p className="text-muted-foreground">{update.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(update.created_at), "p")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersTab;
