"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirm-password") ?? "");

    if (password !== confirmation) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      router.replace("/tasks");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-grow items-center justify-center px-4 py-10">
      <section className="custom-shadow-card w-full max-w-md rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-on-surface">
          Tạo mật khẩu mới
        </h1>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          Nhập mật khẩu mới cho tài khoản của bạn.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm font-semibold text-on-surface">
            Mật khẩu mới
            <input
              autoComplete="new-password"
              className="h-11 w-full rounded-lg border border-outline-variant/60 px-3 font-normal"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <label className="block space-y-1 text-sm font-semibold text-on-surface">
            Nhập lại mật khẩu
            <input
              autoComplete="new-password"
              className="h-11 w-full rounded-lg border border-outline-variant/60 px-3 font-normal"
              minLength={6}
              name="confirm-password"
              required
              type="password"
            />
          </label>
          {errorMessage && (
            <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="h-11 w-full rounded-lg bg-primary-container text-sm font-semibold text-on-primary disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </section>
    </main>
  );
}
