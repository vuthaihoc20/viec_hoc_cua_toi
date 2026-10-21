"use client";

import { useState, type FormEvent } from "react";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => Promise<boolean>;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle) {
      return;
    }

    if (await onRename(task.id, nextTitle)) {
      setIsEditing(false);
    }
  }

  const badgeSubjectStyle =
    task.subject === "Hóa học"
      ? "bg-primary-fixed text-primary"
      : task.subject === "Tiếng Anh"
        ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
        : "bg-surface-container-high text-on-surface-variant";

  return (
    <article
      className={`custom-shadow-card group relative flex items-start gap-space-md overflow-hidden rounded-xl border p-space-md transition-all duration-150 hover:border-outline-variant ${
        task.completed
          ? "border-surface-container-high/80 bg-surface-container-lowest/80"
          : "border-surface-container-high bg-surface-container-lowest"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${
          task.completed
            ? "bg-secondary"
            : task.urgent
              ? "bg-tertiary"
              : "bg-primary-container"
        }`}
      />
      <label className="relative flex cursor-pointer select-none items-center pt-0.5">
        <input
          checked={task.completed}
          className="peer sr-only"
          onChange={() => onToggle(task.id)}
          type="checkbox"
        />
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/30 ${
            task.completed
              ? "border-secondary bg-secondary text-white"
              : "border-outline-variant bg-surface-container-lowest text-transparent peer-hover:border-primary"
          }`}
        >
          ✓
        </span>
        <span className="sr-only">
          {task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
        </span>
      </label>

      <div className="min-w-0 flex-grow">
        {isEditing ? (
          <form className="flex flex-wrap gap-2" onSubmit={handleSave}>
            <label className="sr-only" htmlFor={`edit-task-${task.id}`}>
              Sửa tên công việc
            </label>
            <input
              autoFocus
              className="min-w-40 flex-grow rounded-md border border-outline-variant bg-white px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              id={`edit-task-${task.id}`}
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
            <button
              className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-white"
              type="submit"
            >
              Lưu
            </button>
            <button
              className="rounded-md px-2 py-1 text-sm text-on-surface-variant hover:bg-surface-container-low"
              onClick={() => {
                setTitle(task.title);
                setIsEditing(false);
              }}
              type="button"
            >
              Hủy
            </button>
          </form>
        ) : (
          <>
            <h2
              className={`truncate text-sm font-semibold leading-snug ${
                task.completed
                  ? "text-outline line-through"
                  : "text-on-surface"
              }`}
            >
              {task.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {task.subject && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badgeSubjectStyle}`}
                >
                  <span aria-hidden="true">
                    {task.subject === "Hóa học"
                      ? "⚗"
                      : task.subject === "Tiếng Anh"
                        ? "◎"
                        : "▦"}
                  </span>
                  {task.subject}
                </span>
              )}
              {task.completed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed px-2.5 py-0.5 text-[11px] font-medium text-on-secondary-fixed-variant">
                  <span aria-hidden="true">✓✓</span>
                  Đã hoàn thành
                </span>
              ) : (
                task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                      task.urgent
                        ? "bg-error-container text-tertiary"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span aria-hidden="true">◷</span>
                    {task.dueDate}
                  </span>
                )
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1 self-center">
          <button
            aria-label={`Sửa ${task.title}`}
            className="rounded-lg p-2 text-outline transition-colors hover:bg-surface-container-low hover:text-primary"
            onClick={() => {
              setTitle(task.title);
              setIsEditing(true);
            }}
            title="Sửa công việc"
            type="button"
          >
            <span aria-hidden="true">✎</span>
          </button>
          <button
            aria-label={`Xóa ${task.title}`}
            className="rounded-lg p-2 text-outline transition-colors hover:bg-error-container/40 hover:text-error"
            onClick={() => onDelete(task.id)}
            title="Xóa công việc"
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 7h16M10 11v6m4-6v6M5.5 7l1 14h11l1-14M9 7V4h6v3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </button>
        </div>
      )}
    </article>
  );
}
