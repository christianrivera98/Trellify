export const Testimonials = () => {
  return (
    <section className="testimonials py-16 bg-slate-950 mb-">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="tracking-tight  text-8xlxl md:text-4xl lg:text-5xl leading-tight font-medium text-white italic mb-10">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <div className="bg-white p-6 rounded-lg flex border-solid border-inherit border-2 shadow-xl shadow-gray-500">
            <img
              className="size-32 rounded-full "
              src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896138/findy/men_auyaef.jpg"
              alt="menPhoto"
            />
            <div>
              <p className="text-lg">
                "Trellify ha cambiado la forma en que nuestro equipo organiza
                los proyectos. La simplicidad y flexibilidad son insuperables."
              </p>
              <p className="mt-4 text-sm font-medium">
                - Juan Pérez, Gerente de Proyectos en Empresa XYZ
              </p>
            </div>
          </div>
          <div className="bg-white p-6 flex border-solid border-inherit rounded-lg border-2 shadow-xl shadow-gray-700">
            <img
              className="size-32 rounded-full "
              src="https://res.cloudinary.com/ma-cloud/image/upload/v1729896139/findy/woman_ng7gvr.jpg"
              alt="womanPhoto"
            />
            <div>
              <p className="text-lg">
                "Nos encanta cómo podemos personalizar cada tablero según
                nuestras necesidades. ¡Muy recomendable!"
              </p>
              <p className="mt-4 text-sm font-medium">
                - Ana Gómez, Líder de Producto en Innovatech
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
