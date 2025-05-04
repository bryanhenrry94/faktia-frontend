"use client";
import { useSubdomain } from "@/hooks/useSubdomain";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";

import { TenantFormInputs } from "@/types";

const TenantForm = () => {
  const subdomain = useSubdomain();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormInputs>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: TenantFormInputs) => {
    try {
      if (!subdomain) return;

      const backendUrl = `http://${subdomain}.${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/login`;

      const response = await axios.post(backendUrl, data, {
        withCredentials: true,
      });

      if (!response.status || response.status !== 200) {
        throw new Error("Credenciales incorrectas");
      }

      console.log("response: ", response.data);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Nombre de la organización
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
                required: "El nombre de la organización es obligatoria",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="subdomain"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Dominio
          </label>
          <div className="mt-2">
            <input
              id="subdomain"
              type="subdomain"
              autoComplete="subdomain"
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                errors.subdomain ? "border-red-500" : "border-gray-300"
              }`}
              {...register("subdomain", {
                required: "El dominio es obligatorio",
              })}
            />
            {errors.subdomain && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subdomain.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="plan"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Plan
          </label>
          <div className="mt-2">
            <select
              id="plan"
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                errors.plan ? "border-red-500" : "border-gray-300"
              }`}
              {...register("plan", {
                required: "El plan es obligatorio",
              })}
            >
              <option value="">Selecciona un plan</option>
              <option value="basic">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
            {errors.plan && (
              <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default TenantForm;
