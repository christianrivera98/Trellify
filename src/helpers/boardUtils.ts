import { Id } from "../app/pages/trellify/board/types/types";
import { AppDispatch } from "../app/store/Store";
import { deleteTask, updateColumn, updateTask } from "../app/store/trellify/trellifySlice";

export function generateId() {
    return Math.floor(Math.random() * 10001);
  }

export const updateColumnTitle = (id: Id, title:string, dispatch: AppDispatch) => {
  dispatch(updateColumn({id, title}))
};

export const removeTask = (id:string, dispatch:AppDispatch) => {
  dispatch(deleteTask(id))
}

export const updateTaskContent = (id: Id, title: string, description:string, dispatch: AppDispatch) => {
  dispatch(updateTask({id, title, description}))
}