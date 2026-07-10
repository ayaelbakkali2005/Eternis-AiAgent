-- =============================================================================
-- 🏢 ETERNIS ERP SYSTEM - COMPLETE DATABASE SCHEMA & SEED DATA
-- PostgreSQL 15 | Docker Entrypoint Compatible
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search (optional)

-- =============================================================================
-- 👥 USERS & AUTHENTICATION
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'employee', 'client')) DEFAULT 'employee',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 👥 HR & EMPLOYEES
-- =============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    manager_id INTEGER,
    budget_allocated DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE,
    manager_id INTEGER REFERENCES employees(id),
    performance_rating VARCHAR(20) CHECK (performance_rating IN ('excellent', 'good', 'average', 'needs_improvement')) DEFAULT 'good',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'remote', 'holiday', 'sick')) DEFAULT 'present',
    notes TEXT,
    UNIQUE(employee_id, date)
);

-- =============================================================================
--  PROJECTS & TASKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('planning', 'development', 'testing', 'review', 'completed', 'cancelled', 'on_hold')) DEFAULT 'planning',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    start_date DATE,
    deadline DATE,
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    client_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    role VARCHAR(50),
    assigned_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(project_id, employee_id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(20) UNIQUE NOT NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES employees(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked')) DEFAULT 'todo',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 💰 FINANCE & BILLING
-- =============================================================================
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    period VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    allocated DECIMAL(12, 2) NOT NULL,
    spent DECIMAL(12, 2) DEFAULT 0,
    forecast_status VARCHAR(20) CHECK (forecast_status IN ('on_track', 'at_risk', 'overrun', 'under_budget')) DEFAULT 'on_track',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(period, category)
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id),
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    receipt_url VARCHAR(500),
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'reimbursed')) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(20) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    project_id INTEGER REFERENCES projects(id),
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 🔔 NOTIFICATIONS & AUDIT
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('info', 'warning', 'error', 'success', 'system')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 📊 INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_name);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at);

-- =============================================================================
-- 🔄 TRIGGER FOR updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 🎭 SEED DATA (واقعية للعرض ← آمنة وغير حساسة)
-- =============================================================================

-- Users (password_hash is dummy ← استخدم /api/auth/register في الإنتاج)
INSERT INTO users (user_id, email, password_hash, role, department) VALUES
('admin', 'admin@eternis.com', '$2b$12$KIXxPZ6h8vJ9mK3nL4pQ7O.rT8wY2vX1zN5mP4qR3sT6uV7wX8yZ0', 'admin', 'IT'),
('manager1', 'sarah.manager@eternis.com', '$2b$12$dummyhashplaceholder12345678901234567890123456789012', 'manager', 'Projects'),
('emp1', 'john.doe@eternis.com', '$2b$12$dummyhashplaceholder12345678901234567890123456789012', 'employee', 'IT')
ON CONFLICT (user_id) DO NOTHING;

-- Employees
INSERT INTO employees (employee_id, full_name, email, role, department, salary, performance_rating) VALUES
('E001', 'John Doe', 'john.doe@eternis.com', 'Senior Python Developer', 'IT', 85000.00, 'excellent'),
('E002', 'Sarah Smith', 'sarah.smith@eternis.com', 'UX Designer', 'Design', 72000.00, 'good'),
('E003', 'Mike Johnson', 'mike.johnson@eternis.com', 'DevOps Engineer', 'IT', 90000.00, 'excellent'),
('E004', 'Emily Chen', 'emily.chen@eternis.com', 'Project Manager', 'Projects', 95000.00, 'excellent'),
('E005', 'David Brown', 'david.brown@eternis.com', 'QA Engineer', 'IT', 68000.00, 'good'),
('E006', 'Lisa Wang', 'lisa.wang@eternis.com', 'Financial Analyst', 'Finance', 78000.00, 'good')
ON CONFLICT (employee_id) DO NOTHING;

-- Projects
INSERT INTO projects (project_id, name, description, budget, status, priority, start_date, deadline, progress, client_name) VALUES
('P41A05199', 'Payment App', 'Mobile payment integration platform for FinTech clients', 50000.00, 'planning', 'high', '2024-01-01', '2024-06-30', 0, 'FinTech Corp'),
('P41A05200', 'Mobile CRM', 'Customer relationship management app for retail businesses', 75000.00, 'development', 'medium', '2023-11-15', '2024-08-30', 45, 'RetailPlus'),
('P41A05201', 'Analytics Dashboard', 'Real-time business intelligence dashboard', 30000.00, 'completed', 'low', '2023-06-01', '2023-12-31', 100, 'Internal'),
('P41A05202', 'HR Portal', 'Employee self-service portal for leave & payroll', 40000.00, 'testing', 'medium', '2024-02-01', '2024-09-15', 75, 'Internal')
ON CONFLICT (project_id) DO NOTHING;

