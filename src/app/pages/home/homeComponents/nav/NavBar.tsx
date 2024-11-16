import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useMemo } from "react";
import {
  checkingAuthentication,
  startLoginWithDemo,
} from "../../../../store/auth/Thunks";
import { FiLogIn, FiUser } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const NavBar = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const isAuthenticating = useMemo(
    () => isAuthenticated === "checking",
    [isAuthenticated]
  );

  const onSubmitDemo = () => {
    if (!isAuthenticating) {
      dispatch(checkingAuthentication());
      dispatch(startLoginWithDemo());
    }
  };

  return (
    <nav className="fixed z-20 top-0 w-full px-3 md:px-10  py-4 bg-[#00013A] shadow-lg">
      <div className="flex justify-between items-center md:max-w-screen mx-auto">
        {/* Logo y Título */}
        <div className="flex items-center text-white">
          <img
            src="./logo.svg"
            alt="logo"
            className="h-8 w-8  mr-1 md:mr-3 md:scale-150"
          />
          <span className="text-2xl lg:text-4xl font-bold tracking-wide">
            Trellify
          </span>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          <Link to="/sign-in">
            <button
              aria-label="Login"
              className="flex items-center h-10 text-sm md:text-base font-medium px-4 py-2 bg-white text-[#1e40af] rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-[#1e3a8a] hover:text-white"
            >
              <FiLogIn className="mr-2" />
              Login
            </button>
          </Link>

          <button
            type="button"
            aria-label="Demo"
            disabled={isAuthenticating}
            onClick={onSubmitDemo}
            className={`flex items-center h-10 px-4 py-2 text-sm md:text-base rounded-full transition duration-300 ease-in-out transform ${
              isAuthenticating
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#1e40af] text-white hover:scale-105 hover:bg-[#1e3a8a] shadow-md"
            }`}
          >
            {isAuthenticating ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : (
              <FiUser className=" mr-2" />
            )}
            {isAuthenticating ? "Loading..." : "Demo"}
          </button>
        </div>
      </div>
    </nav>
  );
};
