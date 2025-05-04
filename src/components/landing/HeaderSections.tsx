"use client";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function HeaderSections() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const CompanyName = "DAZZSOFT S.A.S.";

  const menus = [
    { name: "Inicio", href: "#" },
    { name: "Caracteristicas", href: "#" },
    { name: "Precios", href: "#" },
    { name: "Contacto", href: "#" },
  ];

  return (
    <header className="bg-white fixed top-0 left-0 w-full bg-opacity-90 backdrop-blur-md z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1 items-center">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">{CompanyName}</span>
            <Image
              alt={CompanyName}
              width={32}
              height={32}
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=600"
              className="h-8"
            />
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {CompanyName}
            </span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {menus.map((menu) => (
            <a
              key={menu.name}
              href={menu.href}
              className="text-sm/6 font-semibold text-gray-900"
            >
              {menu.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="login" className="text-sm/6 font-semibold text-gray-900">
            Ingresar <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          aria-hidden="true"
        />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">{CompanyName}</span>
              <Image
                alt={CompanyName}
                width={32}
                height={32}
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=600"
                className="h-8"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menus.map((menu) => (
                  <a
                    key={menu.name}
                    href={menu.href}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {menu.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Ingresar
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
