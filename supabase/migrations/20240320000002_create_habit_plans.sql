-- Create habit_plans table
CREATE TABLE habit_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  activities TEXT NOT NULL,
  hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, day_of_week)
);

-- Add RLS policies
ALTER TABLE habit_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habit plans"
  ON habit_plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own habit plans"
  ON habit_plans FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own habit plans"
  ON habit_plans FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own habit plans"
  ON habit_plans FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON habit_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 