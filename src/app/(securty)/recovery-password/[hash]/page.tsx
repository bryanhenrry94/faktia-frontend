"use client";
import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import axios from "axios";
import { useSubdomain } from "@/hooks/useSubdomain";

type RecoveryPasswordFormInputs = {
  password: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const { hash } = useParams();

  const subdomain = useSubdomain();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!hash) {
        toast.error("No se ha proporcionado un token válido");
        router.push("/login");
        return;
      }

      try {
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/recovery-password/validate`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Tenant-Subdomain": subdomain,
        };
        const response = await axios.post(
          backendUrl,
          { hash: hash },
          { headers }
        );

        if (!response.status || response.status !== 201) {
          throw new Error("Token inválido");
        }
      } catch (error) {
        console.error("Error al validar el token: ", error);
        toast.error("Token inválido o expirado");
        router.push("/login");
      }
    };

    validateToken();
  }, [hash, router, subdomain]);

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
    onUnauthorized: () => {
      router.push("/login");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecoveryPasswordFormInputs>();

  const onSubmit = async (data: RecoveryPasswordFormInputs) => {
    try {
      setLoading(true);
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/recovery-password/update`;
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
      toast.success("Contraseña actualizada con éxito");
      reset();
      router.push("/login");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Recuperar Contraseña
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Nueva Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Introduce tu nueva contraseña"
            {...register("password", {
              required: "La contraseña es requerida",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "La contraseña debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas, números y símbolos",
              },
            })}
          />
          {errors.password && (
            <span className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
            loading
              ? "bg-teal-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
