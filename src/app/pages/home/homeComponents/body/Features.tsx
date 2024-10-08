export const Features = () => {
  return (
    <section className="mx-4 lg:mx-20 py-8">
      <div className="mx-4 lg:mx-10 mb-4">
        <h1 className="font-base text-lg lg:text-xl">Caracteristicas principales:</h1>
      </div>
      <h3 className="text-2xl md:text-3xl lg:text-4xl w-full lg:w-1/2 mx-4 lg:mx-10 my-5">
        Trellify cuenta con herramientas que harán más eficiente tu trabajo
      </h3>
      <div className="flex flex-col justify-center lg:flex-row flex-wrap space-y-4 lg:space-y-0 lg:space-x-4 mt-10">
        <div className="p-4 flex items-center border border-solid rounded-lg shadow-lg">
          <div className="mr-4">
            <h2 className="text-xl lg:text-2xl font-medium mb-3">Gestión de Tableros y Tareas</h2>
            <p className="text-sm lg:text-lg w-full lg:w-64">
              Organiza tus proyectos de manera visual con tableros y tarjetas que se adaptan a cualquier flujo de trabajo.
            </p>
          </div>
          <img className="w-20 h-20 lg:w-36 lg:h-36" src="src/assets/addTasks.svg" alt="addTasks" />
        </div>
        <div className="p-4 flex items-center border border-solid rounded-lg shadow-lg">
          <div className="mr-4">
            <h2 className="text-xl lg:text-2xl font-medium mb-3">Colaboración en Tiempo Real</h2>
            <p className="text-sm lg:text-lg w-full lg:w-64">
              Invita a tu equipo y trabaja juntos con actualizaciones en tiempo real y comentarios en cada tarjeta.
            </p>
          </div>
          <img className="w-20 h-20 lg:w-36 lg:h-36" src="src/assets/pushNotifications.svg" alt="addTasks" />
        </div>
        <div className="p-4 flex items-center border border-solid rounded-lg shadow-lg">
          <div className="mr-4">
            <h2 className="text-xl lg:text-2xl font-medium mb-3">Integraciones y Automatización</h2>
            <p className="text-sm lg:text-lg w-full lg:w-64">
              Conecta con las herramientas que ya usas y automatiza tareas repetitivas para ahorrar tiempo.
            </p>
          </div>
          <img className="w-20 h-20 lg:w-36 lg:h-36" src="src/assets/projectCompleted.svg" alt="addTasks" />
        </div>
      </div>
    </section>
  );
};
