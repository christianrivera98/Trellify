import { Link } from "react-router-dom";
import { WorkSpaceItem } from "./menuItems/WorkSpaceItem";
import { MarkedBoards } from "./menuItems/MarkedBoards";
import { LoginMenu } from "./loginMenu/LoginMenu";
import CreateButton from "./menuItems/CreateButton";
import { useState } from "react";

export const NavBarMenu = () => {

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuToggle = (menu: string) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  }
  return (
    <div className="top-0 h-16 w-full bg-white shadow-sm border-b flex items-center  ">
      <div className="flex gap-5  w-full  mx-10 text-3xl tracking-wide items-center">
        <div className="md:max-w-screen-2xl  text-3xl font-extrabold tracking-wide ">
          <Link to="dashBoard" className="flex items-center">
            <img src="./logo.svg" alt="logo" className="h-7 w-7 mr-2" />
            Trellify
          </Link>
        </div>
        <WorkSpaceItem  openMenu={openMenu} menuToggle = {menuToggle}/>
        <MarkedBoards openMenu={openMenu} menuToggle = {menuToggle} />
        <CreateButton openMenu={openMenu} menuToggle = {menuToggle} />
      </div>
      <div>
        <LoginMenu openMenu={openMenu} menuToggle = {menuToggle}/>
      </div>
    </div>
  );
};
