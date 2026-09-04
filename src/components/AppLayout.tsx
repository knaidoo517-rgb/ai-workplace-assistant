import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  MessagesSquare,
  ShieldCheck,
  Menu,
  X,
  Moon,
  Sun,
  Bot,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/chatbot", label: "AI Workplace Chatbot", icon: MessagesSquare },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers =
      stored === "dark" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(prefers);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return {
    dark,
    toggle: () =>
      setDark((value) => {
        localStorage.setItem("theme", value ? "light" : "dark");
        return !value;
      }),
  };
}

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">AI Workplace</p>
            <p className="text-xs opacity-70">Productivity Assistant</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-90 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className:
                  "bg-sidebar-primary text-sidebar-primary-foreground opacity-100 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              }}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <p className="border-t border-sidebar-border px-5 py-4 text-xs opacity-70">
          No sign-in needed. Nothing you type is stored.
        </p>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {description}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
