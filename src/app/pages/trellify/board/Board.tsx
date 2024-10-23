import { Column, Id } from "./types/types";
import ColumnContainer from "./components/ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./components/TaskCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/Store";
import {
  fetchLastBoard,
  startNewColumn,
  startNewTask,
} from "../../../store/trellify/trellifyThunks";
import {
  updateColumnTitle,
  updateTaskContent,
} from "../../../../helpers/boardUtils";
import {
  onDragEnd,
  onDragOver,
  onDragStart,
} from "../../../../helpers/dragHandlers";
import { deleteTask, reorderColumns, setActiveBoard } from "../../../store/trellify/trellifySlice";
import { useEffect } from "react";

export const Board = () => {
  const dispatch: AppDispatch = useDispatch();
  const activeBoard = useSelector((state: RootState) => state.trellify.activeBoard);
  const activeTask = useSelector((state: RootState) => state.trellify.activeTask);
  const state= useSelector((state: RootState) => state.trellify);
  const { uid } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (uid) {
      if (activeBoard) {
        dispatch(setActiveBoard(activeBoard));
      } else {
        dispatch(fetchLastBoard(uid));
      }
    }
  }, [uid, dispatch, activeBoard]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const onCreateNewColumn = () => {
    dispatch(startNewColumn());
  };

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart(event, dispatch);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (activeBoard) {
      onDragEnd(event, dispatch, activeBoard.lists);
    }
  };

  const handleDragOver = (event: DragOverEvent,  state: any) => {
    
      onDragOver(event, dispatch, activeBoard?.lists.flatMap(col => col.tasks), state);
    
  };

  const handleUpdateColumn = (id: Id, newTitle: string) => {
    updateColumnTitle(id, newTitle, dispatch);
  };

  const handleRemoveTask = (id: Id | any) => {
    dispatch(deleteTask(id));
  };

  const handleAddTask = (columnId: Id) => {
    dispatch(startNewTask(columnId));
  };

  const handleUpdateTask = (id: Id, newContent: string) => {
    updateTaskContent(id, newContent, dispatch);
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="m-auto gap-4 flex">
          <SortableContext items={(activeBoard?.lists || []).map((list) => list.id.toString())}>
            {activeBoard?.lists.map((list) => (
              <ColumnContainer
                key={list.id}
                column={list}
                updateColumn={handleUpdateColumn}
                createTask={handleAddTask}
                deleteTask={handleRemoveTask}
                updateTask={handleUpdateTask}
                tasks={list.tasks}
              />
            ))}
          </SortableContext>
          <button
            onClick={onCreateNewColumn}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-slate-800 opacity-60 border-none p-4 hover:opacity-100"
          >
            <img
              className="size-5"
              src="src/assets/iconsButtons/plus-icon.svg"
              alt="plus-icon"
            />
            Añadir lista
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={handleRemoveTask}
                updateTask={handleUpdateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
