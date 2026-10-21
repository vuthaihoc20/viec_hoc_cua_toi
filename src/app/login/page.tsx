import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError =
    error === "auth-callback"
      ? "Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
      : "";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-on-surface">
      <div
        aria-hidden="true"
        className="login-ambient pointer-events-none fixed inset-0"
      />

      <header className="relative z-10 w-full px-4 pt-6 sm:px-8 md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link
            className="group flex items-center gap-2 text-primary"
            href="/tasks"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-on-primary shadow-sm transition-transform group-hover:scale-[0.98]">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m2.5 9.5 9.5-5 9.5 5-9.5 5-9.5-5Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M6 11.5v5.2c3.8 2.6 8.2 2.6 12 0v-5.2m3.5-2v6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">
              Việc học của tôi
            </span>
          </Link>

          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-secondary"
            />
            <span className="hidden sm:inline">
              Không gian học tập tập trung
            </span>
          </div>
        </div>
      </header>

      <LoginForm initialError={initialError} />

      <footer className="relative z-10 w-full border-t border-surface-container-high bg-surface-container-lowest/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:px-8 sm:text-left md:px-12">
          <p className="text-xs text-on-surface-variant">
            © 2026 Việc học của tôi. Không gian rèn luyện tri thức tập trung.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-outline sm:gap-6">
            <span>Hướng dẫn sử dụng</span>
            <span>Điều khoản</span>
            <span>Hỗ trợ học tập</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
