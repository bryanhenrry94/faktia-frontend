"use client";

export default function HeroSections() {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Presentamos la solución ideal para tu negocio.{" "}
              <a href="#" className="font-semibold text-teal-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Descubre más <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Gestiona tu negocio
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Nuestro software de facturación para pymes te ayuda a gestionar tu
              negocio de manera eficiente. Ideal para tiendas, restaurantes,
              ferreterías, ópticas y más.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="login"
                className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Comienza ahora
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                Más información <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
