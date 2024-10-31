import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row bg-slate-950 h-auto p-8 lg:p-16 space-y-8 lg:space-y-0 lg:space-x-10 justify-center items-center mt-14 
      bg-[url('https://res.cloudinary.com/ma-cloud/image/upload/v1729896236/findy/teamWork_zy7emg.jpg')] bg-cover bg-center lg:bg-none">
      <motion.div
        className="flex flex-col items-center  text-center lg:text-left lg:items-start max-w-md"
        initial={{ x: -100,  opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-medium  text-white italic">
          Organiza tu trabajo de manera eficiente con Trellify
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-normal text-white mt-5">
          Una herramienta intuitiva para gestionar tareas, colaborar con tu equipo y alcanzar tus objetivos más rápido.
        </p>
      </motion.div>
      
      <motion.div
        className="w-full sm:w-full lg:w-1/2 mt-5 lg:mt-0"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      >
        <img
          className="w-full rounded-lg shadow-lg hidden  lg:block"
          src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896236/findy/teamWork_zy7emg.jpg"
          alt="teamWork"
        />
      </motion.div>
    </section>
  );
};
