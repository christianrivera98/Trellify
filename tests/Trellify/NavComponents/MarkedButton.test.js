import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppDispatch, RootState } from '../../../../store/Store';
import { setActiveBoard } from '../../../../store/trellify/trellifySlice';
import { MarkedBoards } from './MarkedBoards';

jest.mock('../../../../store/trellify/trellifySlice', () => ({
  setActiveBoard: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('MarkedBoards Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      trellify: {
        favBoards: [
          { id: '1', title: 'Project A', backgroundUrl: '#ff5733' },
          { id: '2', title: 'Project B', backgroundUrl: 'https://example.com/image.png' },
        ],
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = (openMenu = '') =>
    render(
      <Provider store={store}>
        <MarkedBoards openMenu={openMenu} menuToggle={() => {}} />
      </Provider>
    );

  test('renders button with correct initial style and label', () => {
    renderComponent();

    const button = screen.getByRole('button', { name: /marcado/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Marcado');
  });

  test('toggles menu visibility when button is clicked', async () => {
    const menuToggle = jest.fn();
    render(
      <Provider store={store}>
        <MarkedBoards openMenu="" menuToggle={menuToggle} />
      </Provider>
    );

    const button = screen.getByRole('button', { name: /marcado/i });
    fireEvent.click(button);
    expect(menuToggle).toHaveBeenCalledWith('marked');

    fireEvent.click(button);
    expect(menuToggle).toHaveBeenCalledWith('');
  });

  test('displays loading spinner while loading boards', async () => {
    renderComponent('marked');

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('renders favorite boards after loading', async () => {
    renderComponent('marked');

    await waitFor(() => {
      expect(screen.getByText(/project a/i)).toBeInTheDocument();
      expect(screen.getByText(/project b/i)).toBeInTheDocument();
    });
  });

  test('truncates board title if it exceeds 17 characters', async () => {
    store = mockStore({
      trellify: {
        favBoards: [
          { id: '1', title: 'Project With Very Long Title', backgroundUrl: '#ff5733' },
        ],
      },
    });

    renderComponent('marked');

    await waitFor(() => {
      expect(screen.getByText(/project with very.../i)).toBeInTheDocument();
    });
  });

  test('calls setActiveBoard and menuToggle on board selection', async () => {
    const menuToggle = jest.fn();
    render(
      <Provider store={store}>
        <MarkedBoards openMenu="marked" menuToggle={menuToggle} />
      </Provider>
    );

    await waitFor(() => screen.getByText(/project a/i));
    fireEvent.click(screen.getByText(/project a/i));

    expect(store.dispatch).toHaveBeenCalledWith(setActiveBoard(store.getState().trellify.favBoards[0]));
    expect(menuToggle).toHaveBeenCalledWith('');
  });

  test('applies background color for color-based URLs and background image for URL-based backgrounds', async () => {
    renderComponent('marked');

    await waitFor(() => {
      const boardA = screen.getByText(/project a/i).previousSibling;
      const boardB = screen.getByText(/project b/i).previousSibling;

      expect(boardA).toHaveStyle('background-color: #ff5733');
      expect(boardB).toHaveStyle('background-image: url(https://example.com/image.png)');
    });
  });
});
