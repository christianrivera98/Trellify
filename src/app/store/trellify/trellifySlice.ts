import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Board,
  Column,
  FavBoard,
  Id,
  Task,
} from "../../pages/trellify/board/types/types";
import { reorderArray } from "../../../helpers/reorderArray";

export interface TrellifyState {
  isSaving: boolean;
  title: string;
  backgroundUrl: string;
  tempBackgroundUrl: string;
  boards: Board[];
  favBoards: FavBoard[];
  activeBoard: Board | null;
  activeColumn: Column | null;
  activeTask: Task | null;
  loading: boolean;
  error: string | null;
  imageUrls: string[];
  cloudinaryImages: string[];
}

const initialState: TrellifyState = {
  isSaving: false,
  title: "",
  backgroundUrl: "",
  tempBackgroundUrl: "",
  boards: [],
  favBoards: [],
  activeBoard: null,
  activeColumn: null,
  activeTask: null, // Mantenemos esto si lo usas para destacar una tarea
  loading: false,
  error: null,
  imageUrls: [],
  cloudinaryImages: [],
};

export const trellifySlice = createSlice({
  name: "trellify",
  initialState,
  reducers: {
    savingNewBoard: (state) => {
      state.isSaving = true;
    },
    addNewBoard: (state, action: PayloadAction<Board>) => {
      state.boards = [...state.boards, action.payload];
      state.isSaving = false;
    },
    setActiveBoard: (state, action: PayloadAction<Board | null>) => {
      state.activeBoard = action.payload;

      if (action.payload) {
        localStorage.setItem("activeBoardId", action.payload.id);
        localStorage.setItem("activeBoard", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("activeBoardId");
        localStorage.removeItem("activeBoard");
      }
    },

    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },

    setFavBoards: (state, action: PayloadAction<FavBoard[]>) => {
      state.favBoards = action.payload;
    },

    isFavorite: (
      state,
      action: PayloadAction<{ isFavorite: boolean; boardId: string }>
    ) => {
      const { isFavorite } = action.payload;
      const board = state.boards.find(
        (board) => board.id === state.activeBoard?.id
      );

      if (board) {
        board.isFavorite = isFavorite;
        if (state.activeBoard?.id === board.id) {
          state.activeBoard.isFavorite = true;
        }
        // if(state.activeBoard?.id === board.id)
      }
    },

    deleteBoard: (state) => {
      state.activeBoard = null;
    },

    updateBoard: (state) => {
      if (state.activeBoard) {
        const index = state.boards.findIndex(
          (board) => board.id === state.activeBoard?.id
        );
        const favIndex = state.favBoards.findIndex(
          (board) => board.id === state.activeBoard?.id
        );
        if (index !== -1) {
          state.boards[index] = state.activeBoard;
        }
        if (favIndex !== -1) {
          state.favBoards[favIndex] = state.activeBoard;
        }
      }
    },

    updateBoardTitle: (
      state,
      action: PayloadAction<{ boardId: string; title: string }>
    ) => {
      const { boardId, title } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);

      if (board) {
        board.title = title;
        if (state.activeBoard?.id === boardId) {
          state.activeBoard.title = title;
        }
      }
    },

    setSaving: (state) => {
      state.isSaving = true;
    },

    setPhotos: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = [...state.imageUrls, ...action.payload];
      if (state.activeBoard) {
        state.activeBoard.imageUrls = [
          ...state.activeBoard.imageUrls,
          ...action.payload,
        ];
      }
      state.isSaving = false;
    },

    setBoardBackground: (state, action: PayloadAction<string>) => {
      const backgroundUrl = action.payload;
      state.tempBackgroundUrl = backgroundUrl;
      state.backgroundUrl = backgroundUrl;
    },

    addColumn: (state, action: PayloadAction<Column>) => {
      if (state.activeBoard) {
        state.activeBoard.lists.push(action.payload);
      }
    },

    setActiveColumn: (state, action: PayloadAction<Column | null>) => {
      state.activeColumn = action.payload;
    },

    reorderColumns: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (state.activeBoard) {
        state.activeBoard.lists = reorderArray(
          state.activeBoard.lists,
          fromIndex,
          toIndex
        );
      }
    },

    updateColumn: (state, action: PayloadAction<{ id: Id; title: string }>) => {
      const { id, title } = action.payload;
      const list = state.activeBoard?.lists.find((list) => list.id === id);

      if (list) {
        list.title = title;
      }
    },

    setTask: (
      state,
      action: PayloadAction<{ columnId: Id; tasks: Task[] }>
    ) => {
      const { columnId, tasks } = action.payload;
      const column = state.activeBoard?.lists.find(
        (col) => col.id === columnId
      );
      if (column) {
        column.tasks = tasks;
      }
    },

    addTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload;
      const columnIndex = state.activeBoard?.lists.findIndex(
        (col) => col.id === task.columnId
      );

      if (
        columnIndex !== undefined &&
        columnIndex !== -1 &&
        state.activeBoard
      ) {
        const updatedColumn = {
          ...state.activeBoard.lists[columnIndex],
          tasks: [...state.activeBoard.lists[columnIndex].tasks, task],
        };
        state.activeBoard.lists[columnIndex] = updatedColumn;
      }
    },

    setActiveTask: (state, action: PayloadAction<Task | null>) => {
      state.activeTask = action.payload;
    },

    deleteList: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      if (state.activeBoard) {
        state.activeBoard.lists = state.activeBoard.lists.filter(
          (col) => col.id !== columnId
        );
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.activeBoard?.lists.forEach((list) => {
        list.tasks = list.tasks.filter((task) => task.id !== taskId);
      });
    },

    updateTask: (state, action: PayloadAction<{ id: Id; content: string }>) => {
      const { id, content } = action.payload;
      const task = state.activeBoard?.lists
        .flatMap((list) => list.tasks)
        .find((task) => task.id === id);
      if (task) {
        task.content = content;
      }
    },

    setListsToActiveBoard: (state, action: PayloadAction<Board>) => {
      if (state.activeBoard) {
        state.activeBoard.lists = action.payload.lists;
      }
    },

    clearDashBoardLogOut: (state) => {
      state.activeBoard = null;
    },
  },
});

export const {
  savingNewBoard,
  setActiveBoard,
  setBoards,
  deleteBoard,
  setFavBoards,
  isFavorite,
  updateBoard,
  updateBoardTitle,
  setActiveColumn,
  setListsToActiveBoard,
  reorderColumns,
  updateColumn,
  setTask,
  addTask,
  setActiveTask,
  deleteTask,
  updateTask,
  addNewBoard,
  addColumn,
  deleteList,
  setSaving,
  setPhotos,
  setBoardBackground,
  clearDashBoardLogOut,
} = trellifySlice.actions;
export default trellifySlice.reducer;
