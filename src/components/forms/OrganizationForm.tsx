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
          <div>
            <label
              htmlFor="ruc"
              className="block text-sm font-medium text-gray-900"
            >
              RUC:
            </label>
            <div className="mt-2">
              <input
                id="taxId"
                type="text"
                autoComplete="off"
                className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.taxId
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("taxId", {
                  required: "El RUC es obligatorio",
                })}
              />
              {errors.taxId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.taxId.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="legalName"
              className="block text-sm font-medium text-gray-900"
            >
              Razón Social:
            </label>
            <div className="mt-2">
              <input
                id="legalName"
                type="text"
                autoComplete="off"
                className={`block w-full sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.legalName
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("legalName", {
                  required: "La Razón Social es obligatoria",
                })}
              />
              {errors.legalName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.legalName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="tradeName"
              className="block text-sm font-medium text-gray-900"
            >
              Nombre Comercial:
            </label>
            <div className="mt-2">
              <input
                id="tradeName"
                type="text"
                autoComplete="off"
                className={`block w-full sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.tradeName
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("tradeName", {
                  required: "El Nombre Comercial es obligatorio",
                })}
              />
              {errors.tradeName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tradeName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="establishmentNumber"
              className="block text-sm font-medium text-gray-900"
            >
              Número de Establecimiento:
            </label>
            <p className="text-sm text-gray-500">
              Número de establecimiento asignado por el SRI ejemplo: 001, 002,
              003, etc.
            </p>
            <div className="mt-2">
              <input
                id="establishmentNumber"
                type="text"
                autoComplete="off"
                className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.establishmentNumber
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("establishmentNumber", {
                  required: "El Nombre Comercial es obligatorio",
                })}
              />
              {errors.establishmentNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.establishmentNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 mb-4">
            <div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="accountingRequired"
                  type="checkbox"
                  className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                    errors.accountingRequired
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-teal-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("accountingRequired")}
                />
                <p className="text-sm text-gray-500">
                  Obligado a llevar contabilidad.
                </p>
                {errors.accountingRequired && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.accountingRequired.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="specialTaxpayer"
                  type="checkbox"
                  className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                    errors.specialTaxpayer
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-teal-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("specialTaxpayer")}
                />
                <p className="text-sm text-gray-500">Contribuyente Especial.</p>
                {errors.specialTaxpayer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specialTaxpayer.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="largeTaxpayer"
                  type="checkbox"
                  className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                    errors.largeTaxpayer
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-teal-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("largeTaxpayer")}
                />
                <p className="text-sm text-gray-500">Gran Contribuyente.</p>
                {errors.largeTaxpayer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.largeTaxpayer.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="rimpeRegimeTaxpayer"
                  type="checkbox"
                  className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                    errors.rimpeRegimeTaxpayer
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-teal-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("rimpeRegimeTaxpayer")}
                />
                <p className="text-sm text-gray-500">
                  Contribuyente Régimen RIMPE:
                </p>
                {errors.rimpeRegimeTaxpayer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rimpeRegimeTaxpayer.message}
                  </p>
                )}
              </div>
              {watch("rimpeRegimeTaxpayer") && (
                <div>
                  <div className="mt-2">
                    <select
                      id="rimpe"
                      className={`block w-full sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                        errors.rimpe
                          ? "border-red-500 focus:outline-red-500"
                          : "border-gray-300 focus:outline-teal-600"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                      {...register("rimpe", {
                        required: "El campo es obligatorio",
                      })}
                    >
                      <option value="rimpe">Contribuyente Régimen RIMPE</option>
                      <option value="rimpeNegocioPopular">
                        Contribuyente Negocio Popular - Régimen RIMPE
                      </option>
                    </select>
                    {errors.rimpe && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rimpe.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="withholdingAgent"
                  type="checkbox"
                  className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                    errors.withholdingAgent
                      ? "border-red-500 focus:outline-red-500"
                      : "border-gray-300 focus:outline-teal-600"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("withholdingAgent")}
                />
                <p className="text-sm text-gray-500">Agente de retención.</p>
                {errors.withholdingAgent && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.withholdingAgent.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-900"
            >
              Ciudad:
            </label>
            <div className="mt-2">
              <input
                id="city"
                type="text"
                autoComplete="off"
                className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.city
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("city", {
                  required: "El Nombre Comercial es obligatorio",
                })}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-900"
            >
              Teléfono:
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="text"
                autoComplete="off"
                className={`block rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.phone
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("phone", {
                  required: "El Nombre Comercial es obligatorio",
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-900"
            >
              Dirección:
            </label>
            <div className="mt-2">
              <input
                id="address"
                type="text"
                autoComplete="off"
                className={`block w-full rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.address
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("address", {
                  required: "El Nombre Comercial es obligatorio",
                })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-900"
            >
              Logo:
            </label>
            <p className="text-sm text-gray-500">
              (Ancho y alto máximo: 500x300 px) Formato permitido: jpg, jpeg,
              png, gif, bmp.
            </p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex  rounded-md bg-teal-600 px-4 py-2 text-base font-semibold text-white shadow-md hover:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Subir Logo
                </button>
                <input
                  id="logo"
                  type="text"
                  autoComplete="off"
                  className={`block sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                  {...register("logo")}
                />
              </div>
              {errors.logo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.logo.message}
                </p>
              )}
            </div>
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
