import { collection, doc, setDoc } from "firebase/firestore/lite";
import { AppDispatch, RootState } from "../Store";
import { addNewBoard, savingNewBoard, setActiveBoard, setPhotos, setSaving } from "./trellifySlice";
import { FirebaseDB } from "../../../firebase/FirebaseConfig";
import { fileUpload } from "../../../helpers/fileUpload";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface Board {
    id: string;
    title: string;
    backgroundUrl: string;
    lists: List[];
    imageUrls: string[];
  }

  interface List {
    id: string;
    name: string;
    tasks: string[];
  }

  export const startNewBoard = (title: string, backgroundUrl: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch(savingNewBoard());
  
      const { uid } = getState().auth;
  
      const newBoard: Board = {
        id: '',
        title,
        backgroundUrl,
        lists: [
          {
            id: 'initial-list',
            name: 'Lista de ejemplo',
            tasks: []
          }
        ],
        imageUrls: []
      };
  
      const newDoc = doc(collection(FirebaseDB, `${uid}/boards/lists`));
      await setDoc(newDoc, newBoard);
  
      newBoard.id = newDoc.id;
  
      dispatch(addNewBoard(newBoard));
      dispatch(setActiveBoard(newBoard));
    };
  };
  
  

  export const startUploadingFiles = (files: File[] = []) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch(setSaving());
  
      // Sube los archivos a Cloudinary y obtiene las URLs
      const fileUploadPromises = files.map(file => fileUpload(file));
      const photosUrls = await Promise.all(fileUploadPromises);
      const validPhotosUrls = photosUrls.filter((url): url is string => url !== null);
  
      // Actualiza el estado de Redux con las nuevas imágenes subidas
      if (validPhotosUrls.length > 0) {
        dispatch(setPhotos(validPhotosUrls));
      }
    };
  };
  
  // export const startNewColumn = createAsyncThunk(
  //   'columns/createNewColumn',
  //   async (_, { dispatch, getState }) => {
  //     const state = getState();
  //     const columns = state.columns;  // Obtén el estado de las columnas actual
  
  //     const columnToAdd: Column = {
  //       id: generateId(),
  //       title: `Lista ${columns.length + 1}`,
  //     };
  
  //     // Despacha la acción para añadir la columna al estado
  //     dispatch(addColumnToState(columnToAdd));
  //   }
  // );