import React, { useState, useEffect, useCallback } from 'react';
import {
    List,
    ListItem,
    IconButton,
    Paper,
    Typography,
    Alert,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    useTheme,
    SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Task, TaskStatus, SortConfig, SortField } from '../types/Task';
import { api } from '../services/api';
import { EditTaskModal } from './EditTaskModal';

interface TaskListProps {
    refreshTrigger?: number;
}

export const TaskList = React.memo<TaskListProps>(({ refreshTrigger = 0 }) => {
    const theme = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: 'created_at',
        order: 'desc'
    });

    const loadTasks = useCallback(async () => {
        try {
            console.log('Loading tasks...', { refreshTrigger, sortConfig }); // Debug log
            const fetchedTasks = await api.getTasks(sortConfig);
            console.log('Fetched tasks:', fetchedTasks); // Debug log
            setTasks(fetchedTasks);
            setError(null);
        } catch (err) {
            console.error('Error loading tasks:', err);
            setError('Failed to load tasks. Please try again later.');
        }
    }, [sortConfig, refreshTrigger]); // Add refreshTrigger to dependencies

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleDeleteTask = async (id: number) => {
        try {
            await api.deleteTask(id);
            await loadTasks();
            setError(null);
        } catch (err) {
            setError('Failed to delete task. Please try again later.');
            console.error('Error deleting task:', err);
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleCloseEdit = () => {
        setEditingTask(null);
    };

    const getStatusColor = (status: TaskStatus): "default" | "primary" | "success" => {
        switch (status) {
            case TaskStatus.TODO:
                return 'default';
            case TaskStatus.IN_PROGRESS:
                return 'primary';
            case TaskStatus.DONE:
                return 'success';
            default:
                return 'default';
        }
    };

    const handleSortFieldChange = (event: SelectChangeEvent<SortField>) => {
        setSortConfig(prev => ({
            ...prev,
            field: event.target.value as SortField
        }));
    };

    const toggleSortOrder = () => {
        setSortConfig({
            ...sortConfig,
            order: sortConfig.order === 'asc' ? 'desc' : 'asc'
        });
    };

    const getSortFieldLabel = (field?: SortField): string => {
        if (!field) return 'None';
        switch (field) {
            case 'status':
                return 'Status';
            case 'created_at':
                return 'Creation Date';
            case 'updated_at':
                return 'Last Updated';
            case 'title':
                return 'Title';
            default:
                return 'Unknown';
        }
    };

    return (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 3, 
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'background-color 0.3s ease'
            }}
        >
            <Stack spacing={3}>
                <Typography variant="h5" component="h2">
                    Tasks
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortConfig.field}
                            label="Sort By"
                            onChange={handleSortFieldChange}
                        >
                            <MenuItem value="status">Status</MenuItem>
                            <MenuItem value="created_at">Creation Date</MenuItem>
                            <MenuItem value="updated_at">Last Updated</MenuItem>
                            <MenuItem value="title">Title</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={toggleSortOrder} title={`Sort ${sortConfig.order === 'asc' ? 'Ascending' : 'Descending'}`}>
                        <SwapVertIcon sx={{ transform: sortConfig.order === 'desc' ? 'rotate(180deg)' : 'none' }} />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary">
                        Sorting by {getSortFieldLabel(sortConfig.field)} ({sortConfig.order === 'asc' ? 'ascending' : 'descending'})
                    </Typography>
                </Stack>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <List sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    maxHeight: 'calc(100vh - 300px)',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: theme.palette.mode === 'dark' ? '#333' : '#f1f1f1',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.mode === 'dark' ? '#666' : '#888',
                        borderRadius: '4px',
                        '&:hover': {
                            background: theme.palette.mode === 'dark' ? '#888' : '#666',
                        },
                    },
                }}>
                    {tasks.map((task) => (
                        <ListItem
                            key={task.id}
                            sx={{
                                mb: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                bgcolor: theme.palette.background.paper,
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover,
                                },
                                transition: 'background-color 0.2s ease',
                            }}
                            secondaryAction={
                                <Stack direction="row" spacing={1}>
                                    <IconButton edge="end" onClick={() => handleEditTask(task)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            }
                        >
                            <Stack spacing={1} sx={{ width: '100%', pr: 12 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h6" component="div">
                                        {task.title}
                                    </Typography>
                                    <Chip
                                        label={task.status.replace('_', ' ')}
                                        color={getStatusColor(task.status)}
                                        size="small"
                                        sx={{
                                            '& .MuiChip-label': {
                                                color: theme.palette.mode === 'dark' ? 'inherit' : undefined,
                                            },
                                        }}
                                    />
                                </Stack>
                                {task.description && (
                                    <Typography variant="body2" color="textSecondary">
                                        {task.description}
                                    </Typography>
                                )}
                                <Typography variant="caption" color="textSecondary">
                                    Last updated: {new Date(task.updated_at).toLocaleString()}
                                </Typography>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            </Stack>

            <EditTaskModal
                task={editingTask}
                onClose={handleCloseEdit}
                onTaskUpdated={loadTasks}
                open={editingTask !== null}
            />
        </Paper>
    );
});

TaskList.displayName = 'TaskList';

export default TaskList;
