import React, { useState } from "react";
import { startNewBoard, startUploadingFiles } from "../../../../store/trellify/trellifyThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();

  // Obtener imágenes desde el estado de Redux (incluyendo las subidas recientemente)
  const { cloudinaryImages, imageUrls } = useSelector((state: RootState) => state.trellify);

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background);
  };

  const handleCreateBoard = () => {
    if (!boardTitle) {
      alert("Es necesario indicar el título del tablero");
      return;
    }
    dispatch(startNewBoard(boardTitle, selectedBackground)); // Pasa el título y el fondo
    setIsOpen(false);
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    dispatch(startUploadingFiles(fileArray)); // Sube los archivos
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded h-full w-auto text-sm"
        onClick={() => setIsOpen(true)}
      >
        Crear Tablero
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-11/12 max-w-lg">
            <h2 className="flex justify-center text-xl mb-4 font-medium">
              Crear Tablero
            </h2>

            {/* Previsualización del fondo seleccionado */}
            <div
              className={`flex justify-center items-center w-full h-32 bg-cover rounded-md mb-4`}
              style={{
                height: "18vh",
                backgroundImage: selectedBackground.startsWith("#")
                  ? undefined
                  : `url(${selectedBackground})`,
                backgroundColor: selectedBackground.startsWith("#")
                  ? selectedBackground
                  : undefined,
              }}
            >
              <img
                src="./logo.svg"
                alt="Superposición"
                className="absolute size-36"
              />
            </div>

            <h3 className="mb-2 mx-2 text-lg font-medium">Fondo</h3>
            <div className="flex gap-2 overflow-x-scroll mb-2 p-2">
              {/* Imágenes de Cloudinary obtenidas */}
              {cloudinaryImages.concat(imageUrls).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleBackgroundChange(image)}
                >
                  <img
                    src={image}
                    alt={`Fondo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </button>
              ))}
              <button
                className="w-24 h-24 bg-orange-500 rounded-md"
                onClick={() => handleBackgroundChange("#FF5722")}
              />
              <button
                className="w-24 h-24 bg-blue-500 rounded-md"
                onClick={() => handleBackgroundChange("#03A9F4")}
              />
            </div>

            {/* Input de subir imágenes */}
            <div className="flex ">
              <label className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-xs py-2 px-4 rounded cursor-pointer">
                Subir imagen...
                <input type="file" className="hidden" multiple onChange={onFileInputChange} />
              </label>
            </div>

            {/* Input para el título del tablero */}
            <h3 className="mx-2 text-lg font-medium">Título</h3>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Título del tablero"
              className="mt-1 p-2 w-full h-10 text-xl border border-gray-300 rounded-md"
            />
            <div className="flex justify-center">
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-xl text-white rounded"
                onClick={handleCreateBoard}
              >
                Crear
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateButton;
