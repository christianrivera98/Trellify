import { useSelector } from "react-redux";
import { NavBarMenu } from "./navBar/NavBarMenu";
import { AppDispatch, RootState } from "../../store/Store";
import { Board } from "./board/Board";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAllBoards,
  fetchAllBoardsFavs,
  fetchLastBoard,
  savedActiveBoard,
  startDeleteBoard,
  startUpdatingBoardTitle,
  toggleFavBoard,
} from "../../store/trellify/trellifyThunks";
import {
  deleteBoard,
  setActiveBoard,
} from "../../store/trellify/trellifySlice";
import { NothingSelectedView } from "./NothingSelectedView";

export const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const favBoards = useSelector((state: RootState) => state.trellify.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.trellify.activeBoard
  );
  const { uid } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(activeBoard?.title || "");
  const [isFavorited, setisFavorited] = useState(false);
  const isColor = (value: string) => /^#[0-9A-F]{6}$/i.test(value);
  const [loading, setloading] = useState(true);
  const [itsLoaded, setitsLoaded] = useState(false)

  const isImageUrl = (url: string) => {
    return (url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null);
};

  useEffect(() => {}, [activeBoard]);

  useEffect(() => {
    if (uid) {
      const savedActiveBoard = localStorage.getItem("activeBoard");
      if (savedActiveBoard) {
        const parsedBoard = JSON.parse(savedActiveBoard);
        dispatch(setActiveBoard(parsedBoard));
      }
       else {
        dispatch(fetchLastBoard(uid));
      }

      dispatch(fetchAllBoards(uid));
      dispatch(fetchAllBoardsFavs(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    const loadBoards = async () => {
      setloading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setloading(false);
      setitsLoaded(true);
    };

    if (activeBoard && !itsLoaded) {
      loadBoards();
      setNewTitle(activeBoard.title);

      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));

      const isFav = favBoards.some((board) => board.id === activeBoard?.id);
      setisFavorited(isFav);
    }
  }, [activeBoard, favBoards]);

  const handleTitleUpdate = () => {
    if (activeBoard && newTitle.trim() !== "") {
      dispatch(startUpdatingBoardTitle(activeBoard.id, newTitle));
      setIsEditing(false);
    }
  };

  const onSaveButton = () => {
    dispatch(savedActiveBoard());
  };

  const onFavButton = () => {
    dispatch(toggleFavBoard());
    setisFavorited(!isFavorited);
  };

  const onDeleteBoard = () => {
    dispatch(startDeleteBoard());
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBarMenu />
      <div className="overflow-hidden flex-1">
        {activeBoard ? (
          <div
          key={activeBoard.id}
          className="bg-cover h-full w-full bg-center p-2 text-white flex flex-col"
          style={{
              backgroundImage: isImageUrl(activeBoard.backgroundUrl)
                  ? `url(${activeBoard.backgroundUrl})`
                  : undefined,
              backgroundColor: isColor(activeBoard.backgroundUrl)
                  ? activeBoard.backgroundUrl
                  : undefined,
              backgroundSize: "cover",
          }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-screen py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white" />
              </div>
            ) : (
              <div className="flex flex-col flex-grow">
                {isEditing ? (
                  <input
                    type="text"
                    className="text-3xl bg-opacity-70 bg-slate-400 h-12 w-64 rounded-xl flex justify-center items-center mx-10 my-5"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleTitleUpdate}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleUpdate();
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center  bg-slate-400 h-12 w-fit rounded-xl mx-10 my-5 bg-opacity-70">
                    <h3
                      className="text-3xl ml-6 mr-4 h-12 w-fit flex justify-center items-center "
                      onClick={() => setIsEditing(true)}
                    >
                      {activeBoard.title.length > 17
                        ? activeBoard.title.substring(0, 17) + "..."
                        : activeBoard.title}
                    </h3>

                    <button className="mr-1 " onClick={onSaveButton}>
                      <img
                        className=" hover:scale-110 transition-transform ease-in-out duration-150"
                        src="src/assets/iconsButtons/save_icon.svg"
                        alt=""
                      />
                    </button>
                    <button
                      className="flex justify-center rounded-xl    items-center size-12 }"
                      onClick={onFavButton}
                    >
                      {isFavorited && activeBoard.isFavorite ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-black transition duration-150 ease-in-out hover:scale-95"
                        >
                          <path
                            fill="currentColor"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-gray-700"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          />
                        </svg>
                      )}{" "}
                    </button>
                    <button onClick={onDeleteBoard} className="mr-4 hover:scale-110 transition-transform ease-in-out duration-150">
                      <img
                        className="size-10 "
                        src="src/assets/iconsButtons/delete-icon.svg"
                        alt="delete-icon"
                      />
                    </button>
                  </div>
                )}

                <div className="flex-grow overflow-hidden flex">
                  <div className="flex overflow-x-auto">
                    <Board />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NothingSelectedView />
        )}
      </div>
    </div>
  );
};
