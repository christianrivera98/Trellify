import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Correo no válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Correo no válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});
