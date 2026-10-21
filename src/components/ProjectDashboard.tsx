"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import AppHeader from "@/components/AppHeader";

type ProjectKind = "personal" | "team";
type ProjectPriority = "Cao" | "Trung bình" | "Bình thường";

type StudyProject = {
  id: number;
  name: string;
  description: string;
  kind: ProjectKind;
  subject: string;
  priority: ProjectPriority;
  progress: number;
  dueDate: string;
};

const storageKey = "viec-hoc-projects-v1";
const initialProjects: StudyProject[] = [
  {
    id: 1,
    name: "Nghiên cứu đề tài Khoa học Sinh viên 2025",
    description: "Nghiên cứu ứng dụng AI trong học tập và phân loại dữ liệu bài giảng số hóa.",
    kind: "personal",
    subject: "Nghiên cứu khoa học",
    priority: "Cao",
    progress: 65,
    dueDate: "2026-12-20",
  },
  {
    id: 2,
    name: "Ôn thi chứng chỉ IELTS 7.5 Target",
    description: "Luyện đề Listening và Writing theo tuần, kết hợp Speaking định kỳ.",
    kind: "personal",
    subject: "Tiếng Anh",
    priority: "Trung bình",
    progress: 40,
    dueDate: "2026-11-30",
  },
  {
    id: 3,
    name: "Bài tập lớn môn Phát triển Ứng dụng Web",
    description: "Xây dựng hệ thống quản lý học tập kết hợp theo dõi thời gian Pomodoro.",
    kind: "team",
    subject: "Phát triển Web",
    priority: "Cao",
    progress: 70,
    dueDate: "2026-10-30",
  },
  {
    id: 4,
    name: "Khảo sát thị trường Khởi nghiệp Xanh",
    description: "Khảo sát hành vi tiêu dùng sản phẩm tái chế của sinh viên.",
    kind: "team",
    subject: "Kỹ năng nghiên cứu",
    priority: "Bình thường",
    progress: 25,
    dueDate: "2026-12-05",
  },
];

