"use client";
import { useSubdomain } from "@/hooks/useSubdomain";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { useRouter } from "next/navigation";
import { useAuthToken } from "@/hooks/useAuthToken";
import Image from "next/image";
import Link from "next/link";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const subdomain = useSubdomain();
  const router = useRouter();
  const { setAuthToken } = useAuthToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
    onUnauthorized: () => {
      router.push("/login");
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      if (!subdomain) return;

      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/login`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const response = await axios.post(backendUrl, data, { headers });

      if (!response.status || response.status !== 200) {
        throw new Error("Credenciales incorrectas");
      }

      console.log("response: ", response.data);

      const { access_token } = response.data;

      // Guardar el token en la cookie
      if (access_token) {
        setAuthToken(access_token);
      } else {
        console.error("No token received");
      }

      if (subdomain === "app") {
        router.push("/admin");
      } else {
        router.push("/secure");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex ">
        <div className="hidden lg:block lg:w-0 lg:flex-1 bg-teal-800">
          <div className="flex h-screen items-center">
            <Image
              alt="Product screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            />
          </div>
        </div>
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-10 text-center text-3xl font-extrabold text-gray-900">
              Bienvenido a Faktia
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accede a la aplicación con tu cuenta para disfrutar de nuestros
              servicios.
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white py-8 px-6 shadow rounded-lg"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección de correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                    })}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={`block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                    })}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/recovery-password"
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center rounded-md border border-transparent bg-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Comienza una prueba gratuita de 14 días
              </Link>
            </p>
            <p className="mt-6 text-center text-sm text-gray-600">
              Ver nuestra{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Política de privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
