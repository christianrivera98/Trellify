import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useSelector } from "react-redux";
import { startLogout } from "../../../../store/auth/Thunks";

export const LoginMenu = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const { displayName } = useSelector((state: RootState) => state.auth);

    //Funcion para abrir el menu 

    const onAccountButton = () => {
        setIsOpen(!isOpen);
    } 

    const onLogout = () => {
        dispatch ( startLogout());
    }
    
  return (
    <div className="relative inline-block text-left mx-10">
      <button
        className="inline-flex justify-center w-max px-4 py-2 text-sm font-medium text-blue-500 rounded-md hover:bg-blue-400 hover:text-white focus:outline-none"
        onClick={onAccountButton}
      >
        {displayName}
        <img
          className="size-5"
          src="src/assets/iconsButtons/down-arrow.svg"
          alt="down-arrow"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Tema
            </a>
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
