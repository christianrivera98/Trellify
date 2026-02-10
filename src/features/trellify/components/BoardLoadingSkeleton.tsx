export const BoardLoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 h-screen py-4">
      <p className="font-semibold text-2xl italic text-slate-100 text-pretty">
        Cargando tablero
      </p>
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600" />
    </div>
  );
};
