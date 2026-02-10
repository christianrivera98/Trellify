import { useSelector } from "react-redux";
import { NavBarMenu } from "./navBar/NavBarMenu";
import { AppDispatch, RootState } from "../../store/Store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAllBoards,
  fetchAllBoardsFavs,
  fetchLastBoard,
} from "../../store/trellify/trellifyThunks";
import { NothingSelectedView } from "./NothingSelectedView";
import { BoardContent } from "./components/BoardContent";

export const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.trellify.boards);
  const activeBoard = useSelector(
    (state: RootState) => state.trellify.activeBoard
  );
  const { uid } = useSelector((state: RootState) => state.auth);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uid) {
      dispatch(fetchLastBoard(uid));
      dispatch(fetchAllBoards(uid));
      dispatch(fetchAllBoardsFavs(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    if (activeBoard) {
      setLoading(false);
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      const isFav = boards.some((board) => board.id === activeBoard?.id);
      setIsFavorited(isFav);
    }
  }, [activeBoard, boards]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBarMenu />
      <div className="overflow-hidden overflow-y-auto flex-1">
        {activeBoard ? (
          <BoardContent
            board={activeBoard}
            loading={loading}
            isFavorited={isFavorited}
            onFavoriteToggle={() => setIsFavorited(!isFavorited)}
          />
        ) : (
          <NothingSelectedView />
        )}
      </div>
    </div>
  );
};
