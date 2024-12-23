import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import { TaskForm } from '../TaskForm';
import { api } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  api: {
    createTask: vi.fn(),
  },
}));

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(<TaskForm />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const mockCreateTask = vi.fn().mockResolvedValue({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'TODO',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    (api.createTask as any).mockImplementation(mockCreateTask);

    const onTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={onTaskCreated} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Wait for the submission to complete
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
      });
      expect(onTaskCreated).toHaveBeenCalled();
    });

    // Form should be reset
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('shows error message when submission fails', async () => {
    const mockError = new Error('Failed to create task');
    (api.createTask as any).mockRejectedValue(mockError);

    render(<TaskForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
    });
  });
});
