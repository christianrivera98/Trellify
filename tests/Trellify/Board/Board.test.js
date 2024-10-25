import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppDispatch } from '../../../store/Store';
import { Board } from './Board';
import {
  setActiveBoard,
  deleteTask,
} from '../../../store/trellify/trellifySlice';
import { startNewColumn, startNewTask, fetchLastBoard } from '../../../store/trellify/trellifyThunks';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

jest.mock('../../../store/trellify/trellifyThunks', () => ({
  startNewColumn: jest.fn(),
  startNewTask: jest.fn(),
  fetchLastBoard: jest.fn(),
}));

jest.mock('../../../store/trellify/trellifySlice', () => ({
  setActiveBoard: jest.fn(),
  deleteTask: jest.fn(),
}));

jest.mock('../../../../helpers/dragHandlers', () => ({
  onDragEnd: jest.fn(),
  onDragStart: jest.fn(),
  onDragOver: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('Board Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      trellify: {
        activeBoard: {
          id: '1',
          title: 'Test Board',
          lists: [
            {
              id: 'col1',
              title: 'Column 1',
              tasks: [{ id: 'task1', content: 'Task 1', columnId: 'col1' }],
            },
          ],
        },
        activeTask: null,
      },
      auth: {
        uid: 'user123',
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

  test('renders active board with columns and tasks', () => {
    renderComponent();

    expect(screen.getByText(/Column 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
  });

  test('calls fetchLastBoard on load if no activeBoard is set', () => {
    store = mockStore({
      trellify: { activeBoard: null, activeTask: null },
      auth: { uid: 'user123' },
    });

    renderComponent();
    expect(store.dispatch).toHaveBeenCalledWith(fetchLastBoard('user123'));
  });

  test('calls startNewColumn when "Añadir lista" button is clicked', () => {
    renderComponent();

    const addButton = screen.getByRole('button', { name: /añadir lista/i });
    fireEvent.click(addButton);

    expect(store.dispatch).toHaveBeenCalledWith(startNewColumn());
  });

  test('calls startNewTask when creating a task in a column', () => {
    renderComponent();

    const addTaskButton = screen.getByRole('button', { name: /Añadir tarea/i });
    fireEvent.click(addTaskButton);

    expect(store.dispatch).toHaveBeenCalledWith(startNewTask('col1'));
  });

  test('calls setActiveBoard if activeBoard is already present on load', () => {
    renderComponent();

    expect(store.dispatch).toHaveBeenCalledWith(
      setActiveBoard(store.getState().trellify.activeBoard)
    );
  });

  test('handles drag and drop of tasks within columns', async () => {
    renderComponent();

    const dragStartEvent = { active: { id: 'task1' } } ;
    const dragEndEvent = { active: { id: 'task1' }, over: { id: 'col1' } } ;

    fireEvent(screen.getByText(/Task 1/i), new DragEvent('dragstart', dragStartEvent));
    fireEvent(screen.getByText(/Column 1/i), new DragEvent('dragend', dragEndEvent));

    await waitFor(() => expect(store.dispatch).toHaveBeenCalled());
  });

  test('displays DragOverlay with active task during drag', () => {
    store = mockStore({
      trellify: {
        activeBoard: {
          id: '1',
          title: 'Test Board',
          lists: [
            {
              id: 'col1',
              title: 'Column 1',
              tasks: [{ id: 'task1', content: 'Task 1', columnId: 'col1' }],
            },
          ],
        },
        activeTask: { id: 'task1', content: 'Task 1' },
      },
      auth: { uid: 'user123' },
    });

    renderComponent();

    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
  });

  test('calls deleteTask when task is removed', () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /eliminar tarea/i });
    fireEvent.click(deleteButton);

    expect(store.dispatch).toHaveBeenCalledWith(deleteTask('task1'));
  });
});
