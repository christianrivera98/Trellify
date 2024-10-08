import {  createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Column, Id, Task } from '../../pages/trellify/board/types/types';
import { arrayMove } from '@dnd-kit/sortable';


interface List {
  id: string;
  name: string;
  tasks: string[];
}

interface Board {
  id: string;
  title: string;
  backgroundUrl: string;
  lists: List[];
  imageUrls: string[]; 
}

export interface TrellifyState {
  isSaving: boolean;
  title: string;
  backgroundUrl: string;
  boards: Board[];
  columns: Column[];
  activeColumn: Column | null,
  tasks: Task[];
  activeTask: Task | null,
  active: Board | null;
  loading: boolean;
  error: string | null;
  imageUrls: string[];
  cloudinaryImages: string[];
}

const initialState: TrellifyState = {
  isSaving: false,
  title: '',
  backgroundUrl: '',
  boards: [],
  columns: [],
  activeColumn: null,
  tasks: [],
  activeTask:  null,
  active: null,
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
      state.boards.push(action.payload);
      state.isSaving = false;
    },
    setActiveBoard: (state, action: PayloadAction<Board>) => {
      state.active = action.payload;
      state.isSaving = false;
    },
    setSaving: (state) => {
      state.isSaving = true;
    },
    setPhotos: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = [...state.imageUrls, ...action.payload];
      if (state.active) {
        state.active.imageUrls = [...state.active.imageUrls, ...action.payload];
      }
      state.isSaving = false;
    },
    setBoardBackground: (state, action: PayloadAction<string>) => {
      if (state.active) {
        state.active.backgroundUrl = action.payload;
        state.isSaving = false;
      }
    },

    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },

    setActiveColumn: (state, action: PayloadAction<Column>) => {
      state.activeColumn = action.payload;
    },

    reorderColumns: (state, action: PayloadAction <{fromIndex: number; toIndex: number}>) => {
        const {fromIndex, toIndex} = action.payload;
        state.columns = arrayMove(state.columns, fromIndex, toIndex);
    },

    updateColumn : (state, action: PayloadAction<{id: Id; title:string}>) => {
      const {id, title} = action.payload;
      const column = state.columns.find(col => col.id === id);

      if (column) {
        column.title = title;
      }
    },

    setTask: (state, action:PayloadAction<Task[]>) => {
        state.tasks = action.payload;
    },  

    addTask: (state, action:PayloadAction<Task>) => {
        state.tasks.push(action.payload);
    },

    setActiveTask: (state, action: PayloadAction<Task>) => {
      state.activeTask = action.payload;
    },

    deleteList:  (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
    
      
      state.columns = state.columns.filter((col) => col.id !== columnId);
    
      state.boards.forEach(board => {
        board.lists = board.lists.map(list => ({
          ...list,
          tasks: list.tasks.filter(task => task !== columnId)
        }));
      });
    },

    deleteTask: (state, action: PayloadAction<string >) => {
        
      const taskId = action.payload;
      const columnId = action.payload;
        state.tasks = state.tasks.filter(task => task.id !== taskId);

        state.boards.forEach(board => {
          board.lists = board.lists.map(list => ({
            ...list,
            tasks: list.tasks.filter(task => task !== columnId)
          }));
        });
    },

    updateTask: (state, action:PayloadAction<{id: Id; content: string}>) => {
        const {id, content} = action.payload;
        const task = state.tasks.find(task => task.id === id);
        if(task){
          task.content = content;
        }
    }
  },
});

export const { savingNewBoard, setActiveBoard, setActiveColumn, reorderColumns, updateColumn, setTask, addTask, setActiveTask, deleteTask, updateTask, addNewBoard, addColumn, deleteList, setSaving, setPhotos, setBoardBackground } = trellifySlice.actions;
export default trellifySlice.reducer;
