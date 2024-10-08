import { logoutFirebase, signInWithEmailPassword, signInWithGoogle, signUpWithEmailPassword } from "../../../firebase/Providers";
import { AppDispatch } from "../Store";
import { checkingCredentials, login, logout } from "./authSlice";



interface UserCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface signInResult {
  ok: boolean;
  email: string | null;
  displayName: string | null;
  uid: string | null;
  errorMessage?: string;
  errorCode?: string;
}


export const checkingAuthentication = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());

    const result: signInResult = await signInWithGoogle();
    if (!result.ok) return dispatch(logout(result.errorMessage!));

    dispatch(login({
      email: result.email || '',
      uid: result.uid || '',
      displayName: result.displayName || '',
    }));
  };
};

export const startCreatingUserWithEmailPassword = ({ email, password, displayName }: UserCredentials) => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());

    try {
      const result: signInResult = await signUpWithEmailPassword(email, password, displayName);
      console.log('Result from signUpWithEmailPassword:', result); // Agrega este console.log
      if (!result.ok) {
        dispatch(logout(result.errorMessage));
        return;
      }

      dispatch(login({
        email: result.email || '',
        uid: result.uid || '',
        displayName: result.displayName || '',
      }));
    } catch (error) {
      console.error('Error in startCreatingUserWithEmailPassword:', error); // Agrega este console.error
      dispatch(logout('Error en el registro.'));
    }
  };
};


export const startLoginWithEmailPassword = ({ email, password }: UserCredentials) => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkingCredentials());

    const result: signInResult = await signInWithEmailPassword(email, password );
    console.log(result);

    if (!result.ok) return dispatch(logout(result.errorMessage!));
    dispatch(login({
      email: result.email || '',
      uid: result.uid || '',
      displayName: result.displayName || '',
    }));
  };
};

export const startLogout = () => {
  return async (dispatch: AppDispatch) => {
    await logoutFirebase();
    dispatch(logout());
  };
};
