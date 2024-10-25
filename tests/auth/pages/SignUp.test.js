import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpPage } from './SignUpPage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { startCreatingUserWithEmailPassword, startGoogleSignIn } from '../../../store/auth/Thunks';

jest.mock('../../../store/auth/Thunks', () => ({
    startCreatingUserWithEmailPassword: jest.fn(),
    startGoogleSignIn: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('SignUpPage Component', () => {
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
                    <SignUpPage />
                </Router>
            </Provider>
        );

    test('renders SignUpPage with input fields and buttons', () => {
        renderComponent();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarte/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    test('displays validation errors for empty fields on submit', async () => {
        renderComponent();
        const submitButton = screen.getByRole('button', { name: /registrarte/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/el apellido es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/el correo es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });

    test('shows invalid email message if email format is incorrect', async () => {
        renderComponent();
        fireEvent.input(screen.getByLabelText(/correo/i), { target: { value: 'invalidemail' } });
        const submitButton = screen.getByRole('button', { name: /registrarte/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/correo no válido/i)).toBeInTheDocument();
    });

    test('calls startCreatingUserWithEmailPassword with valid input on submit', () => {
        renderComponent();

        fireEvent.input(screen.getByLabelText(/nombre/i), { target: { value: 'John' } });
        fireEvent.input(screen.getByLabelText(/apellidos/i), { target: { value: 'Doe' } });
        fireEvent.input(screen.getByLabelText(/correo/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.input(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /registrarte/i });
        fireEvent.click(submitButton);

        expect(store.dispatch).toHaveBeenCalledWith(
            startCreatingUserWithEmailPassword({
                email: 'john.doe@example.com',
                password: 'password123',
                displayName: 'John Doe',
            })
        );
    });

    test('calls startGoogleSignIn when Google button is clicked', () => {
        renderComponent();
        const googleButton = screen.getByRole('button', { name: /google/i });
        fireEvent.click(googleButton);

        expect(store.dispatch).toHaveBeenCalledWith(startGoogleSignIn());
    });

    test('disables register button when authenticating', () => {
        store = mockStore({
            auth: {
                isAuthenticated: 'checking',
            },
        });

        render(
            <Provider store={store}>
                <Router>
                    <SignUpPage />
                </Router>
            </Provider>
        );

        const registerButton = screen.getByRole('button', { name: /registrarte/i });
        expect(registerButton).toBeDisabled();
    });
});
