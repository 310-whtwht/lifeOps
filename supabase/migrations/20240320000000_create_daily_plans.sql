-- Create daily_plans table
CREATE TABLE daily_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekly_sprint_id UUID REFERENCES weekly_sprints(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activities TEXT NOT NULL,
  hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily plans"
  ON daily_plans FOR SELECT
  USING (
    weekly_sprint_id IN (
      SELECT id FROM weekly_sprints
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own daily plans"
  ON daily_plans FOR INSERT
  WITH CHECK (
    weekly_sprint_id IN (
      SELECT id FROM weekly_sprints
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own daily plans"
  ON daily_plans FOR UPDATE
  USING (
    weekly_sprint_id IN (
      SELECT id FROM weekly_sprints
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own daily plans"
  ON daily_plans FOR DELETE
  USING (
    weekly_sprint_id IN (
      SELECT id FROM weekly_sprints
      WHERE user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON daily_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 