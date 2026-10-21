"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up" | "reset-password";
type LoginFormProps = {
  initialError?: string;
};

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export default function LoginForm({ initialError = "" }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = createClient();

      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/tasks");
        router.refresh();
        return;
      }

      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/tasks`,
          },
        });
        if (error) throw error;

        if (data.session) {
          router.replace("/tasks");
          router.refresh();
          return;
        }

        setMessage("Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setMessage("Đã gửi liên kết đặt lại mật khẩu. Hãy kiểm tra email của bạn.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể thực hiện yêu cầu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setErrorMessage("");
  }

  const isReset = mode === "reset-password";
  const isSignUp = mode === "sign-up";
  const title = isReset
    ? "Đặt lại mật khẩu"
    : isSignUp
      ? "Tạo tài khoản"
      : "Đăng nhập tài khoản";

  return (
    <main className="relative z-10 flex flex-grow items-center justify-center px-3 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-[440px]">
        <section className="custom-shadow-card rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 sm:p-8">
          <div className="mb-6 text-center">
            <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary shadow-sm">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 5.5c2.7-.9 5.3-.5 8 1.1v13c-2.7-1.6-5.3-2-8-1.1v-13Zm16 0c-2.7-.9-5.3-.5-8 1.1v13c2.7-1.6 5.3-2 8-1.1v-13Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <path
                  d="M7 9c1.2-.2 2.3 0 3.5.6M7 12c1.2-.2 2.3 0 3.5.6m6.5-3.6c-1.2-.2-2.3 0-3.5.6m3.5 2.4c-1.2-.2-2.3 0-3.5.6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-on-surface">
              {title}
            </h1>
            <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-on-surface-variant">
              Không gian ghi chú và theo dõi tiến độ học tập mỗi ngày
            </p>
          </div>

          {!supabaseConfigured && (
            <p
              className="mb-4 rounded-lg bg-error-container px-4 py-3 text-sm text-error"
              role="alert"
            >
              Chưa cấu hình Supabase. Hãy tạo file .env.local từ .env.example,
              điền URL và Publishable key rồi khởi động lại ứng dụng.
            </p>
          )}

          <form
            autoComplete="on"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1">
              <label
                className="block text-sm font-semibold text-on-surface"
                htmlFor="login-email"
              >
                Địa chỉ Email
              </label>
              <input
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 text-sm text-on-surface shadow-sm outline-none transition placeholder:text-outline/70 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                id="login-email"
                name="email"
                placeholder="vidu@sinhvien.edu.vn"
                required
                type="email"
              />
            </div>

            {!isReset && (
              <div className="space-y-1">
                <label
                  className="block text-sm font-semibold text-on-surface"
                  htmlFor="login-password"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    className="h-11 w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-3 pr-11 text-sm text-on-surface shadow-sm outline-none transition placeholder:text-outline/70 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                    id="login-password"
                    minLength={6}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                    className="absolute right-0 top-0 flex h-11 items-center px-3 text-outline transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>
            )}

            {mode === "sign-in" && (
              <div className="flex justify-end pt-1">
                <button
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => changeMode("reset-password")}
                  type="button"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-container text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary hover:shadow active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !supabaseConfigured}
              type="submit"
            >
              <span>
                {isSubmitting
                  ? "Đang xử lý..."
                  : isReset
                    ? "Gửi liên kết đặt lại"
                    : isSignUp
                      ? "Đăng ký"
                      : "Đăng nhập"}
              </span>
            </button>
            {errorMessage && (
              <p
                aria-live="assertive"
                className="rounded-lg bg-error-container px-4 py-3 text-sm text-error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            {message && (
              <p
                aria-live="polite"
                className="rounded-lg bg-secondary-fixed px-4 py-3 text-sm text-on-surface-variant"
                role="status"
              >
                {message}
              </p>
            )}
          </form>

          <div className="mt-4 border-t border-surface-container-high pt-4 text-center">
            <p className="text-xs text-on-surface-variant">
              {isReset ? (
                <button
                  className="font-semibold text-primary hover:underline"
                  onClick={() => changeMode("sign-in")}
                  type="button"
                >
                  Quay lại đăng nhập
                </button>
              ) : (
                <>
                  {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                  <button
                    className="ml-1 font-semibold text-primary transition-colors hover:text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() =>
                      changeMode(isSignUp ? "sign-in" : "sign-up")
                    }
                    type="button"
                  >
                    {isSignUp ? "Đăng nhập" : "Đăng ký ngay"}
                  </button>
                </>
              )}
            </p>
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-outline">
          Tài khoản được xác thực an toàn bằng Supabase Auth.
        </p>
      </div>
    </main>
  );
}
