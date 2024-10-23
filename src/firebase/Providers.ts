import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { firebaseAuth } from "./FirebaseConfig";

const googleProvider = new GoogleAuthProvider();

interface signInResult {
    ok: boolean;
    email: string | null;
    displayName: string | null;
    uid: string | null;
    errorMessage?: string;
    errorCode?: string;
}

interface signUpResult{
    ok: boolean;
    email: string | null;
    displayName: string | null;
    uid: string | null;
    errorMessage?: string;
    errorCode?: string;
    password: string| null;
}

// Inicio de sesion con Google

export const signInWithGoogle = async (): Promise<signInResult> => {
    try{
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const {email, displayName, uid} = result.user;

        return{
            ok:true,
            email,
            displayName ,
            uid,
        }
    }

    catch(error:any){
        const errorMessage  = error.message;
        const errorCode = error.code;

        return{
            ok: false,
            email:null,
            displayName:null ,
            uid:null,
            errorMessage,
            errorCode,
        };
    } 

    
};

// Provedor de crear cuenta con Correo y Contraseña

export const signUpWithEmailPassword = async (email:string, password : string, displayName: string | undefined): Promise<signUpResult | any> => {
    try{
        const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const {uid, email:userEmail} = result.user;

            // Verificamos que si haya alguien registrado o que firebaseAuth.currentUser no sea null.

        if (firebaseAuth.currentUser) {
            await updateProfile(firebaseAuth.currentUser, { displayName });
          }

        return{
            ok:true,
            email : userEmail,
            displayName,
            uid
        }
    }
    catch(error:any){
        const errorMessage  = error.message;
        const errorCode = error.code;

        return{
            ok: false,
            email:null,
            displayName:null ,
            uid:null,
            password: null,
            errorMessage,
            errorCode,
        };
    }
}

export const signInWithEmailPassword = async (email:string, password:string) : Promise<signInResult | any> => {
    try {
        const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const {uid, displayName} = result.user

        return{
            ok: true,
            uid,
            displayName
        }
    } catch (error:any) {

        const errorMessage  = error.message;
        const errorCode = error.code;

        return{
            ok: false,
            email:null,
            displayName:null ,
            uid:null,
            password: null,
            errorMessage,
            errorCode,
        };
    }
}

export const logoutFirebase = async() => {
    return await firebaseAuth.signOut();
}

export const signInAsDemo = async (): Promise<signInResult> => {
    const demoEmail = "demo@correo.com"; 
    const demoPassword = "contraseñaDemo";
    try {
        const result = await signInWithEmailAndPassword(firebaseAuth, demoEmail, demoPassword);
        const { uid, displayName } = result.user;
  
        return {
            ok: true,
            email: demoEmail,
            displayName: displayName || "Demo User",
            uid,
        };
    } catch (error: any) {
        const errorMessage = error.message;
        const errorCode = error.code;
  
        return {
            ok: false,
            email: null,
            displayName: null,
            uid: null,
            errorMessage,
            errorCode,
        };
    }
  };