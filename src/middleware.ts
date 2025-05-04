import { NextRequest, NextResponse } from "next/server";

const LOCAL_DOMAINS = [
  "app.localhost:3000",
  "tenant1.localhost:3000",
  "tenant2.localhost:3000",
];

const AUTH_TOKEN = process.env.AUTH_TOKEN_COOKIE_NAME || "auth_token_faktia";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0]; // app, tenant1, tenant2

  console.log("🔍 Subdominio detectado:", subdomain);

  // Ruta protegida: solo usuarios autenticados deben acceder
  const privatePaths = ["/dashboard", "/admin"];
  const isProtected = privatePaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  const token = req.cookies.get(AUTH_TOKEN)?.value;
  // console.log("🔑 Token de autenticación:", token);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redireccionar a subdominio app.localhost si se visita localhost directamente
  if (host === "localhost:3000") {
    return NextResponse.redirect(
      new URL(req.url.toString().replace("localhost", "app.localhost"))
    );
  }

  // Validar subdominios conocidos (solo en local)
  if (!LOCAL_DOMAINS.includes(host)) {
    return NextResponse.redirect(new URL("http://app.localhost:3000"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"], // Excluye rutas estáticas y API
};
