import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  columnId: z.string(),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string(),
});

export const columnSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El título es obligatorio"),
  tasks: z.array(taskSchema),
  boardId: z.string(),
});

export const boardSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El título del tablero es obligatorio"),
  backgroundUrl: z.string(),
  lists: z.array(columnSchema),
  imageUrls: z.array(z.string()),
  isFavorite: z.boolean(),
});

export const createBoardSchema = z.object({
  title: z.string().min(1, "Es necesario indicar el título del tablero"),
  backgroundUrl: z.string(),
});
