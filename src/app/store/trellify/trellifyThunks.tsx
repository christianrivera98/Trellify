import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { AppDispatch, RootState } from "../Store";
import { addColumn, addNewBoard, addTask, deleteBoard, isFavorite, savingNewBoard, setActiveBoard, setBoards, setFavBoards, setPhotos, setSaving, updateBoard, updateBoardTitle } from "./trellifySlice";
import { FirebaseDB } from "../../../firebase/FirebaseConfig";
import { fileUpload } from "../../../helpers/fileUpload";
import { generateId } from "../../../helpers/boardUtils";
import { Board, Column, FavBoard, Id, Task } from "../../pages/trellify/board/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const startNewBoard = (title: string, backgroundUrl: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
      dispatch(savingNewBoard());

      const { uid } = getState().auth;
      const boardCollectionRef = collection(FirebaseDB, `users/${uid}/boards`);
      const newDoc = doc(boardCollectionRef);

      const newBoard = {
          id: newDoc.id,
          title,
          // Aquí asumes que backgroundUrl puede ser un color o una URL de imagen.
          backgroundUrl: isValidColor(backgroundUrl) ? backgroundUrl : backgroundUrl, 
          lists: [],
          imageUrls: [],
          isFavorite: false
      };

      await setDoc(newDoc, newBoard);

      const userDocRef = doc(FirebaseDB, `users/${uid}`);
      await setDoc(userDocRef, { lastBoardId: newDoc.id }, { merge: true });

      dispatch(addNewBoard(newBoard));
      dispatch(setActiveBoard(newBoard));
  };
};

const isValidColor = (color: string) => {
  const s = new Option().style;
  s.color = color;
  return s.color !== ''; // Si el color es válido, no debería ser una cadena vacía.
};

export const startDeleteBoard = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { uid } = getState().auth;
    const {boards} = getState().trellify;
    const { activeBoard } = getState().trellify;

    const isBoard = boards.some(board => board.id === board.id);

    try{
      const boardRef = doc(FirebaseDB, `users/${uid}/boards/${activeBoard?.id}`);
      const boardFavRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${activeBoard?.id}`);

      if(isBoard) {
        await deleteDoc(boardRef);
        await deleteDoc(boardFavRef);

        const updateBoards = boards.filter(board => board.id !== activeBoard?.id);
        dispatch(setBoards(updateBoards));
        dispatch(setFavBoards(updateBoards));
        dispatch(deleteBoard());
      }
    }catch(error){
      console.error("No se pudo borrar el tablero.");
      
    }
  };
};

  export const toggleFavBoard = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const { activeBoard } = getState().trellify;
      const { favBoards } = getState().trellify;
      const { uid } = getState().auth;
  
      if (!activeBoard) {
        console.error("No hay un tablero activo en el momento el cual deba ser gestionado.");
        return;
      }
  
      // Verificar si el tablero ya está en favoritos
      const isBoardFavorited = favBoards.some(board => board.id === activeBoard.id);
  
      try {
        const boardRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${activeBoard.id}`);
  
        if (isBoardFavorited) {
          // Se elmina el tablero de favoritos en Firestore
          await deleteDoc(boardRef);
  
          // Se actualiza el estado eliminando el tablero de favBoards
          const updatedFavBoards = favBoards.filter(board => board.id !== activeBoard.id);
          dispatch(setFavBoards(updatedFavBoards));
  
        } else {
          // Se agrega el tablero a favoritos en Firestore
          await setDoc(boardRef, activeBoard, { merge: true });
  
          // Se actualiza el estado añadiendo el tablero a favBoards
          dispatch(setFavBoards([...favBoards, activeBoard]));
          dispatch(isFavorite({ isFavorite: true, boardId: activeBoard.id }))
        }
  
      } catch (error) {
        console.error("No se logró gestionar el tablero favorito:", error);
      }
    };
  };

