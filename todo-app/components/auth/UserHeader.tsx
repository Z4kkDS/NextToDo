"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { CheckSquare, HelpCircle, LogOut, User } from "lucide-react";
import Image from "next/image";

export function UserHeader() {
  const { user, logout } = useAuth();
  const { startTour } = useOnboarding();

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base tracking-tight">NexToDo</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-200 p-0 cursor-pointer"
                aria-label="Menú de usuario"
              >
                {user.photoURL?.trim() ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "Usuario"}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-primary">{initials}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <div className="flex items-center gap-3 p-3">
                {/* Mini avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                  {user.photoURL?.trim() ? (
                    <Image
                      src={user.photoURL}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  {user.displayName && (
                    <p className="font-semibold text-sm truncate">{user.displayName}</p>
                  )}
                  {user.email && (
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  )}
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={startTour} className="cursor-pointer gap-2">
                <HelpCircle className="h-4 w-4" />
                Ver tutorial
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
