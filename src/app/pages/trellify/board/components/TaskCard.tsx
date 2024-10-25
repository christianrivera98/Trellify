import { useState } from "react";
import { Id, Task } from "../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, updateTask, deleteTask}: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "Task",
        task,
      },
      disabled: editMode
    });

    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    }  

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return <div ref={setNodeRef}
    style={style}
    className="bg-slate-900 border-2 border-slate-950 opacity-50 p-2.5 h-[100px] mmin-h-[100px] flex items-center justify-between text-left rounded-xl  cursor-grabs relative"/>

  }
  if (editMode) {
    return (
      <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-900 p-2.5 h-[100px] mmin-h-[100px] flex items-center justify-between text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-800 cursor-grab">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none scrollbar-thin scrollbar-thumb-slate-950 scrollbar-track-gray-700 scrollbar-rounded-full"
          value={task.content}
          autoFocus
          placeholder="Introduce la tarea que requieres aquí..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" ) {
              toggleEditMode();
            } 
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  const handleRemoveTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el modo de edición al hacer clic en el botón de eliminar
    deleteTask(task.id); // Llama a la función que elimina la tarea
  };


  return (
    <div
    ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    onClick={toggleEditMode}
      className="bg-slate-900 p-2.5 h-[100px] mmin-h-[100px] flex items-center justify-between text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-slate-300 cursor-grabs relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto truncate  h-[90%] text-wrap overflow-y-auto  scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-gray-700 scrollbar-rounded-xl" >
        {task.content}
      </p>
      
      {mouseIsOver && (
        <button
          onClick={
            handleRemoveTask
          }
          className="stroke-white p-2 rounded opacity-60 hover:opacity-100"
        >
          <img
            className="size-6"
            src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896370/findy/delete-icon_jafp73.svg"
            alt="delete-icon"
          />
        </button>
      )}
    </div>
  );
}

export default TaskCard;