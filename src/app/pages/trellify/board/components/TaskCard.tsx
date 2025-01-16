import { useState } from "react";
import { Id, Task } from "../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskModal from "./TaskModal"; // Importaremos el modal aquí
import { useDispatch } from "react-redux";
import { setActiveTask } from "../../../../store/trellify/trellifySlice";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, updateTask, deleteTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const dispatch = useDispatch();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "Task",
        task,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const openModal = () => {
    dispatch(setActiveTask(task)); // Guardamos la tarea activa en Redux
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-900 opacity-50 p-2.5 h-[100px] flex items-center justify-between text-left rounded-xl"
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={openModal} // Abrir modal al hacer clic
        className="bg-slate-900 p-2.5 h-[100px] flex items-center justify-between text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-300 cursor-pointer"
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
      >
        <h3>

        </h3>
        <p className="truncate">{task.title}</p>
        {mouseIsOver && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="opacity-60 hover:opacity-100"
          >
            <img
              className="size-6"
              src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896370/findy/delete-icon_jafp73.svg"
              alt="delete-icon"
            />
          </button>
        )}
      </div>
      {isModalOpen && <TaskModal task={task} onClose={closeModal} />} {/* Renderizamos el modal */}
    </>
  );
}

export default TaskCard;
