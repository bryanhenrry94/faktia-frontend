"use client";
import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { useParams } from "next/navigation";
import { Membership } from "@/types/memberships";
import InvitacionForm from "@/components/forms/InvitacionForm";
import TenantForm from "@/components/forms/TenantForm";

export default function TenantPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const { id }: { id: string } = useParams();
  const [memberships, setMemberships] = React.useState<Membership[]>([]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const fetchMembershipsByTenant = React.useCallback(async () => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/tenant/${id}`;
      const response = await axios.get(backendUrl);
      setMemberships(response.data);
    } catch (error) {
      console.error("Error fetching fetchMembershipsByTenant: ", error);
      toast.error("Error al obtener los usuarios por tenant");
    }
  }, [id]);

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const handleDeleteInvitation = async (membershipId: string) => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/${membershipId}`;
      const response = await axios.delete(backendUrl);
      console.log("response: ", response);

      if (response.status === 200 || response.status === 204) {
        setMemberships((prev) =>
          prev.filter((membership) => membership.id !== membershipId)
        );
        toast.success("Usuario eliminado con éxito");
        fetchMembershipsByTenant();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleResentInvitation = async (membershipId: string) => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/memberships/resend-invite/`;
      const response = await axios.post(backendUrl, {
        invitation: membershipId,
      });
      console.log("response: ", response);

      if (response.status === 200 || response.status === 201) {
        toast.success("Invitacion reenviada con éxito");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold">Editar Tenant</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Edita la información del tenant.
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
                Miembros
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === "invoices"
                    ? "text-teal-600 border-teal-600"
                    : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="invoices-tab"
                data-tabs-target="#invoices"
                type="button"
                role="tab"
                aria-controls="invoices"
                aria-selected="false"
                onClick={() => handleTabClick("invoices")}
              >
                Facturacion
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div id="default-tab-content">
        {activeTab === "general" && (
          <>
            <TenantForm id={id} />
          </>
        )}
        {activeTab === "users" && (
          <>
            <div className="mb-8 rounded-lg shadow-md bg-white">
              <div className="p-4">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <span className="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  Invitar Usuarios
                </div>
                <p className="text-sm text-gray-500">
                  Invita a nuevos miembros a unirse a tu organización. Tienes un
                  límite de usuarios.
                </p>
              </div>
              <div className="p-4">
                <InvitacionForm
                  tenantId={id}
                  data={memberships}
                  refreshData={fetchMembershipsByTenant}
                />
              </div>
              <div className="p-4 bg-gray-50 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12H8m0 0l4-4m-4 4l4 4"
                    />
                  </svg>
                  Se enviará un correo electrónico con un enlace para aceptar la
                  invitación.
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Usuarios Activos</h2>
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Correo Electrónico
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Rol
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberships
                  .filter((q) => q.status === "accepted")
                  .map((membership) => (
                    <tr key={membership.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {membership.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {membership.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {membership.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {membership.status}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <h2 className="text-xl font-semibold mb-4 mt-8">
              Invitaciones Pendientes
            </h2>
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Correo Electrónico
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Rol
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                  >
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberships
                  .filter((q) => q.status === "pending")
                  .map((membership) => (
                    <tr key={membership.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {membership.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {membership.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {membership.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleResentInvitation(membership.id)
                            }
                            className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200`}
                            title="Reenviar invitación"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 12H8m0 0l4-4m-4 4l4 4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteInvitation(membership.id)
                            }
                            className={`flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200`}
                            title="Eliminar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
        {activeTab === "invoices" && (
          <>
            <div className="flex flex-col items-center justify-center py-10">
              <CurrencyDollarIcon
                className="h-15 w-15 mb-2 text-gray-200"
                aria-hidden="true"
              />

              <h2 className="text-lg font-bold text-gray-900 sm:text-3xl">
                Detalles de Facturación
              </h2>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Información de facturación y pagos
              </p>
              <button
                type="button"
                className="mt-6 inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Ver Historial
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
