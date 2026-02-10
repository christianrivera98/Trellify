import { v4 as uuidv4 } from "uuid";
import { Id } from "../features/trellify/board/types/types";
import { AppDispatch } from "../store/Store";
import { deleteTask, updateColumn, updateTask } from "../store/trellify/trellifySlice";

export function generateId(): string {
    return uuidv4();
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