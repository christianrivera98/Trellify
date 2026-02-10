import { Board as BoardComponent } from "../board/Board";
import { Board } from "../board/types/types";
import { isColor, isImageUrl } from "../../../lib/utils";
import { BoardHeader } from "./BoardHeader";
import { BoardLoadingSkeleton } from "./BoardLoadingSkeleton";

interface BoardContentProps {
  board: Board;
  loading: boolean;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export const BoardContent = ({ board, loading, isFavorited, onFavoriteToggle }: BoardContentProps) => {
  return (
    <div
      key={board.id}
      className="bg-cover min-h-screen w-screen md:h-full md:w-full bg-center p-2 text-white flex flex-col"
      style={{
        backgroundImage: isImageUrl(board.backgroundUrl)
          ? `url(${board.backgroundUrl})`
          : undefined,
        backgroundColor: isColor(board.backgroundUrl)
          ? board.backgroundUrl
          : undefined,
        backgroundSize: "cover",
      }}
    >
      {loading ? (
        <BoardLoadingSkeleton />
      ) : (
        <div className="flex flex-col flex-grow">
          <BoardHeader
            board={board}
            isFavorited={isFavorited}
            onFavoriteToggle={onFavoriteToggle}
          />
          <div className="flex-grow md:ml-8 overflow-hidden flex">
            <div className="flex overflow-x-auto">
              <BoardComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
