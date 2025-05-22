-- Create tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create task_tags junction table
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (task_id, tag_id)
);

-- Create journal_tags junction table
CREATE TABLE journal_tags (
  journal_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (journal_id, tag_id)
);

-- Add RLS policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON tags
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON tags
  FOR DELETE USING (true);

-- Similar policies for junction tables
CREATE POLICY "Enable read access for all users" ON task_tags
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON task_tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON task_tags
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON journal_tags
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON journal_tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON journal_tags
  FOR DELETE USING (true); 