"use client";
import React from "react";
import { useAxiosErrorHandler } from "@/hooks/useAxiosErrorHandler";
import { toast } from "react-toastify"; // si usas toast
import { ElectronicInvoicingConfigFormInput } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSubdomain } from "@/hooks/useSubdomain";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const ElectronicInvoicingConfigForm = () => {
  const subdomain = useSubdomain();
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ElectronicInvoicingConfigFormInput>();

  const handleError = useAxiosErrorHandler({
    display: "toast", // o "toast" o "console"
    toast: (msg) => toast.error(msg),
  });

  const onSubmit = async (data: ElectronicInvoicingConfigFormInput) => {
    try {
      const protocol = window.location.protocol;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const formattedData = {
        ...data,
        certificateExpiryDate: new Date(
          data.certificateExpiryDate
        ).toISOString(),
      };
      console.log("data: ", formattedData);

      if (id) {
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/electronic-invoicing-config/${id}`;
        const response = await axios.patch(backendUrl, formattedData, {
          headers,
        });

        console.log("response: ", response);

        if (response.status === 201) {
          router.push("/secure/settings");
        }
        toast.success("Configuración actualizada con éxito");
      } else {
        const backendUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/electronic-invoicing-config`;
        const response = await axios.post(backendUrl, formattedData, {
          headers,
        });

        console.log("response: ", response);

        if (response.status === 201) {
          router.push("/secure/settings");
        }
        toast.success("Configuración registrada con éxito");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchOrganizationData = React.useCallback(async () => {
    try {
      const backendUrl = `${window.location.protocol}//${process.env.NEXT_PUBLIC_API_HOST}/api/v1/electronic-invoicing-config`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tenant-Subdomain": subdomain,
      };

      const response = await axios.get(backendUrl, { headers });
      console.log("Electronic invoicing conf. data: ", response.data);

      setId(response.data.id);

      setValue("digitalCertificate", response.data.digitalCertificate);
      setValue("certificatePassword", response.data.certificatePassword);

      setValue(
        "certificateExpiryDate",
        dayjs(response.data.certificateExpiryDate).toDate()
      );
      setValue("issuancePoints", response.data.issuancePoints);
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
            <h3 className="text-lg font-bold">Facturación Electrónica</h3>
            <h3 className="text-sm font-normal text-gray-500">
              Información para la facturación electrónica
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
              Firma Electrónica:
            </label>
            <p className="text-sm text-gray-500">
              Firma Electrónica del Representante Legal
            </p>
            <div className="mt-2 flex items-center space-x-4 sm:w-lg">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Subir
              </button>
              <input
                id="digitalCertificate"
                type="file"
                autoComplete="off"
                placeholder="Firma Electrónica"
                lang="es"
                className={`block flex-1  rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.digitalCertificate
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("digitalCertificate", {
                  required: "La firma electrónica es obligatoria",
                })}
              />
              {errors.digitalCertificate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.digitalCertificate.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="certificateExpiryDate"
              className="block text-sm font-medium text-gray-900"
            >
              Fecha Exp. Firma Electrónica:
            </label>
            {dayjs(watch("certificateExpiryDate")).format("DD/MM/YYYY")}
            <div className="mt-2">
              <input
                id="certificateExpiryDate"
                type="date"
                autoComplete="off"
                className={`block w-full sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.certificateExpiryDate
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("certificateExpiryDate", {
                  required: "La fecha de expiración es obligatoria",
                })}
              />
              {errors.certificateExpiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.certificateExpiryDate.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="certificatePassword"
              className="block text-sm font-medium text-gray-900"
            >
              Clave Firma Electrónica:
            </label>
            <div className="mt-2">
              <input
                id="certificatePassword"
                type="password"
                autoComplete="off"
                className={`block w-full sm:w-lg rounded-md bg-gray-50 px-4 py-2 text-base text-gray-800 border ${
                  errors.certificatePassword
                    ? "border-red-500 focus:outline-red-500"
                    : "border-gray-300 focus:outline-teal-600"
                } placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500`}
                {...register("certificatePassword", {
                  required: "La clave de la firma electrónica es obligatoria",
                })}
              />
              {errors.certificatePassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.certificatePassword.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="establishmentNumber"
              className="block text-sm font-medium text-gray-900"
            >
              Establecimiento - Punto Emisión por defecto
            </label>
            <p className="text-sm text-gray-500">
              Número de establecimiento asignado por el SRI ejemplo: 001, 002,
              003, etc.
            </p>
            <div className="mt-2">detalle de establecimiento</div>
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-900"
            >
              Secuencia inicial de Documentos Electrónicos:
            </label>
            <div className="mt-2">
              detalle de secuencia inicial de documentos electrónicos
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

export default ElectronicInvoicingConfigForm;
