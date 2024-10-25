import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppDispatch, RootState } from '../../../../store/Store';
import { setActiveBoard } from '../../../../store/trellify/trellifySlice';
import { WorkSpaceItem } from './WorkSpaceItem';

jest.mock('../../../../store/trellify/trellifySlice', () => ({
  setActiveBoard: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('WorkSpaceItem Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      trellify: {
        boards: [
          { id: '1', title: 'Development Board', backgroundUrl: '#ff5733' },
          { id: '2', title: 'Design Board', backgroundUrl: 'https://example.com/image.png' },
        ],
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = (openMenu = '') =>
    render(
      <Provider store={store}>
        <WorkSpaceItem openMenu={openMenu} menuToggle={() => {}} />
      </Provider>
    );

  test('renders button with correct initial label and style', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /espacios de trabajo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Espacios de trabajo');
  });

  test('toggles menu visibility when button is clicked', async () => {
    const menuToggle = jest.fn();
    render(
      <Provider store={store}>
        <WorkSpaceItem openMenu="" menuToggle={menuToggle} />
      </Provider>
    );

    const button = screen.getByRole('button', { name: /espacios de trabajo/i });
    fireEvent.click(button);
    expect(menuToggle).toHaveBeenCalledWith('workspace');

    fireEvent.click(button);
    expect(menuToggle).toHaveBeenCalledWith('');
  });

  test('displays loading spinner while loading boards', async () => {
    renderComponent('workspace');

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('renders workspace boards after loading', async () => {
    renderComponent('workspace');

    await waitFor(() => {
      expect(screen.getByText(/development board/i)).toBeInTheDocument();
      expect(screen.getByText(/design board/i)).toBeInTheDocument();
    });
  });

  test('truncates board title if it exceeds 17 characters', async () => {
    store = mockStore({
      trellify: {
        boards: [
          { id: '1', title: 'Board With Very Long Title', backgroundUrl: '#ff5733' },
        ],
      },
    });

    renderComponent('workspace');

    await waitFor(() => {
      expect(screen.getByText(/board with very.../i)).toBeInTheDocument();
    });
  });

  test('calls setActiveBoard and menuToggle on board selection', async () => {
    const menuToggle = jest.fn();
    render(
      <Provider store={store}>
        <WorkSpaceItem openMenu="workspace" menuToggle={menuToggle} />
      </Provider>
    );

    await waitFor(() => screen.getByText(/development board/i));
    fireEvent.click(screen.getByText(/development board/i));

    expect(store.dispatch).toHaveBeenCalledWith(setActiveBoard(store.getState().trellify.boards[0]));
    expect(menuToggle).toHaveBeenCalledWith('');
  });

  test('applies background color for color-based URLs and background image for URL-based backgrounds', async () => {
    renderComponent('workspace');

    await waitFor(() => {
      const boardA = screen.getByText(/development board/i).previousSibling;
      const boardB = screen.getByText(/design board/i).previousSibling;

      expect(boardA).toHaveStyle('background-color: #ff5733');
      expect(boardB).toHaveStyle('background-image: url(https://example.com/image.png)');
    });
  });
});
