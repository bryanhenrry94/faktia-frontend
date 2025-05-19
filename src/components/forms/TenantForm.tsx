"use client";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // si usas toast
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { CheckIcon } from "@heroicons/react/20/solid";
import { TenantFormInputs } from "@/types";
import { useRouter } from "next/navigation";

type TenantFormProps = {
  id?: string | null;
};

const TenantForm = ({ id }: TenantFormProps) => {
  const router = useRouter();
  const [isModeEdit, setIsModeEdit] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchTenantData(id);
    }
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TenantFormInputs>();

  const fetchTenantData = React.useCallback(
    async (tenantId: string) => {
      try {
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant/${tenantId}`;
        const response = await axios.get(backendUrl);

        console.log("Tenant data: ", response.data);
        setIsModeEdit(true);

        setValue("taxId", response.data.taxId);
        setValue("name", response.data.name);
        setValue("subdomain", response.data.subdomain);
        setValue("email", response.data.email);
        setValue("plan", response.data.plan);
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
        setValue("status", response.data.status);
        setValue("email", response.data.email);
      } catch (error) {
        console.error("Error fetching tenant data: ", error);
        toast.error("Error fetching tenant data");
      }
    },
    [setValue]
  );

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: TenantFormInputs) => {
    try {
      if (isModeEdit) {
        try {
          const protocol = window.location.protocol;
          const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant/${id}`;

          const response = await axios.patch(backendUrl, data);
          console.log("response: ", response);

          if (response.status === 201) {
            router.push("/secure/tenants");
          }

          toast.success("Tenant actualizado con éxito");
        } catch (error) {
          handleError(error);
        }
        return;
      } else {
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/tenant`;

        const response = await axios.post(backendUrl, data);

        console.log("Response:", response);

        if (response.status === 201) {
          toast.success("Tenant registrado con éxito");
          router.push(`/secure/tenants/tenant/${response.data.id}`);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="pb-2">
            <h3 className="text-lg font-bold">Información General</h3>
            <h3 className="text-sm font-normal text-gray-500">
              Información básica sobre el tenant
            </h3>
          </div>
          <div>
            {isModeEdit && (
              <div>
                <label
                  htmlFor="ruc"
                  className="block text-sm font-medium text-gray-900"
                >
                  ID: <strong>{id}</strong>
                </label>
              </div>
            )}
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
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
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Nombre de la organización
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="name"
                  autoComplete="name"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("name", {
                    required: "El nombre de la organización es obligatoria",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="subdomain"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Subdominio
              </label>
              <div className="mt-2">
                <input
                  id="subdomain"
                  type="subdomain"
                  autoComplete="subdomain"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.subdomain ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("subdomain", {
                    required: "El dominio es obligatorio",
                  })}
                />
                {errors.subdomain && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subdomain.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="plan"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Plan
              </label>
              <div className="mt-2">
                <select
                  id="plan"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.plan ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("plan", {
                    required: "El plan es obligatorio",
                  })}
                >
                  <option value="">Selecciona un plan</option>
                  <option value="free">Free</option>
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                {errors.plan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.plan.message}
                  </p>
                )}
              </div>
            </div>
            <div className="pb-2 mt-4">
              <h3 className="text-lg font-bold">Información Fiscal</h3>
              <h3 className="text-sm font-normal text-gray-500">
                Información fiscal del tenant
              </h3>
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("tradeName")}
                />
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("establishmentNumber")}
                />
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
                  <p className="text-sm text-gray-500">
                    Contribuyente Especial.
                  </p>
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
                </div>
                {watch("rimpeRegimeTaxpayer") && (
                  <div>
                    <div className="mt-2">
                      <select
                        id="rimpe"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                          errors.rimpe ? "border-red-500" : "border-gray-300"
                        }`}
                        {...register("rimpe", {
                          required: "El campo es obligatorio",
                        })}
                      >
                        <option value="rimpe">
                          Contribuyente Régimen RIMPE
                        </option>
                        <option value="rimpeNegocioPopular">
                          Contribuyente Negocio Popular - Régimen RIMPE
                        </option>
                      </select>
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("city")}
                />
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("phone")}
                />
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
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("address")}
                />
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
                    Logo
                  </button>
                  <input
                    id="logo"
                    type="text"
                    autoComplete="off"
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("logo")}
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("email")}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <CheckIcon aria-hidden="true" className="mr-2 h-5 w-5" />
              {isModeEdit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TenantForm;
