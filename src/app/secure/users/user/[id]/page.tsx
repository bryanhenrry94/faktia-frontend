"use client";
import { CheckIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { UserFormInputs } from "@/types";
import { useRouter, useParams } from "next/navigation";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";

export default function TenantPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const router = useRouter();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormInputs>();

  const fetchUserData = React.useCallback(
    async (userId: string) => {
      try {
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user/${userId}`;
        const response = await axios.get(backendUrl);

        console.log("User data: ", response.data);
        setValue("name", response.data.name);
        setValue("email", response.data.email);
        setValue("status", response.data.status);
      } catch (error) {
        console.error("Error fetching tenant data: ", error);
        toast.error("Error fetching tenant data");
      }
    },
    [setValue]
  );

  React.useEffect(() => {
    if (!params.id) {
      return;
    }

    if (typeof params.id === "string") {
      fetchUserData(params.id);
    }
  }, [params.id, fetchUserData]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: UserFormInputs) => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user/${params.id}`;

      const response = await axios.patch(backendUrl, data);
      console.log("response: ", response);

      if (response.status === 201) {
        router.push("/secure/users");
      }

      toast.success("Usuario actualizado con éxito");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Editar Usuario
          </h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Edita la información del usuario.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="mb-4 border-b border-gray-200">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="default-tab"
            data-tabs-toggle="#default-tab-content"
            role="tablist"
          >
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "general"
                    ? "text-teal-600 border-teal-600"
                    : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="general-tab"
                data-tabs-target="#general"
                type="button"
                role="tab"
                aria-controls="general"
                aria-selected="false"
                onClick={() => handleTabClick("general")}
              >
                General
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "users"
                    ? "text-teal-600 border-teal-600"
                    : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="users-tab"
                data-tabs-target="#users"
                type="button"
                role="tab"
                aria-controls="users"
                aria-selected="false"
                onClick={() => handleTabClick("users")}
              >
                Contraseña
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div id="default-tab-content">
        {activeTab === "general" && (
          <>
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
                        htmlFor="status"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Estado
                      </label>
                      <div className="mt-2">
                        <select
                          id="status"
                          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                            errors.status ? "border-red-500" : "border-gray-300"
                          }`}
                          {...register("status", {
                            required: "El rol es obligatorio",
                          })}
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.status.message}
                          </p>
                        )}
                      </div>
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
                  Actualizar
                </button>
              </div>
            </form>
          </>
        )}
        {activeTab === "users" && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-lg font-bold">Cambio de Contraseña</h3>
              <h3 className="text-sm font-normal text-gray-500">
                Cambia la contraseña del usuario
              </h3>
            </div>
            <div>
              {params.id && <ChangePasswordForm id={params.id as string} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
