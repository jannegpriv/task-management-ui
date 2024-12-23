import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import { Task, TaskStatus } from '../types/Task';
import { api } from '../services/api';

interface EditTaskModalProps {
    open: boolean;
    task: Task | null;
    onClose: () => void;
    onTaskUpdated: () => void;
}

export const EditTaskModal = ({ open, task, onClose, onTaskUpdated }: EditTaskModalProps) => {
    const [formData, setFormData] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (task) {
            setFormData({ ...task });
        }
    }, [task]);

    const handleSubmit = async () => {
        if (!formData || !task) return;

        try {
            setError(null);
            await api.updateTask(task.id, {
                title: formData.title,
                description: formData.description,
                status: formData.status
            });
            onTaskUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task. Please try again.');
        }
    };

    if (!formData) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    >
                        <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                        <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                        <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