export const fetchAllBoards = createAsyncThunk (
  "trellify/fetchAllBoards",
  async (uid: string, {dispatch}) => {
    try {
      const boardCollectionRef = collection(FirebaseDB, `users/${uid}/boards`);
      const boardsSnap = await getDocs(boardCollectionRef);

      const boards = boardsSnap.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
      })) as Board[];

      dispatch(setBoards(boards));

      return boards;
    }catch(error) {
      console.error('Error al obtener los tableros:', error);
      throw error;
    }
  }
); 
export const fetchAllBoardsFavs = createAsyncThunk (
  "trellify/fetchAllBoards",
  async (uid: string, {dispatch}) => {
    try {
      const boardCollectionRef = collection(FirebaseDB, `users/${uid}/favoritesboards`);
      const boardsSnap = await getDocs(boardCollectionRef);

      const boards = boardsSnap.docs.map(doc => ({
        id:doc.id,
        ...doc.data()
      })) as FavBoard[];

      dispatch(setFavBoards([...boards]));

      return boards;
    }catch(error) {
      console.error('Error al obtener los tableros:', error);
      throw error;
    }
  }
); 

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

            //Recupero las listas asociadas a su respectivo tablero

            const listsCollectionRef = collection(FirebaseDB,`users/${uid}/boards/${lastBoardId}/lists `)
            const listsSnap = await getDocs(listsCollectionRef);
            const lists = listsSnap.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title || 'Sin titulo',
              tasks: doc.data().tasks || [],
              boardId: doc.data().boardId || []
            }));

            //Se agregan las listas a boardData bajo la propiedad lists
            boardData.lists = lists;

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

export const savedActiveBoard = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {activeBoard} = getState().trellify;
    const {uid} = getState().auth;

    if (!activeBoard){
      console.error("No hay un tablero activo en el momento el cual deba ser guardado.");
      return;
    }

    const boardRef = doc(FirebaseDB, `users/${uid}/boards/${activeBoard.id}` )
    const boardFavRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${activeBoard.id}` )
    try{
      await setDoc (boardRef, activeBoard, {merge: true});
      await setDoc (boardFavRef, activeBoard, {merge: true});
      dispatch(updateBoard());
    } catch (error){
      console.error("No se logró guardar el tablero:", error);
      
    }
  };
};



export const startUpdatingBoardTitle = (boardId: string,newTitle: string) =>{
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { uid } = getState().auth;

    if (!uid) throw new Error ("El usuario no está autenticado");

    const boardRef = doc(FirebaseDB, `users/${uid}/boards/${boardId}`);
    const boardFavRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${boardId}` )

    try {
      await setDoc(boardRef, {title: newTitle}, {merge:true});
      await setDoc (boardFavRef, {title: newTitle}, {merge: true});

      dispatch(updateBoardTitle({boardId, title: newTitle}))
    } catch (error) {
      console.error("Error al intentar actualizar el título del tablero:", error);
      
    }

  };
};

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
      
      if (!activeBoard) {
        console.error('No active board selected');
        return; 
    }

      const columnToAdd: Column = {
        id: generateId(),
        title: `Nueva lista`,
        tasks: [],
        boardId: ""
      };
  
      // Despacha la acción para añadir la columna al estado
      dispatch(addColumn(columnToAdd));

      const boardRef = doc(FirebaseDB, `users/${state.auth.uid}/boards/${activeBoard.id}`);
      const updateLists = [...activeBoard.lists , columnToAdd];

      try {
        await setDoc(boardRef, {lists: updateLists}, {merge:true}); 
      }catch(error){
        console.error('Error al actualizar Firestore:', error);
        
      }
    };
  };

export const startNewTask = (columnId: Id) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { activeBoard } = state.trellify;

    if (!activeBoard) {
      console.error('No active board selected');
      return;
    }

    // Encontrar el índice de la columna en el array de lists
    const columnIndex = activeBoard.lists.findIndex((col) => col.id === columnId);

    if (columnIndex === -1) {
      console.error('Column not found');
      return;
    }

    const taskToAdd: Task = {
      id: generateId(),
      columnId,
      content: `Tarea ${state.trellify.tasks.length + 1}`,
    };

    // Despacha la acción para agregar la tarea
    dispatch(addTask(taskToAdd));

    // Crear una copia del array de listas
    const updatedLists = [...activeBoard.lists];

    // Asegúrate de que también estás haciendo una copia del array de tasks de la columna
    const updatedColumn = {
      ...updatedLists[columnIndex],
      tasks: [...updatedLists[columnIndex].tasks, taskToAdd],  // Crea una nueva copia de tasks y agrega la nueva tarea
    };

    // Reemplazar la columna modificada en la copia del array de listas
    updatedLists[columnIndex] = updatedColumn;

    // Aquí podrías actualizar Firestore si es necesario

    // Si deseas guardar los cambios en Firestore:
    const boardRef = doc(FirebaseDB, `users/${state.auth.uid}/boards/${activeBoard.id}`);
    try {
      await setDoc(boardRef, { lists: updatedLists }, { merge: true });
    } catch (error) {
      console.error('Error al actualizar Firestore:', error);
    }
  };
};


