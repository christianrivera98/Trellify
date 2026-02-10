import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useDispatch } from "react-redux";
import { setActiveBoard } from "../../../../store/trellify/trellifySlice";
import { Board, menuItemsProps } from "../../board/types/types";
import { isColor, truncateText } from "../../../../lib/utils";

export const MarkedBoards = ({openMenu, menuToggle}: menuItemsProps) => {

    const dispatch: AppDispatch = useDispatch();
    const favBoards =  useSelector((state: RootState) => state.trellify.favBoards);
    const isOpen = openMenu === "marked";

    const handleBoard = (board: Board) => {
      dispatch(setActiveBoard(board));
      menuToggle("");
    };

  return (
    <div className="relative inline-block text-left">
      <button
        className={`inline-flex justify-between  w-auto px-4 py-2 text-sm font-medium ${isOpen?" bg-blue-600 text-white" : "bg-white"} text-blue-500 rounded-md hover:bg-blue-400 hover:text-white focus:outline-none`}
        onClick={() => menuToggle(isOpen? "": "marked")}
      >
        Tableros Marcados
        <img
          className="size-5 mx-2"
          src="assets/iconsButtons/down-arrow.svg"
          alt="down-arrow"
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          {favBoards.map((board) => (
            <div
              className="py-1 rounded-md mb-1 flex items-center hover:bg-gray-100"
              key={board.id}
              onClick={() => handleBoard(board)}
            >

<div
                  className="w-16 h-14 mx-2 rounded-md"
                  style={{
                    backgroundColor: isColor(board.backgroundUrl)
                      ? board.backgroundUrl
                      : "transparent",
                    backgroundImage: isColor(board.backgroundUrl)
                      ? "none"
                      : `url(${board.backgroundUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-gray-700 "
              >
                {truncateText(board.title, 17)}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
