-- 週間スプリントテーブル
CREATE TABLE weekly_sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_hours INTEGER NOT NULL DEFAULT 16,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 週間スプリントタスクテーブル
CREATE TABLE weekly_sprint_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sprint_id UUID REFERENCES weekly_sprints(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    estimated_hours DECIMAL(4,1) NOT NULL,
    actual_hours DECIMAL(4,1),
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_weekly_sprints_dates ON weekly_sprints(week_start_date, week_end_date);
CREATE INDEX idx_weekly_sprint_tasks_sprint_id ON weekly_sprint_tasks(sprint_id);
CREATE INDEX idx_weekly_sprint_tasks_task_id ON weekly_sprint_tasks(task_id);

-- 更新トリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_weekly_sprints_updated_at
    BEFORE UPDATE ON weekly_sprints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_sprint_tasks_updated_at
    BEFORE UPDATE ON weekly_sprint_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 