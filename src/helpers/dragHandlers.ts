import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { AppDispatch } from "../app/store/Store";
import { reorderColumns, setActiveColumn, setActiveTask, setTask } from "../app/store/trellify/trellifySlice";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Id } from "../app/pages/trellify/board/types/types";

// Manejo de inicio de arrastre
export const onDragStart = (event: DragStartEvent, dispatch: AppDispatch) => {
  const activeType = event.active.data.current?.type;
  if (activeType === "Column") {
    dispatch(setActiveColumn(event.active.data.current?.column));
  } else if (activeType === "Task") {
    dispatch(setActiveTask(event.active.data.current?.task));
  }
};

// Manejo de finalización de arrastre
export const onDragEnd = (event: DragEndEvent, dispatch: AppDispatch, columns: Column[]) => {
  dispatch(setActiveColumn(null));
  dispatch(setActiveTask(null));

  const { active, over } = event;

  if (!over) return;

  const activeId = active.id as Id;
  const overId = over.id as Id;

  if (activeId === overId) return;

  const activeType = active.data.current?.type;
  const overType = over.data.current?.type;

  if (activeType === "Column" && overType === "Column") {
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      dispatch(
        reorderColumns({ fromIndex: activeColumnIndex, toIndex: overColumnIndex })
      );
    }
  } else if (activeType === "Task" && overType === "Task") {
    const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));
    const overColumn = columns.find((col) => col.tasks.some((task) => task.id === overId));

    if (activeColumn && overColumn) {
      const activeTaskIndex = activeColumn.tasks.findIndex((task) => task.id === activeId);
      const overTaskIndex = overColumn.tasks.findIndex((task) => task.id === overId);

      if (activeColumn.id === overColumn.id) {
        const updatedTasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
        dispatch(setTask({ columnId: activeColumn.id, tasks: updatedTasks }));
      } else {
        // Cambiar la columna de la tarea
        const taskToMove = activeColumn.tasks[activeTaskIndex];
        taskToMove.columnId = overColumn.id;

        // Remover la tarea de la columna activa y agregarla a la columna de destino
        const updatedActiveTasks = [...activeColumn.tasks];
        updatedActiveTasks.splice(activeTaskIndex, 1);
        dispatch(setTask({ columnId: activeColumn.id, tasks: updatedActiveTasks }));

        const updatedOverTasks = [...overColumn.tasks];
        updatedOverTasks.splice(overTaskIndex, 0, taskToMove);
        dispatch(setTask({ columnId: overColumn.id, tasks: updatedOverTasks }));
      }
    }
  }
};

// Manejo de arrastre sobre una columna o lista
export const onDragOver = (
  event: DragOverEvent, 
  dispatch: AppDispatch, 
  columns: Column[]
) => {
  const { active, over } = event;

  if (!over) return;

  const activeId = active.id as Id;
  const overId = over.id as Id;

  // Si el elemento activo y el sobre el que se pasa son iguales, no hacer nada
  if (activeId === overId) return;

  // Identificar si el elemento arrastrado y el sobre el que se pasa son tareas
  const isActiveTask = active.data.current?.type === "Task";
  const isOverTask = over.data.current?.type === "Task";

  if (isActiveTask && isOverTask) {
    // Encontrar las columnas de origen y destino
    const activeColumn = columns.find((col) => col.tasks.some((task) => task.id === activeId));
    const overColumn = columns.find((col) => col.tasks.some((task) => task.id === overId));

    if (activeColumn && overColumn) {
      const activeTaskIndex = activeColumn.tasks.findIndex((task) => task.id === activeId);
      const overTaskIndex = overColumn.tasks.findIndex((task) => task.id === overId);

      // Si las tareas pertenecen a la misma columna
      if (activeColumn.id === overColumn.id) {
        // Crear una copia inmutable de las tareas de la columna activa
        const updatedTasks = arrayMove([...activeColumn.tasks], activeTaskIndex, overTaskIndex);
        dispatch(setTask({ columnId: activeColumn.id, tasks: updatedTasks }));
      } else {
        // Crear una copia del objeto de la tarea que se va a mover para evitar mutaciones
        const taskToMove = { ...activeColumn.tasks[activeTaskIndex], columnId: overColumn.id };

        // Crear una copia inmutable de las tareas de la columna activa y remover la tarea
        const updatedActiveTasks = [...activeColumn.tasks];
        updatedActiveTasks.splice(activeTaskIndex, 1);
        dispatch(setTask({ columnId: activeColumn.id, tasks: updatedActiveTasks }));

        // Crear una copia inmutable de las tareas de la columna de destino e insertar la tarea movida
        const updatedOverTasks = [...overColumn.tasks];
        updatedOverTasks.splice(overTaskIndex, 0, taskToMove);
        dispatch(setTask({ columnId: overColumn.id, tasks: updatedOverTasks }));
      }
    }
  }
};

