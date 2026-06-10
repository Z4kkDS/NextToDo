import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Proxy del handler de Firebase Auth para servirlo desde el mismo dominio.
  // Con authDomain = <proyecto>.firebaseapp.com el popup/iframe de login corre
  // en un dominio de terceros y los navegadores que particionan almacenamiento
  // (Chrome/Safari) impiden que la credencial vuelva a la app (el login se
  // queda colgado con avisos de Cross-Origin-Opener-Policy en consola).
  // Sirviendo /__/auth desde el propio dominio el flujo es same-origin.
  // Requiere NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = dominio de producción.
  // Ref: https://firebase.google.com/docs/auth/web/redirect-best-practices
  async rewrites() {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) return [];
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${projectId}.firebaseapp.com/__/auth/:path*`,
      },
      {
        source: "/__/firebase/:path*",
        destination: `https://${projectId}.firebaseapp.com/__/firebase/:path*`,
      },
    ];
  },
};

export default nextConfig;
