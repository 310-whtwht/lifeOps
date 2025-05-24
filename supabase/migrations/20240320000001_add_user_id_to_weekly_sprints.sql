-- Add user_id column to weekly_sprints table
ALTER TABLE weekly_sprints
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add RLS policies for weekly_sprints
ALTER TABLE weekly_sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weekly sprints"
  ON weekly_sprints FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own weekly sprints"
  ON weekly_sprints FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own weekly sprints"
  ON weekly_sprints FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own weekly sprints"
  ON weekly_sprints FOR DELETE
  USING (user_id = auth.uid());

-- Update existing records to use the current user's ID
UPDATE weekly_sprints
SET user_id = auth.uid()
WHERE user_id IS NULL; 