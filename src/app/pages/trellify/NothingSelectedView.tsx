
export const NothingSelectedView = () => {
  return (
    <div className="flex justify-center items-center h-screen   ">
        <div className=" bg-gray-50 h-5/6 w-7/12 rounded-full flex flex-col justify-center items-center  ">
            
            <h1 className="text-6xl font-extrabold text-center mb-6">
                ¡Bienvenido a <span className="text-blue-500">Trellify</span>!
            </h1>
            <p className="text-xl mb-4 font-medium  text-center">
                Inicia creando un tablero para que puedas empezar a gestionar tus tareas o actividades.
            </p>
            <p className="text-center text-3xl font-medium">
                ¡¿Que estás esperando?! 
            </p>
            <div className="justify-center flex">
                <img className="size-96" src="src/assets/imageBg1.svg" alt="" />
            </div>
        </div>
    </div>
  )
}
