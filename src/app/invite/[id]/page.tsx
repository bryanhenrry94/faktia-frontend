"use client";
import { Membership } from "@/types/memberships";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";

const InvitePage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [membership, setMembership] = useState<Membership | null>(null);

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
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (membership) {
      reset({
        email: membership.user.email || "",
      });
    }
  }, [membership, reset]);

  const fetchMembership = React.useCallback(async () => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/${id}`;
      const response = await axios.get(backendUrl);

      const data: Membership = response.data;

      if (data.status != "pending") {
        router.push("/login");
        return;
      }

      setMembership(data);
    } catch (error) {
      console.error("Error fetching membership:", error);
    }
  }, [id, router]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  interface FormData {
    email: string;
  }

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/accept-invite`;

      // Simulate API call to accept the invitation
      await axios.post(backendUrl, { invitation: id, ...data });
      toast.success("Invitación aceptada con éxito");
      router.push("/login");
    } catch (error) {
      handleError(error);
    }
  };

  const handleDecline = async () => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/decline-invite`;

      // Simulate API call to accept the invitation
      await axios.post(backendUrl, { invitation: id });
      toast.success("Invitación rechazada con éxito");
      router.push("/login");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
      {membership && (
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Comunidad{" "}
            <span className="text-teal-600">{membership?.tenant?.name}</span>
          </h1>
          <p className="text-gray-600">
            Has sido invitado a unirte a esta comunidad.
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="text"
            {...register("email", { required: true })}
            disabled
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              Este campo es obligatorio
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>
            Al aceptar, confirmas que has leído y aceptado nuestra{" "}
            <Link
              href={"/privacy-policy"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline"
            >
              Política de Tratamiento de Datos Personales
            </Link>{" "}
            y te haces responsable del uso correcto de la aplicación.
          </p>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Aceptar invitación
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="w-full bg-gray-300 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200 ml-2"
          >
            Rechazar
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvitePage;
