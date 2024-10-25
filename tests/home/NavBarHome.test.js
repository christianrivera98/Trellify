import { render, screen, fireEvent } from '@testing-library/react';
import { NavBar } from './NavBar';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { checkingAuthentication, startLoginWithDemo } from '../../../../store/auth/Thunks';

jest.mock('../../../../store/auth/Thunks', () => ({
    checkingAuthentication: jest.fn(),
    startLoginWithDemo: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('NavBar Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: false,
            },
        });
        store.dispatch = jest.fn();
    });

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <Router>
                    <NavBar />
                </Router>
            </Provider>
        );

    test('should render the NavBar with logo and title', () => {
        renderComponent();
        expect(screen.getByAltText('logo')).toBeInTheDocument();
        expect(screen.getByText('Trellify')).toBeInTheDocument();
    });

    test('should render Login and Demo buttons', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /demo/i })).toBeInTheDocument();
    });

    test('should call checkingAuthentication and startLoginWithDemo when Demo button is clicked', () => {
        renderComponent();
        const demoButton = screen.getByRole('button', { name: /demo/i });
        fireEvent.click(demoButton);

        expect(store.dispatch).toHaveBeenCalledWith(checkingAuthentication());
        expect(store.dispatch).toHaveBeenCalledWith(startLoginWithDemo());
    });

    test('should disable Demo button when authenticating', () => {
        store = mockStore({
            auth: {
                isAuthenticated: 'checking',
            },
        });

        render(
            <Provider store={store}>
                <Router>
                    <NavBar />
                </Router>
            </Provider>
        );

        const demoButton = screen.getByRole('button', { name: /demo/i });
        expect(demoButton).toBeDisabled();
    });
});
