import {  Id } from "./types/types";
import ColumnContainer from "./components/ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {  SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./components/TaskCard";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/Store";
import { startNewColumn, startNewTask } from "../../../store/trellify/trellifyThunks";
import {  updateColumnTitle, updateTaskContent } from "../../../../helpers/boardUtils";
import { useSelector } from "react-redux";
import { onDragEnd, onDragOver, onDragStart } from "../../../../helpers/dragHandlers";
import { deleteTask } from "../../../store/trellify/trellifySlice";

export const Board = () => {
  const dispatch: AppDispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.trellify.columns );
  const tasks = useSelector((state: RootState) => state.trellify.tasks );
  const activeColumn = useSelector((state: RootState) => state.trellify.activeColumn );
  const activeTask = useSelector((state: RootState) => state.trellify.activeTask );
  const columnsId = columns.map((col) => col.id)
  
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  
  const onCreateNewColumn = () => {
    dispatch(startNewColumn());
  }

  const handleDragStart = (event: DragStartEvent) => {
      onDragStart (event, dispatch)
  }

 const handleDragEnd = (event: DragEndEvent) => {
    onDragEnd (event, dispatch, columns)
 }

 const handleDragOver = (event: DragOverEvent) => {
  onDragOver (event, dispatch,tasks)
}

const handleUpdateColumn = (id: Id, newTitle:string) => {
  updateColumnTitle( id, newTitle, dispatch);
}

const handleRemoveTask = (id:  Id | any) => {
  dispatch(deleteTask(id));
}

const handleAddTask = (columnId: Id) => {
  dispatch(startNewTask(columnId));
}

const handleUpdateTask = (id: Id, newContent: string) => {
    updateTaskContent(id, newContent, dispatch)
}

  return (
    <div >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="m-auto gap-4 flex">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  // deleteColumn={deletecolumn}
                  updateColumn={handleUpdateColumn}
                  createTask={handleAddTask}
                  deleteTask={handleRemoveTask}
                  updateTask={handleUpdateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={onCreateNewColumn}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-slate-800 opacity-60 border-none p-4 hover:opacity-100 "
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
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                // deleteColumn={deleteColumn}
                updateColumn={handleUpdateColumn}
                createTask={handleAddTask}
                deleteTask={handleRemoveTask}
                updateTask={handleUpdateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} deleteTask={handleRemoveTask} updateTask={handleUpdateTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );



  // function onDragStart(event: DragStartEvent) {
  //   if (event.active.data.current?.type === "Column") {
  //     setActiveColumn(event.active.data.current.column);
  //     return;
  //   }

  //   if (event.active.data.current?.type === "Task") {
  //     setActiveTask(event.active.data.current.task);
  //     return;
  //   }
  // }

  // function onDragEnd(event: DragEndEvent) {
  //   setActiveColumn(null);
  //   setActiveTask(null);
  //   const { active, over } = event;

  //   if (!over) return;

  //   const activeColumnId = active.id;
  //   const overColumnId = over.id;

  //   if (activeColumnId === overColumnId) return;

  //   setColumns((columns) => {
  //     const activeColumnIndex = columns.findIndex(
  //       (col) => col.id === activeColumnId
  //     );

  //     const overcolumnIndex = columns.findIndex(
  //       (col) => col.id === overColumnId
  //     );

  //     return arrayMove(columns, activeColumnIndex, overcolumnIndex);
  //   });
  // }

  // function onDragOver(event: DragOverEvent) {
  //   const { active, over } = event;

  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   const isActiveATask = active.data.current?.type === "Task";
  //   const isOverATask = over.data.current?.type === "Task";

  //   if(!isActiveATask) return;

  //   if (isActiveATask && isOverATask ) {
  //     setTasks((tasks) => {
  //       const activeIndex = tasks.findIndex(t=> t.id === activeId);
  //       const overIndex = tasks.findIndex(t=> t.id === overId);


  //     tasks[activeIndex].columnId = tasks[overIndex].columnId
      

  //       return arrayMove(tasks, activeIndex, overIndex);
  //     });
  //   }

  //   const isOverAColumn = over.data.current?.type === "Column";

  //   if(isActiveATask &&  isOverAColumn){
  //     setTasks((tasks) => {
  //       const activeIndex = tasks.findIndex(t=> t.id === activeId);
       

  //     tasks[activeIndex].columnId = overId;
      

  //       return arrayMove(tasks, activeIndex, activeIndex);
  //     });
  //   }
  // }

  // function updateColumn(id: Id, title: string) {
  //   const newColumns = columns.map((col) => {
  //     if (col.id !== id) return col;

  //     return { ...col, title };
  //   });
  //   setColumns(newColumns);
  // }

  // function createTask(columnId: Id) {
  //   const newTask: Task = {
  //     id: generateId(),
  //     columnId,
  //     content: Task ${tasks.length + 1},
  //   };
  //   setTasks([...tasks, newTask]);
  // }

  // function deleteTask(id: Id) {
  //   const newTasks = tasks.filter((task) => task.id !== id);
  //   setTasks(newTasks);
  // }

//   function updateTask(id: Id, content: string) {
//     const newTask = tasks.map((task) => {
//       if (task.id !== id) return task;
//       return { ...task, content };
//     });

//     setTasks(newTask);
//   }
};
