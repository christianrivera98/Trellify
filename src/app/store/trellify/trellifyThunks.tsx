import { collection, doc, getDoc, setDoc } from "firebase/firestore/lite";
import { AppDispatch, RootState } from "../Store";
import { addColumn, addNewBoard, addTask, savingNewBoard, setActiveBoard, setPhotos, setSaving } from "./trellifySlice";
import { FirebaseDB } from "../../../firebase/FirebaseConfig";
import { fileUpload } from "../../../helpers/fileUpload";
import { generateId } from "../../../helpers/boardUtils";
import { Board, Column, Id, Task } from "../../pages/trellify/board/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";



  export const startNewBoard = (title: string, backgroundUrl: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch(savingNewBoard());
  
      const { uid } = getState().auth;
      const boardCollectionRef = collection(FirebaseDB, `users/${uid}/boards`);
      const newDoc = doc(boardCollectionRef)
      const newBoard = {
        id: newDoc.id,
        title,
        backgroundUrl,
        lists: [],
        imageUrls: []
      };
  
      await setDoc(newDoc, newBoard);
  
      const userDocRef = doc(FirebaseDB,`users/${uid}` );
      await setDoc(userDocRef, {lastBoardId: newDoc.id}, {merge: true});
  
      dispatch(addNewBoard(newBoard));
      dispatch(setActiveBoard(newBoard));
    };
  };

  export const fetchBoardById = (boardId: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {

      const { uid } = getState().auth;

    try {
      const boardDocRef = doc(FirebaseDB, `users/${uid}/boards/${boardId}`);
      const boardDocSnap = await getDoc(boardDocRef);

      if(boardDocSnap.exists()){
        const boardData: Board = boardDocSnap.data() as Board;
        dispatch(setActiveBoard(boardData));
        return boardData;
      }

      throw new Error("Tablero no encontrado.")
    } catch (error){
      console.error("Error al obtener el tablero:", error);
      throw error;
    }
  };
}

export const fetchLastBoard = createAsyncThunk(
  "trellify/fetchLastBoard",
  async (uid: string, { dispatch }) => {
    try {
      const userDocRef = doc(FirebaseDB, `users/${uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const lastBoardId = userDocSnap.data().lastBoardId;

        if (lastBoardId) {
          const boardDocRef = doc(FirebaseDB, `users/${uid}/boards/${lastBoardId}`);
          const boardDocSnap = await getDoc(boardDocRef);

          if (boardDocSnap.exists()) {
            const boardData: Board = boardDocSnap.data() as Board;
            dispatch(setActiveBoard(boardData));
            // Devuelve el tablero recuperado
            return boardData;
          }
        }
      }

      throw new Error("No se encontró el último tablero.");
    } catch (error) {
      console.error("Error al obtener el último tablero:", error);
      throw error;
    }
  }
);

  export const startUploadingFiles = (files: File[] = []) => {
    return async (dispatch: AppDispatch) => {
      dispatch(setSaving());
  
    //  Sube los archivos a Cloudinary y obtiene las URLs
    const fileUploadPromises = files.map(file => fileUpload(file));
      const photosUrls = await Promise.all(fileUploadPromises);
      const validPhotosUrls = photosUrls.filter((url): url is string => url !== null);
  
     // Actualiza el estado de Redux con las nuevas imágenes subidas
      if (validPhotosUrls.length > 0) {
        dispatch(setPhotos(validPhotosUrls));
      }
    };
  };
  
  export const startNewColumn = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const state = getState();
      const {activeBoard} = state.trellify;
      const columns = state.trellify.columns;  // Obtén el estado de las columnas actual
      
      if (!activeBoard) {
        console.error('No active board selected');
        return; 
    }

      const columnToAdd: Column = {
        id: generateId(),
        title: `Lista ${columns.length + 1}`,
        tasks: []
      };
  
      // Despacha la acción para añadir la columna al estado
      dispatch(addColumn(columnToAdd));

      const boardRef = doc(FirebaseDB, `${state.auth.uid}/boards/lists/${activeBoard?.id}`);
      const updateLists = [...activeBoard.lists , columnToAdd];
      await setDoc(boardRef, {lists: updateLists}, {merge:true}); 
    };
  };

  export const startNewTask = (columnId: Id) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const state = getState();
      const {activeBoard} = state.trellify;
      
      

      if (!activeBoard) {
        console.error('No active board selected');
        return; 
    }

    const columnIndex = activeBoard?.lists.findIndex((col) => col.id === columnId);
   
      if (columnId === -1) return;

      const taskToAdd: Task = {
        id: generateId(),
        columnId,
        content: `Tarea ${state.trellify.tasks.length + 1}`,
      };

      dispatch(addTask(taskToAdd));

      const updateLists = [...activeBoard.lists];
      updateLists[columnIndex].tasks.push(taskToAdd)
    };
  };