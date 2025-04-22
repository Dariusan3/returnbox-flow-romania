-- Create enum for pickup status
CREATE TYPE pickup_status AS ENUM ('scheduled', 'picked_up', 'cancelled');

-- Create enum for time slots
CREATE TYPE time_slot AS ENUM ('morning', 'afternoon', 'evening');

-- Create enum for package sizes
CREATE TYPE package_size AS ENUM ('small', 'medium', 'large');

-- Create enum for item condition
CREATE TYPE item_condition AS ENUM ('sealed', 'opened', 'defective');

-- Create pickups table
CREATE TABLE pickups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  return_id UUID REFERENCES returns(id) NOT NULL,
  pickup_date DATE NOT NULL,
  time_slot time_slot NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  package_size package_size NOT NULL,
  status pickup_status DEFAULT 'scheduled',
  courier_tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create refund policies table
CREATE TABLE refund_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID REFERENCES auth.users(id) NOT NULL,
  item_condition item_condition NOT NULL,
  refund_percentage INTEGER NOT NULL CHECK (refund_percentage >= 0 AND refund_percentage <= 100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(merchant_id, item_condition)
);

-- Add RLS policies
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_policies ENABLE ROW LEVEL SECURITY;

-- Pickups policies
CREATE POLICY "Customers can view their own pickups"
  ON pickups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can create pickups"
  ON pickups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update their own pickups"
  ON pickups FOR UPDATE
  USING (auth.uid() = user_id);

-- Refund policies policies
CREATE POLICY "Anyone can view refund policies"
  ON refund_policies FOR SELECT
  USING (true);

CREATE POLICY "Merchants can create their own refund policies"
  ON refund_policies FOR INSERT
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update their own refund policies"
  ON refund_policies FOR UPDATE
  USING (auth.uid() = merchant_id);