"use client";
import React from "react";
import OrganizationForm from "@/components/forms/OrganizationForm";
import ElectronicInvoicingConfigForm from "@/components/forms/ElectronicInvoicingConfigForm";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = React.useState("organization");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Configuración</h2>
            <p className="text-muted-foreground">
              Configuracion de la organización y facturación electrónica
            </p>
          </div>
        </div>

        <div className="flex ">
          <div className="mb-6 border-b border-gray-300">
            <ul
              className="flex space-x-4 text-sm font-medium text-center"
              id="default-tab"
              role="tablist"
            >
              <li role="presentation">
                <button
                  className={`px-6 py-2 rounded-t-md ${
                    activeTab === "organization"
                      ? "text-teal-700 border-b-2 border-teal-700 font-semibold"
                      : "text-gray-500 hover:text-teal-700"
                  }`}
                  id="organization-tab"
                  type="button"
                  role="tab"
                  aria-controls="organization"
                  aria-selected={activeTab === "organization"}
                  onClick={() => handleTabClick("organization")}
                >
                  Organización
                </button>
              </li>
              <li role="presentation">
                <button
                  className={`px-6 py-2 rounded-t-md ${
                    activeTab === "electronic-invoicing-config"
                      ? "text-teal-700 border-b-2 border-teal-700 font-semibold"
                      : "text-gray-500 hover:text-teal-700"
                  }`}
                  id="electronic-invoicing-config-tab"
                  type="button"
                  role="tab"
                  aria-controls="electronic-invoicing-config"
                  aria-selected={activeTab === "electronic-invoicing-config"}
                  onClick={() => handleTabClick("electronic-invoicing-config")}
                >
                  Facturación Electrónica
                </button>
              </li>
              <li role="presentation">
                <button
                  className={`px-6 py-2 rounded-t-md ${
                    activeTab === "users"
                      ? "text-teal-700 border-b-2 border-teal-700 font-semibold"
                      : "text-gray-500 hover:text-teal-700"
                  }`}
                  id="users-tab"
                  type="button"
                  role="tab"
                  aria-controls="users"
                  aria-selected={activeTab === "users"}
                  onClick={() => handleTabClick("users")}
                >
                  Usuarios
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div id="default-tab-content">
          {activeTab === "organization" && (
            <>
              <OrganizationForm />
            </>
          )}
          {activeTab === "users" && <p>Estamos trabajando...</p>}
          {activeTab === "electronic-invoicing-config" && (
            <ElectronicInvoicingConfigForm />
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
