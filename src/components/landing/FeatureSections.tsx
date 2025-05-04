import React from "react";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

const features = [
  {
    name: "Facturación electrónica simplificada.",
    description:
      "Automatiza la emisión de facturas electrónicas cumpliendo con las normativas legales, ideal para pequeñas y medianas empresas.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Seguridad avanzada.",
    description:
      "Protege los datos de tu negocio con certificados SSL y encriptación de última generación.",
    icon: LockClosedIcon,
  },
  {
    name: "Respaldo de datos.",
    description:
      "Realiza copias de seguridad automáticas de tus transacciones para garantizar la continuidad de tu negocio.",
    icon: ServerIcon,
  },
];

export default function FeatureSection() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-teal-600">
                Optimiza tu negocio
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Soluciones para facturación electrónica
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Nuestro software está diseñado para facilitar la gestión de
                facturación electrónica en restaurantes, ferreterías, ópticas y
                puntos de venta, ayudándote a cumplir con las normativas y
                mejorar la eficiencia.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-teal-600"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            alt="Product screenshot"
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
