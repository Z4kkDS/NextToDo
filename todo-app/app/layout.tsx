import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { TodoProvider } from "@/context/TodoContext";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexToDo - Gestión de Tareas Inteligente",
  description:
    "Organiza y optimiza tus tareas con NexToDo. Aplicación moderna con autenticación, prioridades, estadísticas y sincronización en tiempo real.",
  keywords: ["todo", "tareas", "productividad", "Next.js", "Firebase"],
  authors: [{ name: "ZakkDev" }],
  openGraph: {
    title: "NexToDo - Gestión de Tareas",
    description: "Organiza tus tareas de manera inteligente y productiva",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TodoProvider>
              {children}
              <Toaster />
            </TodoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
