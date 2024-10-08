import { useSelector } from "react-redux";
import { NavBarMenu } from "./navBar/NavBarMenu";
import { RootState } from "../../store/Store";
import { Board } from "./board/Board";

export const Dashboard: React.FC = () => {
  const boards = useSelector((state: RootState) => state.trellify.boards);

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBarMenu />
      <div className="overflow-hidden flex-1">
        {boards.map((board) => (
          <div
            key={board.id}
            className="bg-cover h-full w-full bg-center p-2 text-white flex flex-col"
            style={{ backgroundImage: `url(${board.backgroundUrl})`, backgroundSize: 'cover' }}
          >
            <div className="flex flex-col flex-grow">
              <h3 className="text-3xl bg-opacity-70 bg-slate-400 h-12 w-64 rounded-xl flex justify-center items-center mx-10 my-5">
                {board.title}
              </h3>
              <div className="flex-grow overflow-hidden flex">
                <div className="flex overflow-x-auto">
                  <Board />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
