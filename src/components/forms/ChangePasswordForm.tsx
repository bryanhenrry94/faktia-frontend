"use client";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { UserChangePassword } from "@/types";
import { useRouter } from "next/navigation";

interface ChangePasswordFormProps {
  id: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  id,
}: ChangePasswordFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserChangePassword>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: UserChangePassword) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }

      const backendUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user/change-password/${id}`;

      const response = await axios.patch(backendUrl, data);
      console.log("response: ", response);

      if (response.status === 201) {
        router.push("/admin/users");
      }

      toast.success("Contraseña actualizada con éxito");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="password"
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
          htmlFor="confirmPassword"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Confirmar Contraseña
        </label>
        <div className="mt-2">
          <input
            id="confirmPassword"
            type="password"
            autoComplete="passw ord"
            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            {...register("confirmPassword", {
              required: "El contraseña es obligatoria",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Actualizar Contraseña
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
