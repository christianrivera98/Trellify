import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id} from "../types/types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/Store";
import { deleteList } from "../../../../store/trellify/trellifySlice";

interface Props {
  column: Column | null;
  updateColumn: (columnId: Id, newTitle: string) => void;
  deleteTask: (id: Id) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  // tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const { column, updateColumn, createTask, deleteTask, updateTask } = props;

  if (!column) {
    return null; // Si column es null, no renderizas nada
  }

  const [editMode, setEditMode] = useState(false);

  // Usa directamente `column.tasks`
  const taskIds = useMemo(() => {
    return column.tasks.map((task) => task.id);
  }, [column.tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled: editMode,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-600 opacity-40 border-2 md:w-[350px] md:h-[500px] max-h-[500px] rounded-md"
      ></div>
    );
  }

  const onDeleteList = (columnId: Id | any) => {
    dispatch(deleteList(columnId));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        onClick={() => {
          setEditMode(true);
        }}
        {...attributes}
        {...listeners}
        className="bg-slate-700 text-md h-[60px] cursor-grab rounded-sm m-2 round-b-none p-3 font-bold border-2 border-slate-500 flex items-center justify-between"
      >
        {!editMode && column.title}
        {editMode && (
          <input
            className="text-slate-100 bg-transparent border-slate-500 p-2 outline-none"
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}
        <button className="bg-slate-800 rounded-md opacity-60 hover:opacity-100" onClick={() => onDeleteList(column.id)}>
          <img className="size-6" src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896370/findy/delete-icon_jafp73.svg" alt="delete-icon" />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-950 scrollbar-track-gray-700 m-1">
        <SortableContext items={taskIds}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 h-auto w-64 mx-3 mb-2 items-center rounded-md p-2 hover:bg-slate-900 active:bg-black"
      >
        <img className="size-5" src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896372/findy/plus-icon_aerbfs.svg" alt="plus-icon" />
        Añadir tarea
      </button>
    </div>
  );
};

export default ColumnContainer;