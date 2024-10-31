import { Link } from "react-router-dom";
import { WorkSpaceItem } from "./menuItems/WorkSpaceItem";
import { MarkedBoards } from "./menuItems/MarkedBoards";
import { LoginMenu } from "./loginMenu/LoginMenu";
import CreateButton from "./menuItems/CreateButton";
import { useState } from "react";

export const NavBarMenu = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  const menuToggle = (menu: string) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
    if (openMenu) {
      setPlusMenuOpen(false);
    }
  };

  const togglePlusMenu = () => {
    setPlusMenuOpen((prev) => !prev);
    setOpenMenu(null);
  };

  return (
    <div className="top-0 h-16 w-auto lg:w-full bg-slate-100 shadow-sm border-b flex items-center  ">
      <div className="flex gap-2 md:gap-5  w-full  md:mx-10 text-3xl tracking-wide items-center">
        <div className="mx-5 md:ml-0 md:max-w-screen-2xl  text-xl md:text-3xl font-extrabold tracking-wide ">
          <Link to="dashBoard" className="flex items-center">
            <img
              src="./logo.svg"
              alt="logo"
              className="h-6 w-6 md:h-7 md:w-7 mr-1"
            />
            Trellify
          </Link>
        </div>
        <button
          onClick={togglePlusMenu}
          className=" flex justify-center items-center bg-slate-100 hover:bg-slate-200 w-20 h-7 rounded  text-base  font-medium text-blue-500 md:static lg:hidden"
        >
          Más
          <img
            src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896371/findy/down-arrow_zypvli.svg"
            alt="menuMas"
            className="h-6 w-6"
          />
        </button>
        <div
          className={`lg:flex ${
            plusMenuOpen ? "block" : "hidden"
          } bg-slate-100 border-2 rounded-lg border-slate-300 md:border-none w-auto p-2 md:gap-4 flex  flex-col md:flex-row md:flex-none absolute  lg:static mt-40 md:mt-0 ml-20 md:ml-0 md:w-auto`}
        >
          <WorkSpaceItem openMenu={openMenu} menuToggle={menuToggle} />
          <MarkedBoards openMenu={openMenu} menuToggle={menuToggle} />
        </div>
        <CreateButton openMenu={openMenu} menuToggle={menuToggle} />
      </div>

      <div>
        <LoginMenu openMenu={openMenu} menuToggle={menuToggle} />
      </div>
    </div>
  );
};
