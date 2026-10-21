"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { createClient } from "@/lib/supabase/client";
import type { Task, TaskFilter } from "@/types/task";

const filterOptions: { key: TaskFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Chưa xong" },
  { key: "completed", label: "Đã xong" },
];

function mapTask(row: {
  id: string;
  title: string;
  completed: boolean;
  subject: string | null;
  due_at: string | null;
  urgent: boolean;
}): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    subject: row.subject ?? undefined,
    dueDate: row.due_at
      ? new Date(row.due_at).toLocaleDateString("vi-VN")
      : undefined,
    urgent: row.urgent,
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Vui lòng thử lại.";
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const completedCount = tasks.filter((task) => task.completed).length;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setIsLoading(true);
      setError("");

      try {
        const { data, error: loadError } = await createClient()
          .from("tasks")
          .select("id, title, completed, subject, due_at, urgent")
          .order("created_at", { ascending: false });

        if (loadError) throw loadError;
        if (isMounted) setTasks((data ?? []).map(mapTask));
      } catch (loadError) {
        if (isMounted) {
          setError(`Không thể tải công việc: ${errorMessage(loadError)}`);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadTasks();
    return () => {
      isMounted = false;
    };
  }, [reloadCount]);

  async function addTask(title: string) {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("Vui lòng đăng nhập lại để thêm công việc.");

    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({ user_id: user.id, title })
      .select("id, title, completed, subject, due_at, urgent")
      .single();

    if (insertError) throw insertError;
    setTasks((currentTasks) => [mapTask(data), ...currentTasks]);
  }

  async function toggleTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    try {
      const { data, error: updateError } = await createClient()
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", id)
        .select("id, title, completed, subject, due_at, urgent")
        .single();

      if (updateError) throw updateError;
      const updatedTask = mapTask(data);
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === id ? updatedTask : item)),
      );
      setError("");
    } catch (updateError) {
      setError(`Không thể cập nhật công việc: ${errorMessage(updateError)}`);
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error: deleteError } = await createClient()
        .from("tasks")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

      if (deleteError) throw deleteError;
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      setError("");
    } catch (deleteError) {
      setError(`Không thể xóa công việc: ${errorMessage(deleteError)}`);
    }
  }

  async function renameTask(id: string, title: string) {
    try {
      const { data, error: updateError } = await createClient()
        .from("tasks")
        .update({ title })
        .eq("id", id)
        .select("id, title, completed, subject, due_at, urgent")
        .single();

      if (updateError) throw updateError;
      const updatedTask = mapTask(data);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
      setError("");
      return true;
    } catch (updateError) {
      setError(`Không thể đổi tên công việc: ${errorMessage(updateError)}`);
      return false;
    }
  }

  function countFor(filterKey: TaskFilter) {
    if (filterKey === "active") {
      return tasks.length - completedCount;
    }
    if (filterKey === "completed") {
      return completedCount;
    }
    return tasks.length;
  }

  return (
    <>
      <AppHeader active="/tasks" />

      <main className="mx-auto w-full max-w-4xl flex-grow px-gutter-mobile py-space-xl sm:px-gutter md:px-margin">
        <section className="mb-space-lg">
          <div className="mb-space-md flex flex-col justify-between gap-space-sm sm:flex-row sm:items-end">
            <div>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-on-surface">
                Hôm nay cần tập trung gì?
              </h1>
            </div>
            <div className="custom-shadow-card inline-flex self-start items-center gap-1.5 rounded-full border border-surface-container-high bg-surface-container-lowest px-3 py-1 sm:self-auto">
              <span aria-hidden="true" className="text-base text-secondary">
                ✓
              </span>
              <span className="text-sm font-semibold text-on-surface">
                Hôm nay:{" "}
                <strong className="text-secondary">
                  {completedCount}/{tasks.length}
                </strong>{" "}
                công việc hoàn thành
              </span>
            </div>
          </div>
          <div className="custom-shadow-card rounded-xl border border-surface-container-high bg-surface-container-lowest p-space-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span aria-hidden="true" className="text-primary">
                  ↗
                </span>
                Tiến độ hoàn thành nhiệm vụ
              </span>
              <span className="text-sm font-bold text-primary">
                {progress}%
              </span>
            </div>
            <div
              aria-label={`Tiến độ hoàn thành ${progress}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-container to-secondary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <TaskForm onAdd={addTask} />

        {error && (
          <div
            aria-live="polite"
            className="mb-space-md rounded-lg bg-error-container px-4 py-3 text-sm text-error"
            role="alert"
          >
            <p>{error}</p>
            {!isLoading && tasks.length === 0 && (
              <button
                className="mt-2 font-semibold underline"
                onClick={() => setReloadCount((count) => count + 1)}
                type="button"
              >
                Tải lại danh sách
              </button>
            )}
          </div>
        )}

        <section className="mb-space-md flex flex-wrap items-center justify-between gap-2">
          <div
            aria-label="Lọc công việc"
            className="inline-flex rounded-full border border-surface-container-high bg-surface-container-high/60 p-1"
            role="group"
          >
            {filterOptions.map((option) => {
              const isSelected = filter === option.key;
              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-150 sm:px-4 ${
                    isSelected
                      ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold leading-none ${
                      isSelected
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {countFor(option.key)}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="hidden text-[11px] text-outline sm:block">
            Sắp xếp theo hạn chót
          </span>
        </section>

        {isLoading ? (
          <p
            aria-live="polite"
            className="py-8 text-center text-sm text-outline"
          >
            Đang tải công việc...
          </p>
        ) : (
          <TaskList
            filter={filter}
            onDelete={deleteTask}
            onRename={renameTask}
            onToggle={toggleTask}
            tasks={tasks}
          />
        )}

        <aside className="mt-space-xl flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface-container-low/60 p-space-md">
          <svg
            aria-hidden="true"
            className="h-7 w-7 shrink-0 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 18h6m-5 3h4m-2-20a7 7 0 0 0-4 12.7c.7.5 1 1.2 1 2.3h6c0-1.1.3-1.8 1-2.3A7 7 0 0 0 12 1Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          <p className="text-xs text-on-surface-variant">
            <strong className="font-semibold text-on-surface">
              Mẹo học tập:
            </strong>{" "}
            Chia nhỏ các bài tập dài thành các phiên tập trung 25 phút
            (Pomodoro) giúp tăng tốc độ hoàn thành lên đến 40%.
          </p>
        </aside>
      </main>

      <footer className="mt-auto border-t border-surface-container-high bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-space-sm px-gutter py-space-md sm:flex-row">
          <p className="text-center text-xs text-outline sm:text-left">
            © 2026 Việc học của tôi. Không gian rèn luyện tri thức tập trung.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-outline sm:gap-6">
            <span>Hướng dẫn sử dụng</span>
            <span>Điều khoản</span>
            <span>Hỗ trợ học tập</span>
          </div>
        </div>
      </footer>
    </>
  );
}
