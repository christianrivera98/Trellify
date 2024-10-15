import { useSelector } from "react-redux";
import { NavBarMenu } from "./navBar/NavBarMenu";
import { AppDispatch, RootState } from "../../store/Store";
import { Board } from "./board/Board";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchLastBoard } from "../../store/trellify/trellifyThunks";

export const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.trellify.boards);
  const activeBoard = useSelector((state: RootState) => state.trellify.activeBoard);
  const {uid} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if(uid) {
      dispatch(fetchLastBoard(uid))
    }
  }, [uid, dispatch])


  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBarMenu />
      <div className="overflow-hidden flex-1">
        {boards.map((activeBoard) => (
          <div
            key={activeBoard.id}
            className="bg-cover h-full w-full bg-center p-2 text-white flex flex-col"
            style={{ backgroundImage: `url(${activeBoard.backgroundUrl})`, backgroundSize: 'cover' }}
          >
            <div className="flex flex-col flex-grow">
              <h3 className="text-3xl bg-opacity-70 bg-slate-400 h-12 w-64 rounded-xl flex justify-center items-center mx-10 my-5">
                {activeBoard.title}
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
