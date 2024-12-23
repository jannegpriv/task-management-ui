export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    status: TaskStatus;
}

export type SortField = 'status' | 'created_at' | 'updated_at' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
    field: SortField;
    order: SortOrder;
}
