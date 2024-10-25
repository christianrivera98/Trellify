
export const NothingSelectedView = () => {
  return (
    <div className="flex justify-center bg-slate-950 items-center h-screen   ">
        <div className=" bg-slate-100 h-5/6 w-7/12 rounded-full flex flex-col justify-center items-center  ">
            
            <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl text-center mb-6">
                ¡Bienvenido a <span className="text-blue-500">Trellify</span>!
            </h1>
            <p className="text-lg text-pretty mb-4 font-medium  peer-focus-within: text-center">
                Inicia creando un tablero para que puedas empezar a gestionar tus tareas o actividades.
            </p>
            <p className="text-center text-3xl font-medium italic">
                ¡¿Que estás esperando?! 
            </p>
            <div className="justify-center flex">
                <img className="size-96" src="src/assets/imageBg1.svg" alt="" />
            </div>
        </div>
    </div>
  )
}
