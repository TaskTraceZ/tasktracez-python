interface TaskInstance {
    id: number;
    task_title: string;
    project_title: string;
    billable: boolean;
    started_at: string;
    stopped_at: string,
    duration_worked: string;
    in_progress: boolean;
    created_at: string;
    updated_at: string;
    task: number;
}

export default TaskInstance;
