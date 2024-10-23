import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { SignInPage } from "../pages/auth/signIn/SignInPage";
import { SignUpPage } from "../pages/auth/signUp/SignUpPage";
import { Dashboard } from "../pages/trellify/Dashboard";
import { Spinner } from "../../ui/components/Spinner";
import { useCheckAuth } from "../../hooks/useCheckAuth";
import { useDispatch } from "react-redux"; // Importamos useDispatch
// import { useEffect } from "react";
// import { resetActiveBoard } from "../store/trellify/trellifySlice";
// Importa tu acción para reiniciar el estado

const AppRouter = () => {
  const { isAuthenticated } = useCheckAuth();
  const dispatch = useDispatch();
  const location = useLocation(); // Hook para obtener la ruta actual

  // useEffect para reiniciar el estado de activeBoard cuando la ruta cambie
  // useEffect(() => {
  //   dispatch(resetActiveBoard()); // Reinicia el estado de activeBoard
  // }, [location.pathname, dispatch]); // Ejecuta cada vez que la ruta cambie

  if (isAuthenticated === "checking") {
    return <Spinner />;
  }

  return (
    <div>
      <Routes>
        {isAuthenticated === true ? (
          <>
            {/* Rutas protegidas solo para usuarios autenticados */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Redirige cualquier otra ruta autenticada a Dashboard */}
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            {/* Rutas de acceso público */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            {/* Redirige cualquier ruta no autenticada a la página principal */}
            <Route path="/*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default AppRouter;