const emptyForm = {
  name: "",
  description: "",
  kind: "personal" as ProjectKind,
  subject: "",
  priority: "Trung bình" as ProjectPriority,
  progress: 0,
  dueDate: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProjectList(value: unknown): value is StudyProject[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.description === "string" &&
        (item.kind === "personal" || item.kind === "team") &&
        typeof item.subject === "string" &&
        (item.priority === "Cao" ||
          item.priority === "Trung bình" ||
          item.priority === "Bình thường") &&
        typeof item.progress === "number" &&
        item.progress >= 0 &&
        item.progress <= 100 &&
        typeof item.dueDate === "string",
    )
  );
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [kind, setKind] = useState<"all" | ProjectKind>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          if (!isProjectList(parsed)) {
            throw new Error("Dữ liệu dự án đã lưu không đúng định dạng.");
          }
          setProjects(parsed);
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? `Không thể đọc dự án đã lưu: ${error.message}`
            : "Không thể đọc dự án đã lưu.",
        );
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(projects));
    } catch {
      const timer = window.setTimeout(
        () => setMessage("Không thể lưu dự án. Vui lòng kiểm tra dung lượng trình duyệt."),
        0,
      );
      return () => window.clearTimeout(timer);
    }
  }, [projects, storageReady]);

  const personalCount = projects.filter((project) => project.kind === "personal").length;
  const teamCount = projects.length - personalCount;
  const averageProgress = projects.length
    ? Math.round(projects.reduce((total, project) => total + project.progress, 0) / projects.length)
    : 0;
  const visibleProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesKind = kind === "all" || project.kind === kind;
        const query = search.trim().toLocaleLowerCase("vi");
        const matchesSearch =
          !query ||
          `${project.name} ${project.subject} ${project.description}`
            .toLocaleLowerCase("vi")
            .includes(query);
        return matchesKind && matchesSearch;
      }),
    [kind, projects, search],
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditForm(project: StudyProject) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      kind: project.kind,
      subject: project.subject,
      priority: project.priority,
      progress: project.progress,
      dueDate: project.dueDate,
    });
    setIsModalOpen(true);
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    if (editingId === null) {
      setProjects((current) => [{ ...form, name, id: Date.now() }, ...current]);
    } else {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingId ? { ...form, name, id: editingId } : project,
        ),
      );
    }
    setIsModalOpen(false);
  }

  function removeProject(id: number) {
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  return (
    <>
      <AppHeader active="/projects" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-gutter-mobile py-space-xl sm:px-gutter md:px-margin">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface">
              Dự án học tập của tôi
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              Theo dõi mục tiêu, tiến độ và hạn hoàn thành của từng dự án.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-surface-container-high bg-white px-3 py-2 text-sm text-on-surface-variant">
              Đang thực hiện: <strong className="text-on-surface">{projects.length} dự án</strong>
            </span>
            <button
              className="rounded-xl bg-primary-container px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary"
              onClick={openCreateForm}
              type="button"
            >
              ＋ Thêm dự án
            </button>
          </div>
        </div>

        {message && (
          <p aria-live="polite" className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">
            {message}
          </p>
        )}

        <section className="rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-on-surface-variant">
              Tiến độ tổng quan các dự án
            </span>
            <strong className="text-xl text-primary">{averageProgress}%</strong>
          </div>
          <div
            aria-label={`Tiến độ dự án trung bình ${averageProgress}%`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={averageProgress}
            className="h-2.5 overflow-hidden rounded-full bg-surface-container"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-on-surface-variant">
            {projects.length} dự án · {personalCount} cá nhân · {teamCount} nhóm
          </p>
        </section>

        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div aria-label="Loại dự án" className="inline-flex w-fit rounded-full bg-surface-container p-1" role="group">
            {(
              [
                ["all", "Tất cả", projects.length],
                ["personal", "Dự án cá nhân", personalCount],
                ["team", "Dự án nhóm", teamCount],
              ] as const
            ).map(([value, label, count]) => (
              <button
                aria-pressed={kind === value}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  kind === value
                    ? "bg-white font-semibold text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                key={value}
                onClick={() => setKind(value)}
                type="button"
              >
                {label} <span className="ml-1 text-xs">({count})</span>
              </button>
            ))}
          </div>
          <label className="w-full sm:max-w-xs">
            <span className="sr-only">Tìm dự án</span>
            <input
              className="w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên dự án, môn học..."
              type="search"
              value={search}
            />
          </label>
        </section>

        {visibleProjects.length ? (
          <section aria-label="Danh sách dự án" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <article
                className="relative flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm transition hover:shadow-md"
                key={project.id}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1.5 ${
                    project.kind === "team" ? "bg-secondary" : "bg-primary"
                  }`}
                />
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-xs font-semibold text-primary">
                    {project.kind === "team" ? "Dự án nhóm" : "Dự án cá nhân"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      aria-label={`Chỉnh sửa ${project.name}`}
                      className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                      onClick={() => openEditForm(project)}
                      type="button"
                    >
                      ✎
                    </button>
                    <button
                      aria-label={`Xóa ${project.name}`}
                      className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container/40 hover:text-error"
                      onClick={() => removeProject(project.id)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug text-on-surface">
                  {project.name}
                </h2>
                <p className="mt-1 min-h-10 text-sm leading-6 text-on-surface-variant">
                  {project.description || "Chưa có mô tả cho dự án này."}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                  <span>{project.subject || "Chưa phân loại"}</span>
                  <span
                    className={
                      project.priority === "Cao" ? "font-semibold text-tertiary" : ""
                    }
                  >
                    Ưu tiên: {project.priority}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <label htmlFor={`progress-${project.id}`}>Tiến độ</label>
                    <strong className="text-primary">{project.progress}%</strong>
                  </div>
                  <input
                    aria-label={`Cập nhật tiến độ ${project.name}`}
                    className="w-full accent-primary"
                    id={`progress-${project.id}`}
                    max={100}
                    min={0}
                    onChange={(event) => {
                      const progress = Number(event.target.value);
                      setProjects((current) =>
                        current.map((item) =>
                          item.id === project.id ? { ...item, progress } : item,
                        ),
                      );
                    }}
                    type="range"
                    value={project.progress}
                  />
                </div>
                <div className="mt-auto flex justify-between border-t border-surface-container-high pt-4 text-xs text-on-surface-variant">
                  <span>{project.progress === 100 ? "Đã hoàn thành" : "Đang thực hiện"}</span>
                  <span>
                    Hạn:{" "}
                    {project.dueDate
                      ? new Date(`${project.dueDate}T00:00:00`).toLocaleDateString("vi-VN")
                      : "Chưa đặt"}
                  </span>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <p className="rounded-xl border border-dashed border-outline-variant bg-white px-4 py-10 text-center text-sm text-on-surface-variant">
            Không tìm thấy dự án phù hợp. Hãy đổi từ khóa hoặc thêm dự án mới.
          </p>
        )}
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsModalOpen(false);
          }}
        >
          <section
            aria-labelledby="project-form-title"
            aria-modal="true"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-surface-container-high bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface" id="project-form-title">
                {editingId === null ? "Thêm dự án học tập" : "Chỉnh sửa dự án"}
              </h2>
              <button
                aria-label="Đóng biểu mẫu"
                className="rounded-lg px-3 py-1 text-xl text-outline hover:bg-surface-container-low"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <form className="space-y-4" onSubmit={saveProject}>
              <label className="block text-sm font-semibold">
                Tên dự án
                <input
                  className="mt-1.5 w-full rounded-xl border border-outline-variant px-3.5 py-2.5 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Ví dụ: Đồ án tốt nghiệp, Luyện thi TOPIK II..."
                  required
                  value={form.name}
                />
              </label>
              <label className="block text-sm font-semibold">
                Mô tả
                <textarea
                  className="mt-1.5 min-h-20 w-full rounded-xl border border-outline-variant px-3.5 py-2.5 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  value={form.description}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Loại dự án
                  <select
                    className="mt-1.5 w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2.5 font-normal"
                    onChange={(event) =>
                      setForm({ ...form, kind: event.target.value as ProjectKind })
                    }
                    value={form.kind}
                  >
                    <option value="personal">Dự án cá nhân</option>
                    <option value="team">Dự án nhóm</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold">
                  Môn học / chủ đề
                  <input
                    className="mt-1.5 w-full rounded-xl border border-outline-variant px-3.5 py-2.5 font-normal"
                    onChange={(event) => setForm({ ...form, subject: event.target.value })}
                    value={form.subject}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Mức ưu tiên
                  <select
                    className="mt-1.5 w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2.5 font-normal"
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value as ProjectPriority })
                    }
                    value={form.priority}
                  >
                    <option>Cao</option>
                    <option>Trung bình</option>
                    <option>Bình thường</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold">
                  Hạn hoàn thành
                  <input
                    className="mt-1.5 w-full rounded-xl border border-outline-variant px-3.5 py-2.5 font-normal"
                    onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                    type="date"
                    value={form.dueDate}
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold">
                Tiến độ: {form.progress}%
                <input
                  className="mt-2 w-full accent-primary"
                  max={100}
                  min={0}
                  onChange={(event) =>
                    setForm({ ...form, progress: Number(event.target.value) })
                  }
                  type="range"
                  value={form.progress}
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-surface-container-high pt-4">
                <button
                  className="rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="rounded-xl bg-primary-container px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary"
                  type="submit"
                >
                  {editingId === null ? "Tạo dự án" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
