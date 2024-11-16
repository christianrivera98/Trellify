import React, { useState } from "react";
import {
  startNewBoard,
  startUploadingFiles,
} from "../../../../store/trellify/trellifyThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { menuItemsProps } from "../../board/types/types";
import { setBoardBackground } from "../../../../store/trellify/trellifySlice";

const CreateButton = ({ openMenu, menuToggle }: menuItemsProps) => {
  const isOpenMenu = openMenu === "createButton";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();

  // Obtener imágenes desde el estado de Redux
  const { cloudinaryImages, imageUrls } = useSelector(
    (state: RootState) => state.trellify
  );

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background);
  };

  const handleCreateBoard = () => {
    if (!boardTitle) {
      alert("Es necesario indicar el título del tablero");
      return;
    }

    const finalBackgroundUrl = selectedBackground;

    dispatch(startNewBoard(boardTitle, finalBackgroundUrl));
    dispatch(setBoardBackground(finalBackgroundUrl));

    menuToggle("");
    setIsOpen(false);
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    dispatch(startUploadingFiles(fileArray));
  };

  return (
    <>
      <div className="flex justify-center items-center ml-2  md:text-white  bg-blue-500 hover:bg-blue-400 focus:outline-none transition ease-in-out hover:duration-300 rounded  md:hidden">
        <button
          onClick={() => {
            menuToggle(isOpenMenu ? "" : "createButton"), setIsOpen(true);
          }}
          className=" flex "
        >
          <img
            src="https://res.cloudinary.com/ma-cloud/image/upload/v1730310457/findy/white_plus_fsz3bn.svg"
            alt="plusBoard"
            className="w-6 h-6  hover:bg-blue-400"
          />
        </button>
      </div>

      <button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 hover:text-white focus:outline-none transition ease-in-out hover:duration-300  text-white rounded  hidden md:block md:h-full  md:w-auto text-sm"
        onClick={() => {
          menuToggle(isOpenMenu ? "" : "createButton"), setIsOpen(true);
        }}
      >
        Crear Tablero
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl z-[110] w-11/12 max-w-lg">
            <h2 className="flex justify-center text-xl mb-4 font-medium">
              Crear Tablero
            </h2>
            {/* Previsualización del fondo seleccionado */}
            <div
              className={`flex justify-center items-center w-full md:h-32 bg-cover rounded-md mb-4`}
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
                className="absolute size-16 md:size-36"
              />
            </div>

            <h3 className="mb-2 mx-2 text-lg font-medium">Fondo</h3>
            <div className="flex h-52 gap-2 flex-wrap  mb-2 p-2 scrollbar overflow-y-auto border-b-2">
              {/* Imágenes de Cloudinary obtenidas */}
              {cloudinaryImages.concat(imageUrls).map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleBackgroundChange(image)}
                >
                  <img
                    src={image}
                    alt={`Fondo ${index + 1}`}
                    className="w-24 h-24  object-cover rounded-md"
                  />
                </button>
              ))}
              <button
                className="w-24 h-24 bg-orange-500 rounded-md"
                onClick={() => handleBackgroundChange("#f97316")}
              />
              <button
                className="w-24 h-24 bg-blue-500 rounded-md"
                onClick={() => handleBackgroundChange("#03A9F4")}
              />
              <button
                className="w-24 h-24 bg-indigo-500 rounded-md"
                onClick={() => handleBackgroundChange("#6366f1")}
              />
              <button
                className="w-24 h-24 bg-gray-900 rounded-md"
                onClick={() => handleBackgroundChange("#111827")}
              />
            </div>

            {/* Input de subir imágenes */}
            <div className="flex ">
              <label className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-xs py-2 px-4 rounded cursor-pointer">
                Subir imagen...
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={onFileInputChange}
                />
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
            <div className="flex justify-center ">
              <button
                className="mt-4 px-4 py-2 transition duration-300 hover:scale-110 ease-in-out bg-green-500 text-xl text-white rounded"
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
