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
import { NothingSelectedView } from "./NothingSelectedView";

export const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const favBoards = useSelector((state: RootState) => state.trellify.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.trellify.activeBoard
  );
  const { uid } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setisSaving] = useState(false);
  const [newTitle, setNewTitle] = useState(activeBoard?.title || "");
  const [isFavorited, setisFavorited] = useState(false);
  const isColor = (value: string) => /^#[0-9A-F]{6}$/i.test(value);
  const [loading, setloading] = useState(true);
  const [itsLoaded, setitsLoaded] = useState(false);
 

  const isImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
  };

  useEffect(() => {
    if (uid) {
      dispatch(fetchLastBoard(uid));
      dispatch(fetchAllBoards(uid));
      dispatch(fetchAllBoardsFavs(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    const loadBoards = async () => {
      setloading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  const onSaveButton = async () => {
    setisSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(savedActiveBoard());
    setisSaving(false);
  };

  const onFavButton = () => {
    dispatch(toggleFavBoard());
    setisFavorited(!isFavorited);
    dispatch(savedActiveBoard());
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
              <div className="flex flex-col items-center justify-center bg-slate-950  h-screen py-4">
                <p className="font-semibold text-2xl italic text-slate-100 text-pretty">
                  Cargando tablero
                </p>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600" />
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
                      {isSaving ? (
                        <div className="flex items-center justify-center h-screen py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600" />
                        </div>
                      ) : (
                        <img
                          className=" hover:scale-110  size-7 transition-transform ease-in-out duration-150"
                          src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896372/findy/save_icon_zrjqui.svg"
                          alt=""
                        />
                      )}
                    </button>
                    <button
                      className="flex justify-center rounded-xl    items-center size-12 }"
                      onClick={onFavButton}
                    >
                      {isFavorited && activeBoard.isFavorite ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-black transition duration-150 ease-in-out hover:scale-95"
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
                          className="w-5 h-5 text-gray-700"
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
                    <button
                      onClick={onDeleteBoard}
                      className="mr-4 hover:scale-110 transition-transform ease-in-out duration-150"
                    >
                      <img
                        className="size-7 "
                        src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896370/findy/delete-icon_jafp73.svg"
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
