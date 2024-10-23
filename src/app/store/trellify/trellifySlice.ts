import {  createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, Column, FavBoard, Id, Task } from '../../pages/trellify/board/types/types';
import { fetchAllBoards, fetchAllBoardsFavs, fetchLastBoard } from './trellifyThunks';
import { reorderArray } from '../../../helpers/reorderArray';


export interface TrellifyState {
  isSaving: boolean;
  title: string;
  backgroundUrl: string;
  tempBackgroundUrl: string;
  boards: Board[];
  favBoards: FavBoard[];
  activeBoard: Board | null,
  columns: Column[];
  activeColumn: Column | null,
  tasks: Task[];
  activeTask: Task | null,
  loading: boolean;
  error: string | null;
  imageUrls: string[];
  cloudinaryImages: string[];
}

const initialState: TrellifyState = {
  isSaving: false,
  title: '',
  backgroundUrl: '',
  tempBackgroundUrl: '',
  boards: [],
  favBoards: [],
  activeBoard: null,
  columns: [],
  activeColumn: null,
  tasks: [], // este es el array que no me sirve, no uso
  activeTask:  null,
  loading: false,
  error: null,
  imageUrls: [],
  cloudinaryImages:[]

};

export const trellifySlice = createSlice({
  name: 'trellify',
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
    
      // Guardar el ID del tablero activo en el almacenamiento local
      if (action.payload) {
        localStorage.setItem('activeBoardId', action.payload.id);
        // Guardar el tablero activo completo si se desea
        localStorage.setItem('activeBoard', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('activeBoardId');
        localStorage.removeItem('activeBoard');
      }
    },

    

    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload
    },

    setFavBoards: (state, action: PayloadAction<FavBoard[]>) => {
  state.favBoards =  action.payload; // Reemplaza el arreglo de favoritos por completo
},

  isFavorite: (state, action: PayloadAction<{isFavorite:boolean, boardId: string}>) => {
        const {isFavorite, boardId} = action.payload;

        const board = state.boards.find ((b)=> b.id === boardId);
        
        if(board) {
          board.isFavorite = isFavorite;
          if (state.activeBoard?.id === boardId){
            state.activeBoard.isFavorite = true;
          }
        }
  },

  deleteBoard: (state) => {
    state.activeBoard= null;
  },

    updateBoard: (state) => {
        if(state.activeBoard){
          const index = state.boards.findIndex(board => board.id === state.activeBoard?.id);
          const favIndex = state.favBoards.findIndex(board => board.id === state.activeBoard?.id);
          if (index && favIndex !== -1) {
            state.boards[index] = state.activeBoard;
            state.boards[favIndex] = state.activeBoard;
          }
        }
    },

    updateBoardTitle: (state, action: PayloadAction<{boardId: string, title:string}>)=> {
      const {boardId, title} = action.payload;
      const board = state.boards.find((b)=> b.id === boardId);

      if(board) {
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
        state.activeBoard.imageUrls = [...state.activeBoard.imageUrls, ...action.payload];
      }
      state.isSaving = false;
    },
    setBoardBackground: (state, action: PayloadAction<string>) => {
      const backgroundUrl = action.payload;
      state.tempBackgroundUrl = backgroundUrl; // Mantenlo si necesitas esta tempUrl.
      state.backgroundUrl = backgroundUrl; // Asigna el backgroundUrl al estado principal.
  },

    addColumn: (state, action: PayloadAction<Column>) => {

      if (state.activeBoard) {
        state.activeBoard.lists.push(action.payload);
      }
    },

    setActiveColumn: (state, action: PayloadAction<Column>) => {
      state.activeColumn = action.payload;
    },

    reorderColumns: (state, action: PayloadAction <{fromIndex: number; toIndex: number}>) => {
        const {fromIndex, toIndex} = action.payload;

        if(state.activeBoard){
          state.activeBoard.lists = reorderArray(state.activeBoard.lists,fromIndex, toIndex)
        }
    },

    updateColumn : (state, action: PayloadAction<{id: Id; title:string}>) => {
      const {id, title} = action.payload;
      const list = state.activeBoard?.lists.find(list => list.id === id);

      if (list) {
        list.title = title;
      }
    },


    setTask: (state, action:PayloadAction<Task[]>) => {
      state.tasks = action.payload;
  },
    addTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload;
    
      // Encontrar el índice de la columna en la que quieres agregar la tarea
      const columnIndex = state.activeBoard?.lists.findIndex((col) => col.id === task.columnId);
    
      // Verificar si la columna existe
      if (columnIndex !== undefined && columnIndex !== -1 && state.activeBoard) {
        // Crear una copia de la columna seleccionada y agregar la tarea a su array de tasks
        const updatedColumn = {
          ...state.activeBoard.lists[columnIndex],
          tasks: [...state.activeBoard.lists[columnIndex].tasks, task], // Agregar la nueva tarea
        };
    
        // Actualizar el array de columnas con la columna modificada
        state.activeBoard.lists[columnIndex] = updatedColumn;
    
        // Si no usas un array global de tasks, ya no es necesario actualizar state.tasks
      }
    },

    setActiveTask: (state, action: PayloadAction<Task>) => {
      state.activeTask = action.payload;
    },

    deleteList:  (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
    
      if(state.activeBoard){
        state.activeBoard.lists = state.activeBoard.lists.filter((col)=> col.id !== columnId);
      }
    },

    deleteTask: (state, action: PayloadAction<string >) => {
        
      const taskId = action.payload;
      state.activeBoard?.lists.forEach((list) => {
        list.tasks = list.tasks.filter((task)=> task.id !== taskId);
      });
    },

    updateTask: (state, action:PayloadAction<{id: Id; content: string}>) => {
        const {id, content} = action.payload;
        const task = state.activeBoard?.lists.flatMap((list) => list.tasks).find((task) => task.id === id)
        if(task){
          task.content = content;
        }
    },

    setListsToActiveBoard: (state, action: PayloadAction <Board>) => {
        if (state.activeBoard) {
          state.activeBoard.lists = action.payload.lists;
        }
      }
  },


  extraReducers: (builder) => {
    builder
      .addCase(fetchLastBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastBoard.fulfilled, (state, action) => {
        state.activeBoard = action.payload; 
        // Agrega el nuevo tablero solo si no está en la lista
        if (!state.boards.some(board => board.id === action.payload.id)) {
          state.boards = [action.payload, ...state.boards]; // Agrega el tablero al principio
        }
      
        state.loading = false;
      })
      .addCase(fetchLastBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // .addCase(fetchAllBoards.fulfilled, (state, action) => {
      //   // state.boards = action.payload;
        
      //   // Aquí puedes verificar si hay un tablero activo y establecerlo si existe en el nuevo estado
      //   const activeBoardId = state.activeBoard?.id;
      //   const existingBoard = action.payload.find(board => board.id === activeBoardId);
      
      //   if (existingBoard) {
      //     state.activeBoard = existingBoard; // Sincroniza el tablero activo con el estado actualizado
      //   } else {
      //     state.activeBoard = null; // O cualquier lógica para manejar si no hay tablero activo
      //   }
      // })
      
}});

export const { savingNewBoard, setActiveBoard, setBoards, deleteBoard, setFavBoards, isFavorite, updateBoard, updateBoardTitle, setActiveColumn, setListsToActiveBoard, reorderColumns, updateColumn, setTask, addTask, setActiveTask, deleteTask, updateTask, addNewBoard, addColumn, deleteList, setSaving, setPhotos, setBoardBackground } = trellifySlice.actions;
export default trellifySlice.reducer;