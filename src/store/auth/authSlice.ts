//Tipos para el estado inicial

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: 'checking' | boolean;
  displayName: string | null;
  email: string | null;
  password: string | null;
  errorMessage: string | null;
  uid:string | null;
}

//Definiendo el estado inicial

const initialState: AuthState = {
  isAuthenticated: false,
  displayName: null,
  email: null,
  password: null,
  errorMessage: null,
  uid: null
};

// Slices:

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; uid: string; displayName:string } | undefined>
    ) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.uid = action.payload.uid
        state.displayName = action.payload.displayName;
        state.email = action.payload.email;
        state.errorMessage = null;
      } else {
        // Maneja el caso en el que el payload es undefined
        state.errorMessage = 'No se cargo la información del usuario';
      }
    },

    logout: (state, action: PayloadAction<string | undefined>) =>{
        state.isAuthenticated = false;
        state.email= null;
        state.password=null;
        state.displayName=null;
        state.errorMessage = action.payload || null;
    },

    loginWithuserDemo: (state, action: PayloadAction<{ email: string; uid: string; displayName:string } | undefined>) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.uid = "uidDemo"
        state.displayName = "Eres un demo";
        state.email = "demo@correo.com";
        state.errorMessage = null;
      } else {
        // Maneja el caso en el que el payload es undefined
        state.errorMessage = 'No se cargo la información del usuario';
      }
    },

    checkingCredentials: (state) => {
         state.isAuthenticated = 'checking'
    },


  },
});

export const {login, logout, loginWithuserDemo, checkingCredentials} = authSlice.actions;
export default authSlice.reducer;