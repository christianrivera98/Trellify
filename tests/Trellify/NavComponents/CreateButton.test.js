import { render, screen, fireEvent } from '@testing-library/react';
import CreateButton from './CreateButton';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppDispatch, RootState } from '../../../../store/Store';
import { startNewBoard, startUploadingFiles } from '../../../../store/trellify/trellifyThunks';
import { setBoardBackground } from '../../../../store/trellify/trellifySlice';

jest.mock('../../../../store/trellify/trellifyThunks', () => ({
    startNewBoard: jest.fn(),
    startUploadingFiles: jest.fn(),
}));
jest.mock('../../../../store/trellify/trellifySlice', () => ({
    setBoardBackground: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('CreateButton Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            trellify: {
                cloudinaryImages: [],
                imageUrls: [],
            },
        });
        store.dispatch = jest.fn();
    });

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <CreateButton openMenu="" menuToggle={() => {}} />
            </Provider>
        );

    test('renders CreateButton and opens modal on click', () => {
        renderComponent();

        const createButton = screen.getByText(/crear tablero/i);
        fireEvent.click(createButton);

        expect(screen.getByText(/crear tablero/i)).toBeInTheDocument();
    });

    test('displays alert when creating a board without a title', () => {
        renderComponent();
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        const createButton = screen.getByText(/crear tablero/i);
        fireEvent.click(createButton);

        const confirmButton = screen.getByRole('button', { name: /crear/i });
        fireEvent.click(confirmButton);

        expect(window.alert).toHaveBeenCalledWith("Es necesario indicar el título del tablero");
    });

    test('calls startNewBoard and setBoardBackground with title and selected background', () => {
        renderComponent();

        fireEvent.click(screen.getByText(/crear tablero/i));

        const titleInput = screen.getByPlaceholderText(/título del tablero/i);
        fireEvent.change(titleInput, { target: { value: 'Nuevo Tablero' } });

        const backgroundButton = screen.getByRole('button', { name: /fondo/i });
        fireEvent.click(backgroundButton);

        const confirmButton = screen.getByRole('button', { name: /crear/i });
        fireEvent.click(confirmButton);

        expect(store.dispatch).toHaveBeenCalledWith(startNewBoard('Nuevo Tablero', '#f97316'));
        expect(store.dispatch).toHaveBeenCalledWith(setBoardBackground('#f97316'));
    });

    test('uploads selected files when selecting files', () => {
        renderComponent();

        const fileInput = screen.getByLabelText(/subir imagen/i);
        const files = [new File(['dummy content'], 'example.png', { type: 'image/png' })];
        fireEvent.change(fileInput, { target: { files } });

        expect(store.dispatch).toHaveBeenCalledWith(startUploadingFiles(files));
    });

    test('renders cloudinary and local image options', () => {
        store = mockStore({
            trellify: {
                cloudinaryImages: ['cloudinary-image1-url', 'cloudinary-image2-url'],
                imageUrls: ['local-image1-url', 'local-image2-url'],
            },
        });

        render(
            <Provider store={store}>
                <CreateButton openMenu="" menuToggle={() => {}} />
            </Provider>
        );

        fireEvent.click(screen.getByText(/crear tablero/i));

        expect(screen.getByAltText(/fondo 1/i)).toHaveAttribute('src', 'cloudinary-image1-url');
        expect(screen.getByAltText(/fondo 2/i)).toHaveAttribute('src', 'cloudinary-image2-url');
        expect(screen.getByAltText(/fondo 3/i)).toHaveAttribute('src', 'local-image1-url');
        expect(screen.getByAltText(/fondo 4/i)).toHaveAttribute('src', 'local-image2-url');
    });

    test('selects a background color and previews it', () => {
        renderComponent();

        fireEvent.click(screen.getByText(/crear tablero/i));

        const orangeButton = screen.getByRole('button', { name: /fondo/i });
        fireEvent.click(orangeButton);

        const backgroundPreview = screen.getByRole('img', { name: /superposición/i });
        expect(backgroundPreview).toHaveStyle('background-color: #f97316');
    });
});
