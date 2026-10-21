"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { href: "/tasks", label: "To do list" },
  { href: "/projects", label: "Dự án" },
  { href: "/schedule", label: "Thời khóa biểu" },
  { href: "/pomodoro", label: "Pomodoro" },
] as const;

type AppHeaderProps = {
  active: (typeof navigation)[number]["href"];
};

export default function AppHeader({ active }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setLogoutError("");
    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        setLogoutError(error.message);
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Vui lòng thử lại.",
      );
    }
  }

  const fullName = user?.user_metadata.full_name;
  const metadataName = user?.user_metadata.name;
  const displayName =
    (typeof fullName === "string" && fullName) ||
    (typeof metadataName === "string" && metadataName) ||
    user?.email ||
    "Tài khoản";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-container-high bg-surface-container-lowest shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-2 px-gutter-mobile py-2 sm:px-gutter md:px-margin">
        <div className="flex min-w-0 items-center gap-space-lg">
          <Link
            className="flex shrink-0 items-center gap-space-xs text-lg font-bold tracking-tight text-primary sm:text-xl"
            href="/tasks"
          >
            <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path d="m2.5 9.5 9.5-5 9.5 5-9.5 5-9.5-5Z" fill="currentColor" />
              <path
                d="M6 11.5v5.2c3.8 2.6 8.2 2.6 12 0v-5.2m3.5-2v6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <span className="hidden sm:inline">Việc học của tôi</span>
          </Link>
          <nav
            aria-label="Điều hướng chính"
            className="flex items-center gap-3 overflow-x-auto text-sm sm:gap-5"
          >
            {navigation.map((item) => (
              <Link
                aria-current={active === item.href ? "page" : undefined}
                className={`whitespace-nowrap border-b-2 py-2 transition-colors ${
                  active === item.href
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-sm rounded-full border border-surface-container-high bg-surface-container-low py-1 pl-2 pr-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-sm font-semibold text-primary"
            >
              {displayName.slice(0, 1).toLocaleUpperCase("vi")}
            </span>
            <div className="hidden flex-col text-left sm:flex">
              <span className="text-sm font-semibold leading-tight text-on-surface">
                {displayName}
              </span>
              <span className="text-[11px] text-outline">{user?.email}</span>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-space-xs rounded-lg border border-surface-container-high bg-surface-container-lowest px-2 py-1.5 text-sm font-semibold text-on-surface transition-colors hover:border-error-container hover:bg-error-container/20 hover:text-error sm:px-3"
            onClick={handleSignOut}
            type="button"
          >
            <span aria-hidden="true">⇥</span>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
        {logoutError && (
          <p className="px-gutter-mobile pb-2 text-right text-xs text-error" role="alert">
            Không thể đăng xuất: {logoutError}
          </p>
        )}
      </div>
    </header>
  );
}
