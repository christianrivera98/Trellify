import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { Column, Task } from "../app/pages/trellify/board/types/types";
import { AppDispatch } from "../app/store/Store";
import { reorderColumns, setActiveColumn, setActiveTask, setTask } from "../app/store/trellify/trellifySlice";
import { arrayMove } from "@dnd-kit/sortable";

export const onDragStart = (
    event: DragStartEvent,
    dispatch: AppDispatch
    
) => {
    const {current} = event.active.data;

    if (current?.type === "Column") {
        const column: Column = current.task;
        dispatch(setActiveColumn(column))
    }

    if (current?.type === "Task") {
        const task: Task = current.task;
        dispatch(setActiveTask(task))
    }
}

export const onDragEnd = (
    event: DragEndEvent,
    dispatch: AppDispatch,
    columns: Column[]
) => {
    const {active, over} = event;

    if (!over || active.id === over.id) return;

    const activeIndex = columns.findIndex((col) =>col.id === active.id);
    const overIndex = columns.findIndex((col) => col.id ===over.id);
    
    dispatch(reorderColumns({fromIndex:activeIndex, toIndex: overIndex}))
}

export const onDragOver = (
    event: DragOverEvent,
    dispatch: AppDispatch,
    tasks: Task[]
) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if(!isActiveATask) return;

    if (isActiveATask && isOverATask ) {
        const activeIndex = tasks.findIndex(t=> t.id === activeId);
        const overIndex = tasks.findIndex(t=> t.id === overId);


      const updateTasks = arrayMove(tasks,activeIndex, overIndex);
      
      const updateTask = {
        ...updateTasks[activeIndex],
        columnId: tasks[overIndex].columnId
      };

        updateTasks[activeIndex] = updateTask;

        dispatch(setTask(updateTasks));
      };
    

    const isOverAColumn = over.data.current?.type === "Column";

    if(isActiveATask &&  isOverAColumn){
        const activeIndex = tasks.findIndex(t=> t.id === activeId);
       

      const updatedTasks = [...tasks];
      updatedTasks[activeIndex] = {...updatedTasks[activeIndex], columnId: overId};
      

        dispatch(setTask(updatedTasks));
      };
    }
