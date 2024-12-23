import { useState } from 'react';
import { Button, TextField, Stack, MenuItem, Typography } from '@mui/material';
import { Task, TaskStatus } from '../types/Task';
import { api } from '../services/api';

interface TaskFormProps {
    onTaskCreated?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string | null>('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
                title,
                description: description || null,
                status,
            };

            console.log('Creating task...', newTask);
            const createdTask = await api.createTask(newTask);
            console.log('Task created:', createdTask);
            
            setTitle('');
            setDescription('');
            setStatus(TaskStatus.TODO);
            
            console.log('Calling onTaskCreated callback...');
            onTaskCreated?.();
            console.log('Callback called');
        } catch (err) {
            setError('Failed to create task. Please try again.');
            console.error('Error creating task:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <Typography variant="h5" component="h2">
                    Create Task
                </Typography>

                {error && (
                    <Typography color="error">
                        {error}
                    </Typography>
                )}

                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Description"
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />

                <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    fullWidth
                >
                    {Object.values(TaskStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                            {status.replace('_', ' ')}
                        </MenuItem>
                    ))}
                </TextField>

                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isSubmitting}
                    fullWidth
                >
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
            </Stack>
        </form>
    );
};
