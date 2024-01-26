CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id SERIAL REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
);

CREATE TABLE task_instances (
    id SERIAL PRIMARY KEY,
    billable BOOLEAN NOT NULL,
    started_at TIME WITHOUT TIME ZONE NOT NULL DEFAULT '00:00:00',
    stopped_at TIME WITHOUT TIME ZONE NOT NULL DEFAULT '00:00:00',
    in_progress BOOLEAN NOT NULL DEFAULT false,
    task_id SERIAL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
);
