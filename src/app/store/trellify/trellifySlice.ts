import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { savingNewBoard, setActiveBoard, addNewBoard, setSaving, setPhotos, setBoardBackground } = trellifySlice.actions;
export default trellifySlice.reducer;
