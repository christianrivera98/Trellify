import { render, screen, fireEvent } from '@testing-library/react';
import { SignInPage } from './SignInPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { checkingAuthentication, startGoogleSignIn, startLoginWithEmailPassword } from '../../../store/auth/Thunks';

jest.mock('../../../store/auth/Thunks', () => ({
    checkingAuthentication: jest.fn(),
    startGoogleSignIn: jest.fn(),
    startLoginWithEmailPassword: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('SignInPage Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: false,
                errorMessage: null,
            },
        });
        store.dispatch = jest.fn();
    });

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <Router>
                    <SignInPage />
                </Router>
            </Provider>
        );

    test('renders SignInPage with input fields and buttons', () => {
        renderComponent();
        expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    test('displays validation errors for empty fields on submit', async () => {
        renderComponent();
        const submitButton = screen.getByRole('button', { name: /ingresar/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });

    test('shows invalid email message if email format is incorrect', async () => {
        renderComponent();
        fireEvent.input(screen.getByLabelText(/correo/i), { target: { value: 'invalidemail' } });
        const submitButton = screen.getByRole('button', { name: /ingresar/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/correo no válido/i)).toBeInTheDocument();
    });

    test('displays error message from state', () => {
        store = mockStore({
            auth: {
                isAuthenticated: false,
                errorMessage: 'Credenciales incorrectas',
            },
        });

        render(
            <Provider store={store}>
                <Router>
                    <SignInPage />
                </Router>
            </Provider>
        );

        expect(screen.getByText(/error/i)).toBeInTheDocument();
        expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });

    test('calls startLoginWithEmailPassword with valid input on submit', () => {
        renderComponent();

        fireEvent.input(screen.getByLabelText(/correo/i), { target: { value: 'user@example.com' } });
        fireEvent.input(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /ingresar/i });
        fireEvent.click(submitButton);

        expect(store.dispatch).toHaveBeenCalledWith(checkingAuthentication());
        expect(store.dispatch).toHaveBeenCalledWith(
            startLoginWithEmailPassword({
                email: 'user@example.com',
                password: 'password123',
            })
        );
    });

    test('calls startGoogleSignIn when Google button is clicked', () => {
        renderComponent();
        const googleButton = screen.getByRole('button', { name: /google/i });
        fireEvent.click(googleButton);

        expect(store.dispatch).toHaveBeenCalledWith(startGoogleSignIn());
    });

    test('disables buttons when authenticating', () => {
        store = mockStore({
            auth: {
                isAuthenticated: 'checking',
                errorMessage: null,
            },
        });

        render(
            <Provider store={store}>
                <Router>
                    <SignInPage />
                </Router>
            </Provider>
        );

        const submitButton = screen.getByRole('button', { name: /ingresar/i });
        const googleButton = screen.getByRole('button', { name: /google/i });

        expect(submitButton).toBeDisabled();
        expect(googleButton).toBeDisabled();
    });
});
