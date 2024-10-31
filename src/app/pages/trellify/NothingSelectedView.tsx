
export const NothingSelectedView = () => {
  return (
    <div className="flex justify-center bg-slate-950 items-center h-screen   ">
        <div className=" bg-slate-100 md:h-4/6 lg:h-4/6 lg:w-9/12 xl:w-7/12 rounded-3xl w-10/12 h-2/6 md:mb-16 md:rounded-2xl lg:rounded-2xl xl:rounded-full flex flex-col justify-center items-center  ">
            
            <h1 className="md:text-4xl lg:text-6xl font-extrabold tracking-tight text-3xl text-center md:mb-6 lg:mb-4">
                ¡Bienvenido a <span className="text-blue-500">Trellify</span>!
            </h1>
            <p className="md:text-lg text-pretty mb-4 font-medium  peer-focus-within: text-center">
                Inicia creando un tablero para que puedas empezar a gestionar tus tareas o actividades.
            </p>
            <p className="text-center text-2xl md:text-3xl font-medium italic">
                ¡¿Que estás esperando?! 
            </p>
            <div className="justify-center flex">
                <img className="size-36 md:size-80 lg:size-72 2xl:size-96" src="https://res.cloudinary.com/ma-cloud/image/upload/v1729900911/findy/imageBg1_l0guwh.svg" alt="" />
            </div>
        </div>
    </div>
  )
}
