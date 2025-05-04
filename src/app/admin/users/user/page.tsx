"use client";
import { CheckIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { Tenant, UserFormInputs } from "@/types";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const [tenants, setTenants] = React.useState<Tenant[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>();

  const fetchTenants = async () => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant`;

      const response = await axios.get(backendUrl);

      if (response.status === 200) {
        setTenants(response.data);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  React.useEffect(() => {
    fetchTenants();
  }, []);

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: UserFormInputs) => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user`;

      const response = await axios.post(backendUrl, data);
      console.log("response: ", response);

      if (response.status === 201) {
        toast.success("Usuario registrado con éxito");
        router.push(`/admin/users/user/${response.data.id}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Nuevo Usuario
          </h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Completa la información para crear un nuevo usuario en tu
            plataforma.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="pb-2">
                <h3 className="text-lg font-bold">Información General</h3>
                <h3 className="text-sm font-normal text-gray-500">
                  Información básica sobre el usuario
                </h3>
              </div>
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Nombre del Usuario
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      type="name"
                      autoComplete="name"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("name", {
                        required: "El nombre del usuario es obligatorio",
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Correo Electrónico
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("email", {
                        required: "El correo electrónico es obligatorio",
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="passord"
                      type="password"
                      autoComplete="passw ord"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password", {
                        required: "El contraseña es obligatoria",
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Rol
                  </label>
                  <div className="mt-2">
                    <select
                      id="role"
                      className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("role", {
                        required: "El rol es obligatorio",
                      })}
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="pb-2">
                <h3 className="text-lg font-bold">Información de Contacto</h3>
                <h3 className="text-sm font-normal text-gray-500">
                  Información del tenant
                </h3>
              </div>
              <div>
                <label
                  htmlFor="tenantId"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Tenant
                </label>
                <div className="mt-2">
                  <select
                    id="tenantId"
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                      errors.tenantId ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("tenantId", {
                      required: "El tenant es obligatorio",
                    })}
                  >
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                  {errors.tenantId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tenantId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <CheckIcon aria-hidden="true" className="mr-2 h-5 w-5" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
