import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/Store";
import { useEffect, useMemo, useState } from "react";
import {
  checkingAuthentication,
  startLoginWithDemo,
} from "../../../../store/auth/Thunks";
import { getPositionValues } from "../../../../../ui/motions/positionValues";
import { IoIosArrowDown } from "react-icons/io";

export const Hero = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { top, left } = getPositionValues();
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

  const letterAnimation = {
    hidden: { opacity: 0, y: -20, scale: 3 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const [initialPosition, setInitialPosition] = useState({
    x: "-50%",
    y: "-50%",
    position: "absolute" as const,
    top: "50%",
    left: "50%",
  });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setInitialPosition({
        x: "-30%",
        y: "-30%",
        position: "absolute",
        top: "40%",
        left: "40%",
      });
    } else {
      setInitialPosition({
        x: "-50%",
        y: "-50%",
        position: "absolute",
        top: "50%",
        left: "50%",
      });
    }
  }, []);

  return (
    <>
      <section className="flex flex-col lg:flex-row h-screen p-8 lg:p-16 space-y-8 lg:space-y-0 lg:space-x-10 justify-center items-center">
        <div className="mt-20 md:mt-0 lg:mt-20">
          <motion.div
            className="flex justify-center mt-10 gap-4 items-center text-white"
            initial={{
              ...initialPosition,
              opacity: 1,
              scale: 0.8,
            }}
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              position: "absolute",
              top: top,
              left: left,
            }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 2 }}
          >
            <motion.img
              src="./logo.svg"
              alt="logo"
              className="h-10 w-10 md:h-14 md:w-14 lg:h-20 lg:w-20 mr-1 md:mr-3 md:scale-150"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 2, 1.5] }}
              transition={{ duration: 1, delay: 0.1 }}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.15, delayChildren: 0.25 }}
            >
              {"Trellify".split("").map((letter, index) => (
                <motion.span
                  className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-wide"
                  key={index}
                  variants={letterAnimation}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="flex flex-col items-center text-center lg:text-left lg:items-start max-w-2xl lg:w-auto space-y-8 mt-10 bg-slate-900 bg-opacity-60 rounded-lg p-6 shadow-lg"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 3.2, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-3xl xl:text-5xl leading-tight font-semibold text-white italic drop-shadow-lg">
              Organiza tu trabajo de manera eficiente con{" "}
              <span className="text-blue-500">Trellify</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl font-normal text-gray-200 mt-4 drop-shadow-md">
              Una herramienta intuitiva para gestionar tareas, colaborar con tu
              equipo y alcanzar tus objetivos más rápido.
            </p>
            <button
              onClick={onSubmitDemo}
              className="mt-6 px-6 py-3 bg-blue-950 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Empezar ahora
            </button>
          </motion.div>
        </div>

        <motion.div
          className="w-full sm:w-full lg:w-screen xl:w-1/2 z-10"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 3.8, ease: "easeOut" }}
        >
          <img
            className="rounded-xl shadow-lg hidden lg:block"
            src="assets/image/teamWork_optimized.webp"
            alt="teamWork"
          />
        </motion.div>
      </section>

      {/* Flecha que indica más contenido */}
      <motion.div
        className="absolute bottom-10 w-full flex justify-center items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 4 }}
      >
        <IoIosArrowDown className="text-white text-4xl animate-bounce" />
      </motion.div>
    </>
  );
};
