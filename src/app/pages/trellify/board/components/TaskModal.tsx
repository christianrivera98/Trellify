import React, { useState } from "react";
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
  const [description, setDescription] = useState(task.description); // Usamos el estado local
  const [textAreaIsOpen, setTextAreaIsOpen] = useState(!task.description);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg w-11/12 max-w-lg text-white">
      <div className="flex justify-between ">
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
    <IoClose 
    className="cursor-pointer hover:rounded hover:bg-slate-400"
    onClick={() => onClose()}/>
      </div>

        <h2>Descripción</h2>

        {/* Muestra el textarea solo si está en modo edición o no hay descripción */}
        {textAreaIsOpen ? (
          <textarea
            className="w-full p-2 bg-slate-800 rounded-lg resize-none text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade una descripción..."
            autoFocus
            onKeyDown={(e) => {
                if (e.key === "Enter") {setTextAreaIsOpen(false), dispatch(updateTask({ id: task.id, description, title: task.title }));};
              }}
          ></textarea>
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
