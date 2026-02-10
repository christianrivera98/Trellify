import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore/lite";
import { AppDispatch, RootState } from "../Store";
import { addColumn, addNewBoard, addTask, deleteBoard, isFavorite, savingNewBoard, setActiveBoard, setBoards, setFavBoards, setPhotos, setSaving, updateBoard, updateBoardTitle } from "./trellifySlice";
import { FirebaseDB } from "../../firebase/FirebaseConfig";
import { fileUpload } from "../../helpers/fileUpload";
import { generateId } from "../../helpers/boardUtils";
import { Board, Column, Id, Task } from "../../features/trellify/board/types/types";
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
          backgroundUrl,
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
    }catch(_error){
      // Error al borrar el tablero
    }
  };
};

  export const toggleFavBoard = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const { activeBoard } = getState().trellify;
      const { favBoards } = getState().trellify;
      const { uid } = getState().auth;
  
      if (!activeBoard) return;
  
      const isBoardFavorited = favBoards.some(board => board.id === activeBoard.id);
  
      try {
        const boardRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${activeBoard.id}`);
  
        if (isBoardFavorited) {
          await deleteDoc(boardRef);
  
          const updatedFavBoards = favBoards.filter(board => board.id !== activeBoard.id);
          dispatch(setFavBoards(updatedFavBoards));
  
        } else {
          await setDoc(boardRef, activeBoard, { merge: true });
  
          dispatch(setFavBoards([...favBoards, activeBoard]));
          dispatch(isFavorite({ isFavorite: true, boardId: activeBoard.id }))
        }
  
      } catch (_error) {
        // Error al gestionar tablero favorito
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
      })) as Board[];

      dispatch(setFavBoards([...boards]));

      return boards;
    }catch(error) {
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


            const listsCollectionRef = collection(FirebaseDB,`users/${uid}/boards/${lastBoardId}/lists `)
            const listsSnap = await getDocs(listsCollectionRef);
            const lists = listsSnap.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title || 'Sin titulo',
              tasks: doc.data().tasks || [],
              boardId: doc.data().boardId || []
            }));

            boardData.lists = lists;

            dispatch(setActiveBoard(boardData));
            return boardData;
          }
        }
      }

      throw new Error("No se encontró el último tablero.");
    } catch (error) {
      throw error;
    }
  }
);

export const savedActiveBoard = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {activeBoard} = getState().trellify;
    const {uid} = getState().auth;

    if (!activeBoard) return;

    const boardRef = doc(FirebaseDB, `users/${uid}/boards/${activeBoard.id}` )
    const boardFavRef = doc(FirebaseDB, `users/${uid}/favoritesboards/${activeBoard.id}` )
    try{
      await setDoc (boardRef, activeBoard, {merge: true});
      await setDoc (boardFavRef, activeBoard, {merge: true});
      dispatch(updateBoard());
    } catch (_error){
      // Error al guardar el tablero
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
    } catch (_error) {
      // Error al actualizar titulo
    }

  };
};

  export const startUploadingFiles = (files: File[] = []) => {
    return async (dispatch: AppDispatch) => {
      dispatch(setSaving());
  
    const fileUploadPromises = files.map(file => fileUpload(file));
      const photosUrls = await Promise.all(fileUploadPromises);
      const validPhotosUrls = photosUrls.filter((url): url is string => url !== null);
  
      if (validPhotosUrls.length > 0) {
        dispatch(setPhotos(validPhotosUrls));
      }
    };
  };
  
  export const startNewColumn = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const state = getState();
      const {activeBoard} = state.trellify;
      
      if (!activeBoard) return;

      const columnToAdd: Column = {
        id: generateId(),
        title: `Nueva lista`,
        tasks: [],
        boardId: ""
      };
  
      dispatch(addColumn(columnToAdd));

      const boardRef = doc(FirebaseDB, `users/${state.auth.uid}/boards/${activeBoard.id}`);
      const updateLists = [...activeBoard.lists , columnToAdd];

      try {
        await setDoc(boardRef, {lists: updateLists}, {merge:true}); 
      }catch(_error){
        // Error al actualizar Firestore
      }
    };
  };

export const startNewTask = (columnId: Id) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { activeBoard } = state.trellify;

    if (!activeBoard) return;

    const columnIndex = activeBoard.lists.findIndex((col) => col.id === columnId);
    if (columnIndex === -1) return;

    const taskToAdd: Task = {
      id: generateId(),
      columnId,
      title: `Tarea nueva`,
      description: ''
    };

    dispatch(addTask(taskToAdd));

    const updatedLists = [...activeBoard.lists];

    const updatedColumn = {
      ...updatedLists[columnIndex],
      tasks: [...updatedLists[columnIndex].tasks, taskToAdd], 
    };
    // Reemplazar la columna modificada en la copia del array de listas
    updatedLists[columnIndex] = updatedColumn;
    const boardRef = doc(FirebaseDB, `users/${state.auth.uid}/boards/${activeBoard.id}`);
    try {
      await setDoc(boardRef, { lists: updatedLists }, { merge: true });
    } catch (_error) {
      // Error al actualizar Firestore
    }
  };
};


