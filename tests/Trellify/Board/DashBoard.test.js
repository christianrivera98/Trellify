import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as trellifyThunks from '../../store/trellify/trellifyThunks';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../store/trellify/trellifyThunks');

describe('Dashboard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      trellify: {
        boards: [],
        activeBoard: { id: 'board1', title: 'Test Board', isFavorite: false, backgroundUrl: '' },
      },
      auth: {
        uid: 'user1',
      },
    });

    trellifyThunks.fetchAllBoards.mockImplementation(() => jest.fn());
    trellifyThunks.fetchAllBoardsFavs.mockImplementation(() => jest.fn());
    trellifyThunks.fetchLastBoard.mockImplementation(() => jest.fn());
    trellifyThunks.savedActiveBoard.mockImplementation(() => jest.fn());
    trellifyThunks.startDeleteBoard.mockImplementation(() => jest.fn());
    trellifyThunks.startUpdatingBoardTitle.mockImplementation(() => jest.fn());
    trellifyThunks.toggleFavBoard.mockImplementation(() => jest.fn());
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

  test('renders loading state', () => {
    renderComponent();

    expect(screen.getByText(/Cargando tablero/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); 
  });

  test('renders active board details', async () => {
    renderComponent();

 
    await screen.findByText(/Test Board/i);

    expect(screen.getByText(/Test Board/i)).toBeInTheDocument();
  });

  test('allows editing of board title', async () => {
    renderComponent();

 
    await screen.findByText(/Test Board/i);


    fireEvent.click(screen.getByText(/Test Board/i));

    const input = screen.getByDisplayValue(/Test Board/i);
    fireEvent.change(input, { target: { value: 'Updated Board Title' } });
    fireEvent.blur(input);

    expect(trellifyThunks.startUpdatingBoardTitle).toHaveBeenCalledWith('board1', 'Updated Board Title');
  });

  test('toggles board favorite status', async () => {
    renderComponent();

    await screen.findByText(/Test Board/i);

    const favButton = screen.getByRole('button', { name: /favorited/i }); 
    fireEvent.click(favButton);

    expect(trellifyThunks.toggleFavBoard).toHaveBeenCalled();
  });

  test('deletes active board', async () => {
    renderComponent();

    await screen.findByText(/Test Board/i);

    const deleteButton = screen.getByRole('button', { name: /delete-icon/i }); 
    fireEvent.click(deleteButton);

    expect(trellifyThunks.startDeleteBoard).toHaveBeenCalled();
  });

  test('does not display board details if no active board', () => {
    store = mockStore({
      trellify: {
        boards: [],
        activeBoard: null, 
      },
      auth: {
        uid: 'user1',
      },
    });

    renderComponent();

    expect(screen.getByText(/NothingSelectedView/i)).toBeInTheDocument();
  });
});
