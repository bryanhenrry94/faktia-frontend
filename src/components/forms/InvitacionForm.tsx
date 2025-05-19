import { Membership } from "@/types/memberships";
import React, { FC } from "react";
import { toast } from "react-toastify"; // si usas toast
import { useForm } from "react-hook-form";
import { Tenant, User } from "@/types";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import axios from "axios";

type Props = {
  tenantId: string;
  data: Membership[];
  refreshData: () => void;
};

const InvitacionForm: FC<Props> = ({ tenantId, data, refreshData }) => {
  const [loading, setLoading] = React.useState(false);
  const [tenant, setTenant] = React.useState<Tenant | null>(null);

  const canInviteMore = data.length < 5;

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  React.useEffect(() => {
    const fetchTenant = async () => {
      try {
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant/${tenantId}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        const response = await axios.get(backendUrl, { headers });
        setTenant(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchTenant();
  }, [tenantId, handleError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<User>();

  interface InviteFormData {
    email: string;
  }

  const handleInvite = async (data: InviteFormData) => {
    try {
      setLoading(true);
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/invite`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": tenant?.subdomain,
      };

      const response = await axios.post(backendUrl, data, { headers });
      console.log("Response:", response);

      if (!response.status || response.status !== 201) {
        const data = response.data;
        toast.error(`Error al enviar la invitación: ${data.message}`);
        return;
      }

      toast.success("Invitación enviada con éxito");
      reset();
      refreshData();
    } catch (error) {
      console.error("Error:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleInvite)} className="flex gap-4">
        <div className="flex-1">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              disabled={loading || !canInviteMore}
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "El correo electrónico no es válido",
                },
              })}
              className="w-full p-2 border rounded focus:ring focus:ring-teal-500"
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
          disabled={loading || !canInviteMore}
          className={`px-4 py-2 text-white rounded ${
            loading || !canInviteMore
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-500"
          }`}
        >
          {loading ? "Enviando..." : "Invitar"}
        </button>
      </form>
      {!canInviteMore && (
        <p className="text-sm text-red-500 mt-2">
          Has alcanzado el límite máximo de usuarios para tu organización.
        </p>
      )}
    </>
  );
};

export default InvitacionForm;
