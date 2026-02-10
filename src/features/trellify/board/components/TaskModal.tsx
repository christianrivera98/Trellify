import React, { useState, useEffect, useCallback } from "react";
import { Task } from "../types/types";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { updateTask } from "../../../../store/trellify/trellifySlice";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState(task.description);
  const [textAreaIsOpen, setTextAreaIsOpen] = useState(!task.description);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 p-6 rounded-lg w-11/12 max-w-lg text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 id="task-modal-title" className="text-2xl font-bold mb-4">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="cursor-pointer hover:rounded hover:bg-slate-400 p-1"
          >
            <IoClose className="size-5" />
          </button>
        </div>

        <h3 className="font-medium mb-2">Descripción</h3>

        {textAreaIsOpen ? (
          <textarea
            className="w-full p-2 bg-slate-800 rounded-lg resize-none text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade una descripción..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTextAreaIsOpen(false);
                dispatch(
                  updateTask({
                    id: task.id,
                    description,
                    title: task.title,
                  })
                );
              }
            }}
          />
        ) : (
          <p
            className={`p-2 bg-slate-800 rounded-lg cursor-pointer ${
              !description && "italic text-gray-400"
            }`}
            onClick={() => setTextAreaIsOpen(true)}
          >
            {description || "Haz clic aquí para añadir una descripción..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
