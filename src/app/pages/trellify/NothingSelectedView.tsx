import { motion } from "framer-motion";

export const NothingSelectedView = () => {
  return (
<div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900 ">
  <motion.div
    className="bg-gradient-to-r  from-blue-800 to-blue-900 p-8 rounded-3xl shadow-2xl text-white w-10/12 md:w-8/12 lg:w-6/12"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide text-center mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          ¡Bienvenido a <span className="text-blue-500">Trellify</span>!
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 font-medium text-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Comienza creando un tablero para gestionar tus tareas y actividades.
        </motion.p>

        <motion.p
          className="text-lg md:text-2xl italic font-medium text-center text-blue-300 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          ¿Qué estás esperando?
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <img
            className="w-64 md:w-72 lg:w-80"
            src="assets/image/imageBg1_optimized.svg"
            alt="Welcome Illustration"
          />
        </motion.div>

        <motion.div
          className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-30 z-0"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
        ></motion.div>
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-30 z-0"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};
