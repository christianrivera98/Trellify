export const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row bg-sky-500 h-auto p-8 lg:p-16 space-y-8 lg:space-y-0 lg:space-x-10 justify-center items-center my-12">
      <div className="flex flex-col items-center text-center lg:text-left lg:items-start max-w-md">
        <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-medium text-white italic">
          Organiza tu trabajo de manera eficiente con Trellify
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-normal text-white mt-5">
          Una herramienta intuitiva para gestionar tareas, colaborar con tu equipo y alcanzar tus objetivos más rápido.
        </p>
      </div>
      <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
        <img className="w-full rounded-lg" src="src/assets/teamWork.jpg" alt="teamWork" />
      </div>
    </section>
  );
};
