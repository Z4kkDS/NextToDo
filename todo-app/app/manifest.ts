import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NexToDo — Tareas y Finanzas",
    short_name: "NexToDo",
    description: "Organiza tus tareas y controla tus finanzas en un solo lugar.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#6366f1",
    lang: "es",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
