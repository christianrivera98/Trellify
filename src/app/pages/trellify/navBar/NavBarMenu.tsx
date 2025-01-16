import { Link } from "react-router-dom";
import { WorkSpaceItem } from "./menuItems/WorkSpaceItem";
import { MarkedBoards } from "./menuItems/MarkedBoards";
import { LoginMenu } from "./loginMenu/LoginMenu";
import CreateButton from "./menuItems/CreateButton";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="fixed top-0 h-16 w-auto lg:w-full bg-gradient-to-r from-blue-950 to-slate-900 shadow-lg border-b border-slate-800 flex items-center"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex gap-2 md:gap-5 w-full md:mx-10 text-3xl tracking-wide items-center">
        
        <div className="mx-5 md:ml-0 md:max-w-screen-2xl text-xl md:text-3xl font-extrabold tracking-wide">
          <Link
            to="dashBoard"
            className="flex items-center text-white hover:text-blue-400 transition-all duration-300"
          >
            <img
              src="./logo.svg"
              alt="logo"
              className="h-6 w-6 md:h-7 md:w-7 mr-1 drop-shadow-md"
            />
            Trellify
          </Link>
        </div>

        <button
          onClick={togglePlusMenu}
          className="flex justify-center items-center bg-slate-100 hover:bg-slate-200 w-20 h-7 rounded  text-base  font-medium tracking-wide text-blue-500 md:static lg:hidden"
        >
          Más
          <img
            src="assets/iconsButtons/down-arrow.svg"
            alt="menuMas"
            className="h-4 w-4 ml-1"
          />
        </button>

        <div
          className={`lg:flex ${
            plusMenuOpen ? "block" : "hidden"
          }   rounded-lg md:border-none w-auto p-2 md:gap-4 flex flex-col md:flex-row md:flex-none absolute lg:static mt-40 md:mt-0 ml-20 md:ml-0 md:w-auto text-white`}
        >
          <WorkSpaceItem openMenu={openMenu} menuToggle={menuToggle} />
          <MarkedBoards openMenu={openMenu} menuToggle={menuToggle} />
        </div>

        <CreateButton openMenu={openMenu} menuToggle={menuToggle} />
      </div>

      <div>
        <LoginMenu openMenu={openMenu} menuToggle={menuToggle} />
      </div>
    </motion.div>
  );
};
