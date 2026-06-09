import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { TodoProvider } from "@/context/TodoContext";
import type { Metadata, Viewport } from "next";
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
  keywords: ["todo", "tareas", "productividad", "finanzas", "Next.js", "Firebase"],
  authors: [{ name: "ZakkDev" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NexToDo",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "NexToDo - Gestión de Tareas",
    description: "Organiza tus tareas de manera inteligente y productiva",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#161310" },
  ],
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
              <GamificationProvider>
                <FinanceProvider>
                  <OnboardingProvider>
                    {children}
                    <OnboardingTour />
                    <Toaster />
                    <ServiceWorkerRegister />
                  </OnboardingProvider>
                </FinanceProvider>
              </GamificationProvider>
            </TodoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
