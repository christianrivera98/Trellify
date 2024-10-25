import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

jest.mock('../../../../store/trellify/trellifySlice', () => ({
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
}));

describe('TaskCard Component', () => {
  const mockDeleteTask = jest.fn();
  const mockUpdateTask = jest.fn();
  
  const task = {
    id: 'task1',
    content: 'Test Task',
  };

  const renderComponent = (props = {}) =>
    render(
      <TaskCard
        task={task}
        deleteTask={mockDeleteTask}
        updateTask={mockUpdateTask}
        {...props}
      />
    );

  test('renders task content', () => {
    renderComponent();

    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  });

  test('allows editing of task content', () => {
    renderComponent();

    // Click to enter edit mode
    fireEvent.click(screen.getByText(/Test Task/i));
    
    // Check that textarea is rendered
    const textarea = screen.getByPlaceholderText(/Introduce la tarea que requieres aquí.../i);
    expect(textarea).toBeInTheDocument();
    
    // Update task content
    fireEvent.change(textarea, { target: { value: 'Updated Task' } });
    expect(mockUpdateTask).toHaveBeenCalledWith(task.id, 'Updated Task');
    
    // Blur to save changes
    fireEvent.blur(textarea);
    expect(screen.getByText(/Updated Task/i)).toBeInTheDocument();
  });

  test('calls deleteTask when delete button is clicked', () => {
    renderComponent();

    // Hover to show delete button
    fireEvent.mouseEnter(screen.getByText(/Test Task/i));

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith(task.id);
  });

  test('does not render delete button when mouse is not over', () => {
    renderComponent();

    // Ensure delete button is not rendered initially
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('shows delete button on mouse enter', () => {
    renderComponent();

    // Hover to show delete button
    fireEvent.mouseEnter(screen.getByText(/Test Task/i));

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  test('does not enter edit mode when delete button is clicked', () => {
    renderComponent();

    // Hover to show delete button
    fireEvent.mouseEnter(screen.getByText(/Test Task/i));

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    // Check that deleteTask is called, but content should still be visible
    expect(mockDeleteTask).toHaveBeenCalledWith(task.id);
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  });
});
