import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store/Store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../firebase/FirebaseConfig";
import { login, logout } from "../app/store/auth/authSlice";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) return dispatch(logout());
      const uid = user.uid;
      const email = user.email || "";
      const displayName = user.displayName || "";
      dispatch(login({ uid, email, displayName }));
    });
  }, []);

  return{
    isAuthenticated
  }
};
