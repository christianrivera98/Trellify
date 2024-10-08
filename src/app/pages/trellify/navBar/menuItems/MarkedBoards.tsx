import { useState } from "react";

export const MarkedBoards = () => {

    
    const [isOpen, setIsOpen] = useState(false);

    //Funcion para abrir el menu 

    const onMarked = () => {
        setIsOpen(!isOpen);
    }


  return (
    <div className="relative inline-block text-left">
      <button
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-500 rounded-md hover:bg-blue-400 hover:text-white focus:outline-none"
        onClick={onMarked}
      >
        Marcado
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
              Opción 1
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Opción 2
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Opción 3
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
