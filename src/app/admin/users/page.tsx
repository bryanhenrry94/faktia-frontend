"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { User } from "@/types";
import { useRouter } from "next/navigation";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("todos");
  const [rows, setRows] = React.useState<User[]>([]);
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredTenants = rows.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      !user?.name
  );

  const handleRefresh = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user`;

      const response = await axios.get(backendUrl);

      if (response.status === 200) {
        setRows(response.data);
      }
    } catch (error) {
      console.error("Error fetching rows:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewUser = () => {
    router.push("/admin/users/user");
  };

  const TableUsers = ({ data }: { data: User[] }) => {
    return (
      <table className="table-auto w-full text-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Creado</th>
            <th className="px-4 py-2 text-left">Accion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {user.status === "active" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13H7v-2h10v2z" />
                    </svg>
                  )}
                  {user.status}
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
                }).format(new Date(user.createdAt))}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => router.push(`/admin/users/user/${user.id}`)}
                  className="text-teal-600 hover:underline"
                >
                  Editar
                </button>
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
            <h2 className="text-2xl font-bold">Usuarios</h2>
            <p className="text-muted-foreground">
              Administra los usuarios de tu plataforma SaaS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNewUser()}
              className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Nuevo Usuario
            </button>
            <button className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300">
              Exportar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-sm font-medium">Total de Usuarios</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">{rows.length}</div>
              <p className="text-xs text-gray-500">
                +
                {
                  rows.filter((user) => {
                    const createdAt = new Date(user.createdAt);
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
              <h3 className="text-sm font-medium">Usuarios Activos</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {rows.filter((user) => user.status === "active").length}
              </div>
              <p className="text-xs text-gray-500">
                {rows.length > 0
                  ? `${Math.round(
                      (rows.filter((user) => user.status === "active").length /
                        rows.length) *
                        100
                    )}% de rows activos`
                  : "No hay rows disponibles"}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="pb-2">
              <h3 className="text-sm font-medium">Usuarios Totales</h3>
            </div>
            <div>
              <div className="text-2xl font-bold">{rows.length}</div>
              <p className="text-xs text-gray-500">usuarios en total</p>
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
              placeholder="Buscar usuarios..."
              className="rounded-md px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div id="default-tab-content">
          {activeTab === "todos" && <TableUsers data={filteredTenants} />}
          {activeTab === "activos" && (
            <TableUsers
              data={filteredTenants?.filter((q) => q.status === "active")}
            />
          )}
          {activeTab === "inactivos" && (
            <TableUsers
              data={filteredTenants?.filter((q) => q.status === "inactive")}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
