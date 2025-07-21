-- Create portfolio_links table
CREATE TABLE portfolio_links (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster ordering
CREATE INDEX idx_portfolio_links_created_at ON portfolio_links(created_at DESC);

-- Enable Row Level Security (RLS) - but allow all operations for now
-- You can enable RLS later and add policies as needed
ALTER TABLE portfolio_links ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (you can modify this later)
CREATE POLICY "Allow all operations on portfolio_links" ON portfolio_links
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);