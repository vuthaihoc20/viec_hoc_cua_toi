"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";

const studyTasks = [
  "Làm bài tập trắc nghiệm Toán giải tích chương 2",
  "Ôn tập 50 từ vựng tiếng Anh bài Unit 8",
  "Hoàn thiện báo cáo thí nghiệm Hóa học hữu cơ",
];

type TimerMode = "focus" | "break";

export default function PomodoroDashboard() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [activeTask, setActiveTask] = useState(studyTasks[0]);
  const [message, setMessage] = useState("");
  const duration = mode === "focus" ? 25 * 60 : breakDuration;
  const progress = duration ? ((duration - remaining) / duration) * 100 : 0;

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setTimeout(() => {
      if (remaining > 1) {
        setRemaining(remaining - 1);
        return;
      }

      setIsRunning(false);
      if (mode === "focus") {
        const nextSession = completedSessions + 1;
        const nextBreak = nextSession % 4 === 0 ? 15 * 60 : 5 * 60;
        setCompletedSessions(nextSession);
        setBreakDuration(nextBreak);
        setMode("break");
        setRemaining(nextBreak);
        setMessage(
          nextSession % 4 === 0
            ? "Hoàn thành 4 phiên tập trung! Đã đến lúc nghỉ dài 15 phút."
            : "Tuyệt vời! Bạn đã hoàn thành một phiên Pomodoro. Hãy nghỉ ngơi nhé.",
        );
        return;
      }

      setMode("focus");
      setRemaining(25 * 60);
      setMessage("Hết giờ nghỉ ngơi. Sẵn sàng cho phiên tập trung mới!");
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [completedSessions, isRunning, mode, remaining]);

  function chooseMode(nextMode: TimerMode) {
    setIsRunning(false);
    setMode(nextMode);
    setRemaining(nextMode === "focus" ? 25 * 60 : breakDuration);
    setMessage("");
  }

  function resetTimer() {
    setIsRunning(false);
    setRemaining(duration);
    setMessage("");
  }

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <AppHeader active="/pomodoro" />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-gutter-mobile py-space-xl sm:px-gutter md:px-margin">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface">
              Đồng hồ Pomodoro tập trung
            </h1>
          </div>
          <div className="rounded-full border border-surface-container-high bg-white px-4 py-2 text-sm">
            Hôm nay:{" "}
            <strong className="text-secondary">{completedSessions}/4</strong>{" "}
            phiên hoàn thành
          </div>
        </div>

        <section className="flex flex-col justify-between gap-4 rounded-xl border border-surface-container-high bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-xs text-on-surface-variant">
              Đang tập trung cho mục tiêu:
            </p>
            <p className="mt-1 truncate font-semibold text-on-surface">
              {activeTask}
            </p>
          </div>
          <label className="shrink-0 text-sm font-medium text-on-surface-variant">
            <span className="sr-only">Đổi công việc</span>
            <select
              className="max-w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              onChange={(event) => setActiveTask(event.target.value)}
              value={activeTask}
            >
              {studyTasks.map((task) => (
                <option key={task} value={task}>
                  {task}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-surface-container-high bg-white px-4 py-8 text-center shadow-sm sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-1.5 ${
              mode === "focus" ? "bg-primary-container" : "bg-secondary"
            }`}
          />
          <div
            aria-label="Chọn chế độ Pomodoro"
            className="mx-auto inline-flex rounded-full bg-surface-container p-1"
            role="group"
          >
            <button
              aria-pressed={mode === "focus"}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                mode === "focus"
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant"
              }`}
              onClick={() => chooseMode("focus")}
              type="button"
            >
              Tập trung (25:00)
            </button>
            <button
              aria-pressed={mode === "break"}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                mode === "break"
                  ? "bg-white text-secondary shadow-sm"
                  : "text-on-surface-variant"
              }`}
              onClick={() => chooseMode("break")}
              type="button"
            >
              Nghỉ ({formatTime(breakDuration)})
            </button>
          </div>

          <p className="mt-6 inline-flex rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-primary">
            {mode === "focus"
              ? "Đang trong phiên tập trung"
              : "Thời gian nghỉ ngơi phục hồi"}
          </p>

          <div className="relative mx-auto my-5 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 240 240"
            >
              <circle
                cx="120"
                cy="120"
                fill="transparent"
                r="102"
                stroke="#e6e8ea"
                strokeWidth="12"
              />
              <circle
                cx="120"
                cy="120"
                fill="transparent"
                r="102"
                stroke={mode === "focus" ? "#4f46e5" : "#006c49"}
                strokeDasharray={2 * Math.PI * 102}
                strokeDashoffset={(2 * Math.PI * 102 * (100 - progress)) / 100}
                strokeLinecap="round"
                strokeWidth="12"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div>
              <p className="text-5xl font-bold tabular-nums tracking-tight text-on-surface sm:text-6xl">
                {formatTime(remaining)}
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                {mode === "focus"
                  ? "Giữ sự tập trung cao độ"
                  : "Thư giãn và nạp lại năng lượng"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-xl bg-primary-container px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary disabled:opacity-60"
              disabled={remaining === 0}
              onClick={() => {
                setMessage("");
                setIsRunning(true);
              }}
              type="button"
            >
              {isRunning
                ? "Đang chạy"
                : remaining < duration
                  ? "Tiếp tục"
                  : "▶ Bắt đầu"}
            </button>
            <button
              className="rounded-xl border border-outline-variant bg-white px-6 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low disabled:opacity-50"
              disabled={!isRunning}
              onClick={() => setIsRunning(false)}
              type="button"
            >
              Tạm dừng
            </button>
            <button
              aria-label="Đặt lại đồng hồ"
              className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
              onClick={resetTimer}
              title="Đặt lại về ban đầu"
              type="button"
            >
              ↻
            </button>
          </div>
          <p aria-live="polite" className="mt-4 min-h-5 text-sm text-secondary">
            {message}
          </p>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-surface-container-high pt-5 text-sm text-on-surface-variant sm:flex-row">
            <div className="flex items-center gap-2">
              <span>Tiến độ đợt học:</span>
              <div
                aria-label={`${completedSessions % 4} trên 4 phiên trong đợt`}
                className="flex gap-1.5"
              >
                {Array.from({ length: 4 }, (_, index) => {
                  const complete = index < completedSessions % 4;
                  const current = index === completedSessions % 4;
                  return (
                    <span
                      aria-label={
                        complete
                          ? `Phiên ${index + 1} đã hoàn thành`
                          : current
                            ? `Phiên ${index + 1} hiện tại`
                            : `Phiên ${index + 1} chưa bắt đầu`
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                        complete
                          ? "border-secondary/30 bg-secondary-fixed text-secondary"
                          : current
                            ? "border-primary/40 bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface-container-low text-outline"
                      }`}
                      key={index}
                      role="img"
                    >
                      {complete ? "✓" : current ? "◷" : "○"}
                    </span>
                  );
                })}
              </div>
            </div>
            <span>Nghỉ dài (15 phút) sau mỗi 4 phiên hoàn tất</span>
          </div>
        </section>

        <section className="rounded-xl border border-surface-container-high bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-on-surface-variant">
              Tiến độ hoàn thành nhiệm vụ
            </span>
            <span className="font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
        <aside className="rounded-xl border border-surface-container-high bg-white p-4 text-sm leading-6 text-on-surface-variant shadow-sm">
          <strong className="text-on-surface">Mẹo tập trung:</strong> Chia nhỏ
          các bài tập dài thành những phiên tập trung 25 phút xen kẽ thời gian
          nghỉ ngắn.
        </aside>
      </main>
    </>
  );
}
