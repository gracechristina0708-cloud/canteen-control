-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'employee', 'admin');

-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled');

-- Create enum for payment method
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'online');

-- Create enum for food category
CREATE TYPE food_category AS ENUM ('veg', 'non_veg', 'meals', 'starters', 'beverages', 'snacks');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category food_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  status order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL
);

-- Create order_status_updates table for tracking order progress
CREATE TABLE order_status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL,
  message TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Employees can view customer profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Employees and admins can manage menu items"
  ON menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Employees and admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );

CREATE POLICY "Employees and admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view order items for their orders"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('employee', 'admin')
      ))
    )
  );

CREATE POLICY "Customers can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- RLS Policies for order_status_updates
CREATE POLICY "Users can view status updates for their orders"
  ON order_status_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_status_updates.order_id
      AND (orders.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('employee', 'admin')
      ))
    )
  );

CREATE POLICY "Employees can create status updates"
  ON order_status_updates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('employee', 'admin')
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_updates;

-- Insert sample menu items
INSERT INTO menu_items (name, description, category, price, image_url) VALUES
  ('Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables and aromatic spices', 'veg', 150.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8'),
  ('Chicken Tikka Masala', 'Tender chicken in creamy tomato gravy', 'non_veg', 220.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641'),
  ('Paneer Butter Masala', 'Cottage cheese cubes in rich buttery gravy', 'veg', 180.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7'),
  ('Meals Thali', 'Complete meal with rice, roti, dal, vegetables, and dessert', 'meals', 200.00, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe'),
  ('Samosa', 'Crispy fried pastry with spiced potato filling', 'starters', 40.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950'),
  ('Spring Rolls', 'Crispy vegetable rolls with sweet chili sauce', 'starters', 80.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb'),
  ('Masala Chai', 'Traditional Indian spiced tea', 'beverages', 30.00, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f'),
  ('Mango Lassi', 'Creamy yogurt drink with fresh mango', 'beverages', 60.00, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4'),
  ('Vada Pav', 'Spiced potato fritter in a bun', 'snacks', 50.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84'),
  ('Pav Bhaji', 'Spiced mashed vegetables with buttered bread', 'snacks', 120.00, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027');