import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { checkingAuthentication, startGoogleSignIn, startLoginWithEmailPassword } from "../../../store/auth/Thunks";
import { AppDispatch, RootState } from "../../../store/Store";
import { useMemo } from "react";

type SignInFormInputs = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const { isAuthenticated, errorMessage } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();

  const isAuthenticating = useMemo(() => isAuthenticated === 'checking', [isAuthenticated]);

  const onSubmit: SubmitHandler<SignInFormInputs> = ({ email, password }) => {
    dispatch(checkingAuthentication());
    dispatch(startLoginWithEmailPassword({ email, password }));
  };

  const onGoogle = () => {
    dispatch(startGoogleSignIn());
  };

  return (
    <div className="bg-[url('src/assets/BgSignIn.png')] bg-contain bg-center bg-no-repeat h-screen w-screen">
      <section className="flex flex-col justify-center items-center min-h-screen">
        <Link to="/" className="flex items-center text-6xl font-extrabold tracking-wide mb-10">
          <img src="./logo.svg" alt="logo" className="h-20 w-20 mr-2" />
          Trellify
        </Link>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col border-slate-300 border border-solid rounded-lg shadow-lg p-20">
          <h2 className="font-semibold text-xl mb-8">Inicia sesión para continuar</h2>
          <label className="font-medium mb-2" htmlFor="email">Correo</label>
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
          
          <label className="font-medium my-3" htmlFor="password">Contraseña</label>
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
            Ingresar
          </button>
          <h2 className="font-medium text-slate-500 my-3 flex justify-center text-base">O continua con:</h2>
          <button disabled={isAuthenticating} onClick={onGoogle} className="border p-2 border-slate-300 rounded-sm items-center flex justify-center gap-3 hover:bg-slate-50 transition-colors">
            <img className="size-8" src="src/assets/iconsButtons/google.svg" alt="" />
            <p className="font-medium">Google</p>
          </button>
          <div className="flex gap-2 my-6 justify-center">
            <p className="font-medium text-slate-600">No tienes cuenta?</p>
            <Link className="font-medium text-sky-600 hover:text-sky-700 transition-colors" to={"/sign-up"}>Regístrate</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

