"use client";

import { useState, type FormEvent } from "react";

type TaskFormProps = {
  onAdd: (title: string) => Promise<void>;
};

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      setError("Vui lòng nhập tên công việc.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onAdd(newTitle);
      setTitle("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? `Không thể thêm công việc: ${submitError.message}`
          : "Không thể thêm công việc. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mb-space-lg">
      <form
        className="custom-shadow-card flex flex-col items-stretch gap-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest p-2.5 transition-all focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 sm:flex-row sm:p-3"
        onSubmit={handleSubmit}
      >
        <label className="relative flex flex-grow items-center pl-2">
          <span aria-hidden="true" className="absolute left-3 text-xl text-outline">
            ✎
          </span>
          <span className="sr-only">Tên công việc mới</span>
          <input
            aria-describedby={error ? "task-title-error" : undefined}
            aria-invalid={Boolean(error)}
            className="w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-sm text-on-surface placeholder:text-outline focus:ring-0"
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (nextTitle.trim()) setError("");
            }}
            placeholder="Nhập tên công việc học tập mới (ví dụ: Làm bài tập Toán trang 45, Đọc chương 3 Lịch sử)..."
            type="text"
            value={title}
          />
        </label>
        <button
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all duration-150 hover:bg-primary hover:shadow active:scale-95"
          disabled={isSubmitting}
          type="submit"
        >
          <span aria-hidden="true" className="text-lg font-bold">＋</span>
          <span>{isSubmitting ? "Đang thêm..." : "Thêm công việc"}</span>
        </button>
      </form>
      {error && (
        <p
          aria-live="polite"
          className="mt-2 rounded-lg bg-error-container px-4 py-3 text-sm text-error"
          id="task-title-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
