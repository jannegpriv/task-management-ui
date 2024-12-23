import axios from 'axios';
import { Task, SortConfig } from '../types/Task';

const baseURL = 'http://localhost:5555';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface Settings {
    dark_mode: boolean;
    updated_at: string;
}

export const api = {
    // Task endpoints
    async getTasks(sortConfig?: SortConfig | null): Promise<Task[]> {
        const params = sortConfig ? {
            sort_by: sortConfig.field,
            sort_order: sortConfig.order
        } : {};
        const response = await axiosInstance.get<Task[]>('/tasks', { params });
        return response.data;
    },

    async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
        const response = await axiosInstance.post<Task>('/tasks', task);
        return response.data;
    },

    async updateTask(id: number, task: Partial<Task>): Promise<Task> {
        const response = await axiosInstance.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },

    async deleteTask(id: number): Promise<void> {
        await axiosInstance.delete(`/tasks/${id}`);
    },

    // Settings endpoints
    async getSettings(): Promise<Settings> {
        const response = await axiosInstance.get<Settings>('/settings');
        return response.data;
    },

    async updateSettings(settings: Partial<Settings>): Promise<Settings> {
        const response = await axiosInstance.put<Settings>('/settings', settings);
        return response.data;
    }
};
