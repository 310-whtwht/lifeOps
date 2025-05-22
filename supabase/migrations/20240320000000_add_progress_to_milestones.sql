-- Add progress column to milestones table
ALTER TABLE milestones
ADD COLUMN progress INTEGER NOT NULL DEFAULT 0;

-- Update existing milestones to have 0 progress
UPDATE milestones
SET progress = 0
WHERE progress IS NULL; 