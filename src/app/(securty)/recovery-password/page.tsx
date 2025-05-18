"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import axios from "axios";
import { useSubdomain } from "@/hooks/useSubdomain";
import Link from "next/link";

const RecoveryPasswordPage = () => {
  const router = useRouter();
  const subdomain = useSubdomain();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecoveryPasswordFormInputs>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  type RecoveryPasswordFormInputs = {
    email: string;
  };

  const onSubmit = async (data: RecoveryPasswordFormInputs) => {
    try {
      setLoading(true);

      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/recovery-password`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const response = await axios.post(backendUrl, data, { headers });
      console.log("response: ", response.data);

      if (!response.status || response.status !== 201) {
        throw new Error("Error al enviar el correo");
      }

      toast.success("Correo de recuperación enviado");
      reset();
      router.push("/login");
    } catch (error) {
      console.error("Error al enviar el correo: ", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800">
        Recuperación de Contraseña
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Enviaremos un enlace a tu correo para restablecer la contraseña.
      </p>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección de correo electrónico
          </label>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ejemplo@correo.com"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500"
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de correo electrónico inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-teal-600 px-4 py-2 text-white text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {loading ? "Enviando..." : "Enviar correo de recuperación"}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:text-teal-500 font-medium"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RecoveryPasswordPage;