-- Project Members
INSERT INTO project_members (project_id, employee_id, role) VALUES
((SELECT id FROM projects WHERE project_id='P41A05199'), (SELECT id FROM employees WHERE employee_id='E001'), 'Lead Developer'),
((SELECT id FROM projects WHERE project_id='P41A05199'), (SELECT id FROM employees WHERE employee_id='E003'), 'DevOps Support'),
((SELECT id FROM projects WHERE project_id='P41A05200'), (SELECT id FROM employees WHERE employee_id='E002'), 'UX Lead'),
((SELECT id FROM projects WHERE project_id='P41A05200'), (SELECT id FROM employees WHERE employee_id='E001'), 'Backend Developer'),
((SELECT id FROM projects WHERE project_id='P41A05201'), (SELECT id FROM employees WHERE employee_id='E005'), 'QA Lead'),
((SELECT id FROM projects WHERE project_id='P41A05202'), (SELECT id FROM employees WHERE employee_id='E004'), 'Project Owner')
ON CONFLICT DO NOTHING;

-- Budgets
INSERT INTO budgets (period, category, allocated, spent, forecast_status) VALUES
('Q1-2024', 'salaries', 300000.00, 295000.00, 'on_track'),
('Q1-2024', 'infrastructure', 125000.00, 118000.00, 'on_track'),
('Q1-2024', 'tools', 50000.00, 48000.00, 'on_track'),
('Q2-2024', 'salaries', 330000.00, 225000.00, 'on_track'),
('Q2-2024', 'infrastructure', 137500.00, 95000.00, 'on_track'),
('Q2-2024', 'tools', 55000.00, 38000.00, 'on_track'),
('Q2-2024', 'training', 27500.00, 12000.00, 'on_track'),
('Q3-2024', 'salaries', 340000.00, 0, 'on_track'),
('Q3-2024', 'infrastructure', 140000.00, 0, 'on_track')
ON CONFLICT (period, category) DO NOTHING;

-- Tasks
INSERT INTO tasks (task_id, project_id, assigned_to, title, description, status, priority, due_date) VALUES
('T001', (SELECT id FROM projects WHERE project_id='P41A05199'), (SELECT id FROM employees WHERE employee_id='E001'), 'Setup CI/CD Pipeline', 'Configure GitHub Actions for automated testing and deployment', 'in_progress', 'high', '2024-02-15'),
('T002', (SELECT id FROM projects WHERE project_id='P41A05199'), (SELECT id FROM employees WHERE employee_id='E003'), 'Docker Configuration', 'Create Dockerfile and docker-compose for local development', 'done', 'high', '2024-01-20'),
('T003', (SELECT id FROM projects WHERE project_id='P41A05200'), (SELECT id FROM employees WHERE employee_id='E002'), 'UI Wireframes', 'Design initial wireframes for mobile CRM interface', 'done', 'medium', '2023-12-01'),
('T004', (SELECT id FROM projects WHERE project_id='P41A05200'), (SELECT id FROM employees WHERE employee_id='E001'), 'API Endpoints', 'Implement REST API endpoints for customer management', 'in_progress', 'high', '2024-03-01'),
('T005', (SELECT id FROM projects WHERE project_id='P41A05201'), (SELECT id FROM employees WHERE employee_id='E005'), 'Load Testing', 'Perform stress testing on dashboard endpoints', 'review', 'medium', '2023-11-15'),
('T006', (SELECT id FROM projects WHERE project_id='P41A05202'), (SELECT id FROM employees WHERE employee_id='E004'), 'User Acceptance Testing', 'Coordinate UAT with HR department stakeholders', 'in_progress', 'high', '2024-08-01')
ON CONFLICT (task_id) DO NOTHING;

-- Notifications (Demo)
INSERT INTO notifications (user_id, title, message, type) VALUES
(1, 'Welcome to Eternis ERP', 'Your admin account is ready. Start managing projects, employees, and finances.', 'success'),
(1, 'Project Deadline Alert', 'Project P41A05199 (Payment App) deadline is June 30, 2024. Progress: 0%', 'warning'),
(1, 'Budget Update', 'Q2 2024 infrastructure spending is at 69% - currently on track.', 'info'),
(1, 'New Task Assigned', 'Task T006 (UAT Coordination) assigned to Emily Chen for HR Portal project.', 'info')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- ✅ VERIFICATION QUERIES 
-- =============================================================================
--SELECT count(*) FROM users;
--SELECT count(*) FROM employees WHERE is_active = true;
--SELECT project_id, name, status, progress FROM projects ORDER BY created_at DESC;
--SELECT period, category, allocated, spent, forecast_status FROM budgets ORDER BY period;

-- =============================================================================
-- 🏁 INITIALIZATION COMPLETE
-- =============================================================================