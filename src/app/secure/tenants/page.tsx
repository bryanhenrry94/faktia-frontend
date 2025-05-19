"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { Tenant } from "@/types";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { toast } from "react-toastify"; // si usas toast

const TenantsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("todos");
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    // Implement refresh logic here
    fetchTenants();
  };

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

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleNewTenant = () => {
    router.push("/secure/tenants/tenant");
  };

  const handleEditTenant = (tenant: Tenant) => {
    router.push(`/secure/tenants/tenant/${tenant.id}`);
  };

  const handleDeleteTenant = async (tenant: Tenant) => {
    Swal.fire({
      title: `¿Deseas eliminar el tenant ${tenant.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008080",
      cancelButtonColor: "#E48F8B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const protocol = window.location.protocol;
          const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant/${tenant.id}`;
          await axios.delete(backendUrl);
          toast.success("Tenant eliminado correctamente");
          fetchTenants(); // Refresh the tenants list
        } catch (error) {
          console.error("Error deleting tenant:", error);
          toast.error("No se pudo eliminar el tenant");
        }
      }
    });
  };

  const TableTenants = ({ data }: { data: Tenant[] }) => {
    return (
      <table className="table-auto w-full text-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Identificación</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Subdominio</th>
            <th className="px-4 py-2 text-left">Plan</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Creado</th>
            <th className="px-4 py-2 text-left">Web</th>
            <th className="px-4 py-2 text-left">Accion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tenant) => (
            <tr key={tenant.id}>
              <td className="px-4 py-2">{tenant.taxId}</td>
              <td className="px-4 py-2">{tenant.name}</td>
              <td className="px-4 py-2">{tenant.subdomain}</td>
              <td className="px-4 py-2">{tenant.plan}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    tenant.status === "active"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tenant.status}
                </span>
              </td>
              <td className="px-4 py-2">
                {new Intl.DateTimeFormat("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }).format(new Date(tenant.createdAt))}
              </td>
              <td className="px-4 py-2">
                <div className="relative group">
                  <Link
                    href={`${window.location.protocol}//${tenant.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}/login`}
                    className="text-teal-600 hover:underline"
                    target="_blank"
                  >
                    Url
                  </Link>
                  <div className="absolute left-0 mt-1 hidden w-max rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-md group-hover:block">
                    {`${window.location.protocol}//${tenant.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}/login`}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTenant(tenant)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200"
                    title="Editar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.414l-3.536.707.707-3.536a2 2 0 01.414-.828z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant)}
                    disabled={tenant?.memberships?.length !== 0}
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 ${
                      tenant?.memberships?.length !== 0
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
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
          {filteredTenants.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No se encontraron resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tenants</h2>
            <p className="text-muted-foreground">
              Administra los tenants de tu plataforma SaaS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNewTenant()}
              className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Nuevo Tenant
            </button>
            <button className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
              Exportar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-sm font-medium">Total de Tenants</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">{tenants.length}</div>
              <p className="text-xs text-gray-500">
                +
                {
                  tenants.filter((tenant) => {
                    const createdAt = new Date(tenant.createdAt);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return createdAt >= thirtyDaysAgo;
                  }).length
                }{" "}
                en el último mes
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-sm font-medium">Tenants Activos</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {tenants.filter((tenant) => tenant.status === "active").length}
              </div>
              <p className="text-xs text-gray-500">
                {tenants.length > 0
                  ? `${Math.round(
                      (tenants.filter((tenant) => tenant.status === "active")
                        .length /
                        tenants.length) *
                        100
                    )}% de tenants activos`
                  : "No hay tenants disponibles"}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-sm font-medium">Tenants Inactivos</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {
                  tenants.filter((tenant) => tenant.status === "inactive")
                    .length
                }
              </div>
              <p className="text-xs text-gray-500">
                {tenants.length > 0
                  ? `${Math.round(
                      (tenants.filter((tenant) => tenant.status === "inactive")
                        .length /
                        tenants.length) *
                        100
                    )}% de tenants inactivos`
                  : "No hay tenants disponibles"}
              </p>
            </div>
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
                    activeTab === "todos"
                      ? "text-teal-600 border-teal-600"
                      : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  id="todos-tab"
                  data-tabs-target="#todos"
                  type="button"
                  role="tab"
                  aria-controls="todos"
                  aria-selected="false"
                  onClick={() => handleTabClick("todos")}
                >
                  Todos
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "activos"
                      ? "text-teal-600 border-teal-600"
                      : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  id="activos-tab"
                  data-tabs-target="#activos"
                  type="button"
                  role="tab"
                  aria-controls="activos"
                  aria-selected="false"
                  onClick={() => handleTabClick("activos")}
                >
                  Activos
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "inactivos"
                      ? "text-teal-600 border-teal-600"
                      : "text-gray-600 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  id="inactivos-tab"
                  data-tabs-target="#inactivos"
                  type="button"
                  role="tab"
                  aria-controls="inactivos"
                  aria-selected="false"
                  onClick={() => handleTabClick("inactivos")}
                >
                  Inactivos
                </button>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-teal-600 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 .34-.03.67-.08 1h2.02c.05-.33.06-.66.06-1 0-4.42-3.58-8-8-8zm-6 7c0-.34.03-.67.08-1H4.06c-.05.33-.06.66-.06 1 0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Buscar tenants..."
              className="rounded-md px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div id="default-tab-content">
          {activeTab === "todos" && <TableTenants data={filteredTenants} />}
          {activeTab === "activos" && (
            <TableTenants
              data={filteredTenants?.filter((q) => q.status === "active")}
            />
          )}
          {activeTab === "inactivos" && (
            <TableTenants
              data={filteredTenants?.filter((q) => q.status === "inactive")}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TenantsPage;
