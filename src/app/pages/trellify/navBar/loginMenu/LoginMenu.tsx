import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useSelector } from "react-redux";
import { startLogout } from "../../../../store/auth/Thunks";
import { menuItemsProps } from "../../board/types/types";
import {  useNavigate } from "react-router-dom";


export const LoginMenu = ({openMenu, menuToggle}: menuItemsProps) => {
    const isOpenLogin = openMenu === "loginButton";
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { displayName } = useSelector((state: RootState) => state.auth);

    
    const onLogout = () => {
      dispatch(startLogout()).then(() => {
        setTimeout(() => {
          navigate("/home");
        }, 100);
    })
  };
    
  return (
    <div className="relative inline-block text-left mx-5 md:mx-10">
      <button
        className="inline-flex justify-center w-max md:px-4 py-2 text-sm font-medium text-blue-500 rounded-md hover:bg-blue-400 hover:text-white focus:outline-none"
        onClick={() => menuToggle(isOpenLogin? "": "loginButton")}
      >
        {displayName}
        <img
          className="size-5"
          src="assets/iconsButtons/down-arrow.svg"
          alt="down-arrow"
        />
      </button>

      {isOpenLogin && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1">
            <a
              href="#"
              
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100"
            >
              Cerrar sesión
            </a>
           
            
          </div>
        </div>
      )}
    </div>
  )
}
