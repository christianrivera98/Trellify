import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/Store";
import {
  savedActiveBoard,
  startDeleteBoard,
  startUpdatingBoardTitle,
  toggleFavBoard,
} from "../../../store/trellify/trellifyThunks";
import { Board } from "../board/types/types";
import { truncateText } from "../../../lib/utils";
import { toast } from "sonner";
import { FiSave, FiTrash2, FiStar } from "react-icons/fi";
import { ConfirmDialog } from "../../../components/ui/confirm-dialog";

interface BoardHeaderProps {
  board: Board;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export const BoardHeader = ({ board, isFavorited, onFavoriteToggle }: BoardHeaderProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTitleUpdate = () => {
    if (newTitle.trim() !== "") {
      dispatch(startUpdatingBoardTitle(board.id, newTitle));
      setIsEditing(false);
      toast.success("Título actualizado");
    }
  };

  const onSaveButton = () => {
    setIsSaving(true);
    dispatch(savedActiveBoard());
    setIsSaving(false);
    toast.success("Tablero guardado");
  };

  const onFavButton = () => {
    dispatch(toggleFavBoard());
    onFavoriteToggle();
    dispatch(savedActiveBoard());
    toast.success(isFavorited ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const onDeleteBoard = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(startDeleteBoard());
    setShowDeleteConfirm(false);
    toast.success("Tablero eliminado");
  };

  if (isEditing) {
    return (
      <input
        type="text"
        className="flex items-center bg-slate-400 h-12 md:h-12 w-fit md:w-fit rounded-xl md:mx-10 my-5 bg-opacity-70"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={handleTitleUpdate}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleTitleUpdate();
        }}
        autoFocus
      />
    );
  }

  return (
    <>
      <div className="flex items-center bg-slate-400 md:h-12 w-fit md:w-fit rounded-xl md:mx-10 ml-7 my-5 mt-20 bg-opacity-70">
        <h3
          className="md:text-3xl ml-6 mr-4 md:h-12 w-fit flex justify-center items-center cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {truncateText(board.title, 17)}
        </h3>

        <button className="mr-1" onClick={onSaveButton} title="Guardar tablero">
          {isSaving ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600" />
            </div>
          ) : (
            <FiSave className="size-6 hover:scale-110 transition-transform ease-in-out duration-150" />
          )}
        </button>

        <button
          className="flex justify-center rounded-xl items-center size-12"
          onClick={onFavButton}
          title={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <FiStar
            className={`w-5 h-5 transition duration-150 ease-in-out hover:scale-95 ${
              isFavorited && board.isFavorite ? "fill-current text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>

        <button
          onClick={onDeleteBoard}
          className="mr-4 hover:scale-110 transition-transform ease-in-out duration-150"
          title="Eliminar tablero"
        >
          <FiTrash2 className="size-6 text-red-300 hover:text-red-500" />
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar tablero"
        message={`¿Estás seguro de que quieres eliminar "${truncateText(board.title, 20)}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
