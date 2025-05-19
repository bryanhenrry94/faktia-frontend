"use client";
import React from "react";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { toast } from "react-toastify"; // si usas toast
import { OrganizationFormInput } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSubdomain } from "@/hooks/useSubdomain";
import { useForm } from "react-hook-form";

const OrganizationForm = () => {
  const subdomain = useSubdomain();
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrganizationFormInput>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: OrganizationFormInput) => {
    try {
      const protocol = window.location.protocol;
      const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/organization/${id}`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      console.log("data: ", data);

      const response = await axios.patch(backendUrl, data, { headers });
      console.log("response: ", response);

      if (response.status === 201) {
        router.push("/secure/settings");
      }

      toast.success("Organización actualizado con éxito");
    } catch (error) {
      handleError(error);
    }
  };

  const fetchOrganizationData = React.useCallback(async () => {
    try {
      const backendUrl = `${window.location.protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/organization`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const response = await axios.get(backendUrl, { headers });
      console.log("Organization data: ", response.data);

      setId(response.data.id);

      setValue("taxId", response.data.taxId);
      setValue("legalName", response.data.legalName);
      setValue("tradeName", response.data.tradeName);
      setValue("establishmentNumber", response.data.establishmentNumber);
      setValue("accountingRequired", response.data.accountingRequired);
      setValue("specialTaxpayer", response.data.specialTaxpayer);
      setValue("largeTaxpayer", response.data.largeTaxpayer);
      setValue("rimpeRegimeTaxpayer", response.data.rimpeRegimeTaxpayer);
      setValue("rimpe", response.data.rimpe);
      setValue("withholdingAgent", response.data.withholdingAgent);
      setValue("city", response.data.city);
      setValue("phone", response.data.phone);
      setValue("address", response.data.address);
      setValue("logo", response.data.logo);
    } catch (error) {
      console.error("Error fetching tenant data: ", error);
      toast.error("Error fetching tenant data");
    }
  }, [setValue, subdomain]);

  React.useEffect(() => {
    fetchOrganizationData();
  }, [fetchOrganizationData]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-lg font-bold">Información Fiscal</h3>
            <h3 className="text-sm font-normal text-gray-500">
              Información fiscal de la organización
            </h3>
          </div>
          <div className="mb-4">
            <label
              htmlFor="ruc"
              className="block text-sm font-medium text-gray-900"
            >
              ID: {id}
            </label>
          </div>
          
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Actualizar
          </button>
        </div>
      </form>
    </>
  );
};

export default OrganizationForm;
