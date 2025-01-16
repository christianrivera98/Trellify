import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useDispatch } from "react-redux";
import { setActiveBoard } from "../../../../store/trellify/trellifySlice";
import { Board, menuItemsProps } from "../../board/types/types";
import { useEffect, useState } from "react";

export const WorkSpaceItem = ({openMenu, menuToggle}: menuItemsProps) => {
  const boards = useSelector((state: RootState) => state.trellify.boards);
  const dispatch: AppDispatch = useDispatch();
  const isOpen = openMenu === "workspace";
  const [loading, setloading] = useState(true)
  const isColor = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

  useEffect(() => {
    const loadBoards = async () => {
      setloading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));
      setloading(false);
    };

    if(isOpen){
      loadBoards();
    }
  
  }, [isOpen])
  
 
  const handleBoard = (board: Board) => {
    dispatch(setActiveBoard(board));
    menuToggle("")
    console.log(menuToggle);
    
  };

  return (
    <div className="relative inline-block text-left   ">
      <button
        className={`inline-flex justify-between  w-auto px-4 py-2 text-sm font-medium ${isOpen?" bg-blue-600 text-white" : "bg-white"} text-blue-500 rounded-md hover:bg-blue-400 hover:text-white focus:outline-none`}
        onClick={() => menuToggle(isOpen? "": "workspace")}
      >
        Espacios de trabajo
        <img
          className="size-5 mx-2"
          src="assets/iconsButtons/down-arrow.svg"
          alt="down-arrow"
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64  origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          {loading ? (
              <div className="flex items-center justify-center py-4">
                <div  className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"/>
              </div>
          ): (
            boards.map((board) => (
            <div
              className="py-1 rounded-md my-2 flex items-center cursor-pointer hover:bg-gray-100 "
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
                {board.title.length > 17? board.title.substring(0,17) + '...': board.title}
              </a>
            </div>
          )))}
          
        </div>
      )}
    </div>
  );
};
