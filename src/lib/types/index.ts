import { z } from "zod";
import {
  signInSchema,
  signUpSchema,
  boardSchema,
  columnSchema,
  taskSchema,
  createBoardSchema,
} from "../schemas";

export type SignInFormInputs = z.infer<typeof signInSchema>;
export type SignUpFormInputs = z.infer<typeof signUpSchema>;
export type BoardType = z.infer<typeof boardSchema>;
export type ColumnType = z.infer<typeof columnSchema>;
export type TaskType = z.infer<typeof taskSchema>;
export type CreateBoardInputs = z.infer<typeof createBoardSchema>;
