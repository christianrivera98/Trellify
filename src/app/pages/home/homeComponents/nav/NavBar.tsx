import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { checkingAuthentication, startLoginWithDemo } from "../../../../store/auth/Thunks"; // Asegúrate de importar el nuevo thunk

export const NavBar = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const isAuthenticating = useMemo(() => isAuthenticated === 'checking', [isAuthenticated]);

    const onSubmitDemo = () => {
        dispatch(checkingAuthentication());
        dispatch(startLoginWithDemo()); 
    };

    return (
        <nav className="font-sans top-0 h-14 w-full px-4 bg-slate-100 shadow-sm fixed border-b flex items-center justify-between">
            <div className="md:max-w-screen-2xl w-full mx-auto text-3xl font-extrabold tracking-wide">
                <div className="flex items-center">
                    <img src="./logo.svg" alt="logo" className="h-7 w-7 mr-2" />
                    Trellify
                </div>
            </div>
            <div className="flex mx-auto text-base font-medium px-px m-4 space-x-4">
                <button className="focus:ring focus:outline-none bg-white w-20 rounded-lg border-2 border-slate-400 transition ease-in-out delay-150  hover:scale-95 duration-300">
                    <Link to={"/sign-in"}>
                        Login
                    </Link>
                </button>
                <button 
                    type="button" 
                    disabled={isAuthenticating} 
                    onClick={onSubmitDemo} 
                    className="focus:ring focus:outline-none bg-black rounded-lg h-10 text-white px-px w-40 transition ease-in-out delay-150  hover:scale-95 duration-300">
                    Demo
                </button>
            </div>
        </nav>
    );
}
