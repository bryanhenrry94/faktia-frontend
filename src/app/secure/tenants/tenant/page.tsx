"use client";
import React from "react";
import TenantForm from "@/components/forms/TenantForm";

export default function TenantPage() {
  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold">Nuevo Tenant</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Completa la información para crear un nuevo tenant en tu plataforma.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <TenantForm />
      </div>
    </>
  );
}
