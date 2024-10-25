import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ColumnContainer from './ColumnContainer';
import { deleteList } from '../../../../store/trellify/trellifySlice';

jest.mock('../../../../store/trellify/trellifySlice', () => ({
  deleteList: jest.fn(),
}));

const mockStore = configureStore([]);

describe('ColumnContainer Component', () => {
  let store;

  const column = {
    id: 'col1',
    title: 'Column 1',
    tasks: [
      { id: 'task1', content: 'Task 1' },
      { id: 'task2', content: 'Task 2' },
    ],
  };

  beforeEach(() => {
    store = mockStore({
      trellify: {
        activeBoard: {},
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <ColumnContainer
          column={column}
          updateColumn={jest.fn()}
          deleteTask={jest.fn()}
          createTask={jest.fn()}
          updateTask={jest.fn()}
          {...props}
        />
      </Provider>
    );

  test('renders column title and tasks', () => {
    renderComponent();

    expect(screen.getByText(/Column 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
  });

  test('allows title editing', () => {
    renderComponent();

    const titleElement = screen.getByText(/Column 1/i);
    fireEvent.click(titleElement);

    const inputElement = screen.getByDisplayValue(/Column 1/i);
    fireEvent.change(inputElement, { target: { value: 'Updated Title' } });
    fireEvent.blur(inputElement);

    expect(screen.getByText(/Updated Title/i)).toBeInTheDocument();
  });

  test('calls createTask when "Añadir tarea" button is clicked', () => {
    const createTaskMock = jest.fn();
    renderComponent({ createTask: createTaskMock });

    const addTaskButton = screen.getByRole('button', { name: /Añadir tarea/i });
    fireEvent.click(addTaskButton);

    expect(createTaskMock).toHaveBeenCalledWith(column.id);
  });

  test('calls deleteList when delete button is clicked', () => {
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /delete-icon/i });
    fireEvent.click(deleteButton);

    expect(store.dispatch).toHaveBeenCalledWith(deleteList(column.id));
  });

  test('does not render when column is null', () => {
    render(
      <Provider store={store}>
        <ColumnContainer
          column={null}
          updateColumn={jest.fn()}
          deleteTask={jest.fn()}
          createTask={jest.fn()}
          updateTask={jest.fn()}
        />
      </Provider>
    );

    expect(screen.queryByText(/Column 1/i)).not.toBeInTheDocument();
  });
});
