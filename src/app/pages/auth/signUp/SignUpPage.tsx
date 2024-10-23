import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AppDispatch, RootState } from '../../../store/Store';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { startCreatingUserWithEmailPassword } from '../../../store/auth/Thunks';
import { SignUpFormInputs } from '../types/Types';




export const SignUpPage = () => {

  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated} = useSelector((state: RootState) => state.auth);

  const isAuthenticating = useMemo(() => isAuthenticated === 'checking', [isAuthenticated]);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();

  const onSubmit: SubmitHandler<SignUpFormInputs> = ({ email, password, name, lastname }) => {

    const displayName = `${name} ${lastname}`.trim();

    console.log('Dispatching startCreatingUserWithEmailPassword with:', { email, password, displayName }); // Agrega este console.log
    dispatch(startCreatingUserWithEmailPassword({ email, password, displayName }));

  };

  return (
    <div className="bg-[url('src/assets/BgSignIn.png')] bg-contain bg-center bg-no-repeat h-screen w-screen">
      <section className="flex flex-col justify-center items-center min-h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col border-slate-300 border border-solid rounded-lg shadow-lg p-20">
          <h2 className="font-semibold text-xl mb-8">Regístrate para continuar</h2>

          <label className="font-medium mb-2" htmlFor="name">Nombre/s:</label>
          <input
            className="border p-2 border-slate-300 rounded-sm w-64 hover:bg-slate-50 transition-colors"
            type="text"
            id="name"
            placeholder="Ingrese su nombre"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}

          <label className="font-medium my-2" htmlFor="lastname">Apellidos:</label>
          <input
            className="border p-2 border-slate-300 rounded-sm w-64 hover:bg-slate-50 transition-colors"
            type="text"
            id="lastname"
            placeholder="Ingrese su apellido/s"
            {...register("lastname", { required: "El apellido es obligatorio" })}
          />
          {errors.lastname && <span className="text-red-500">{errors.lastname.message}</span>}

          <label className="font-medium my-2" htmlFor="email">Correo:</label>
          <input
            className="border p-2 border-slate-300 rounded-sm w-64 hover:bg-slate-50 transition-colors"
            type="email"
            id="email"
            placeholder="Ingrese su correo electrónico"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+$/i, message: "Correo no válido" }
            })}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          <label className="font-medium my-3" htmlFor="password">Contraseña:</label>
          <input
            className="border p-2 border-slate-300 rounded-sm w-64 hover:bg-slate-50 transition-colors"
            type="password"
            id="password"
            placeholder="Ingrese su contraseña"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
            })}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}

          <button disabled={isAuthenticating} type="submit" className="border p-2 my-4 font-medium border-slate-300 rounded-sm items-center flex justify-center gap-3 hover:bg-slate-50 transition-colors">
            Registrarte
          </button>
          <h2 className="font-medium text-slate-500 my-3 flex justify-center text-base">O continua con:</h2>
          <button className="border p-2 border-slate-300 rounded-sm items-center flex justify-center gap-3 hover:bg-slate-50 transition-colors">
            <img className="size-8" src="src/assets/iconsButtons/google.svg" alt="" />
            <p className="font-medium">Google</p>
          </button>
          <div className="flex gap-2 my-6 justify-center">
            <p className="font-medium text-slate-600">Ya tienes cuenta?</p>
            <Link className="font-medium text-sky-600 hover:text-sky-700 transition-colors" to={"/sign-in"}>Inicia sesión</Link>
          </div>
        </form>
      </section>
    </div>
  );
};
