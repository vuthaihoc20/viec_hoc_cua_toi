"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import AppHeader from "@/components/AppHeader";

const subjects = [
  {
    name: "Toán giải tích",
    time: "Thứ 2, Thứ 4 · Tiết 1-3",
    credits: "3 Tín chỉ",
  },
  {
    name: "Hóa học hữu cơ",
    time: "Thứ 3, Thứ 6 · Tiết 6-8",
    credits: "4 Tín chỉ",
  },
  {
    name: "Triết học Mác - Lênin",
    time: "Thứ 5 · Tiết 4-6",
    credits: "2 Tín chỉ",
  },
  {
    name: "Tiếng Anh thương mại",
    time: "Thứ 7 · Tiết 1-4",
    credits: "3 Tín chỉ",
  },
];

const sampleImageUrl = "/images/sample-schedule.svg";
const sampleFileName = "TKB_Mau_Hoc_Ky_II.svg";

export default function ScheduleDashboard() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(sampleImageUrl);
  const [fileName, setFileName] = useState(sampleFileName);
  const [isZoomed, setIsZoomed] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    },
    [imageUrl],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một tệp hình ảnh.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Ảnh thời khóa biểu phải có dung lượng tối đa 15 MB.");
      return;
    }

    setError("");
    setFileName(file.name);
    setImageUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageUrl(null);
    setFileName("");
    setIsZoomed(false);
    setError("");
  }

  function restoreSampleImage() {
    setImageUrl(sampleImageUrl);
    setFileName(sampleFileName);
    setError("");
  }

  return (
    <>
      <AppHeader active="/schedule" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-gutter-mobile py-space-xl sm:px-gutter md:px-margin">
        <div className="flex flex-col justify-between gap-4 border-b border-surface-container-high pb-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-on-surface">
              Thời khóa biểu của tôi
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={handleFileChange}
              ref={fileInput}
              type="file"
            />
            <button
              className="rounded-xl bg-primary-container px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary"
              onClick={() => fileInput.current?.click()}
              type="button"
            >
              ＋ Chọn ảnh thời khóa biểu
            </button>
          </div>
        </div>

        {error && (
          <p
            aria-live="polite"
            className="rounded-lg bg-error-container px-4 py-3 text-sm text-error"
          >
            {error}
          </p>
        )}

        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-on-surface">
                Tuần học hiện tại
              </h2>
              <span className="rounded-full bg-secondary-fixed px-2.5 py-1 text-xs font-semibold text-on-secondary-fixed-variant">
                Đang diễn ra
              </span>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              Tải ảnh thời khóa biểu lên để lưu và xem lịch học thuận tiện hơn.
            </p>
          </div>
          {imageUrl && (
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container-low"
                onClick={() => setIsZoomed(true)}
                type="button"
              >
                Xem ảnh lớn
              </button>
              <a
                className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium hover:bg-surface-container-low"
                download={fileName}
                href={imageUrl}
              >
                Tải xuống
              </a>
            </div>
          )}
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <section className="overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-high px-5 py-4">
              <div className="min-w-0">
                <h2 className="font-bold text-on-surface">
                  Ảnh thời khóa biểu
                </h2>
                <p className="truncate text-xs text-on-surface-variant">
                  {fileName || "Chưa có ảnh được tải lên"}
                </p>
              </div>
              {imageUrl && (
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
                    onClick={restoreSampleImage}
                    type="button"
                  >
                    Khôi phục ảnh mẫu
                  </button>
                  <button
                    className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
                    onClick={() => fileInput.current?.click()}
                    type="button"
                  >
                    Thay đổi ảnh
                  </button>
                  <button
                    className="rounded-lg border border-error/30 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error-container/40"
                    onClick={removeImage}
                    type="button"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>
            {imageUrl ? (
              <button
                aria-label="Mở ảnh thời khóa biểu"
                className="block w-full bg-surface-container-low p-4"
                onClick={() => setIsZoomed(true)}
                type="button"
              >
                <Image
                  alt={`Thời khóa biểu: ${fileName}`}
                  className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain"
                  height={1000}
                  unoptimized
                  src={imageUrl}
                  width={1600}
                />
              </button>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <span aria-hidden="true" className="text-5xl text-primary">
                  ▦
                </span>
                <h3 className="mt-4 text-lg font-bold text-on-surface">
                  Bạn chưa tải thời khóa biểu
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">
                  Tải lên ảnh PNG, JPG hoặc WEBP (tối đa 15 MB). Ảnh chỉ được
                  giữ trong phiên duyệt hiện tại.
                </p>
                <button
                  className="mt-5 rounded-xl bg-primary-container px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary"
                  onClick={() => fileInput.current?.click()}
                  type="button"
                >
                  Chọn ảnh từ thiết bị
                </button>
                <button
                  className="mt-3 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
                  onClick={restoreSampleImage}
                  type="button"
                >
                  Sử dụng ảnh mẫu
                </button>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">
                    Hôm nay học gì?
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Lịch học trong ngày
                  </p>
                </div>
                <span className="rounded-full bg-secondary-fixed px-2.5 py-1 text-xs font-semibold text-on-secondary-fixed-variant">
                  2 ca học
                </span>
              </div>
              <div className="divide-y divide-surface-container-high">
                <article className="space-y-2 py-4">
                  <span className="rounded-md bg-surface-container px-2 py-1 text-xs font-semibold text-primary">
                    07:30 - 09:50
                  </span>
                  <h3 className="font-bold text-on-surface">
                    Toán giải tích (Lý thuyết)
                  </h3>
                  <p className="text-xs leading-5 text-on-surface-variant">
                    Phòng A102 · Giảng viên: TS. Trần Hữu Hoàng
                  </p>
                </article>
                <article className="space-y-2 border-l-4 border-primary bg-surface-container-low/60 py-4 pl-3">
                  <span className="rounded-md bg-primary-container px-2 py-1 text-xs font-semibold text-white">
                    13:30 - 16:00
                  </span>
                  <h3 className="font-bold text-primary">
                    Thí nghiệm Hóa học hữu cơ
                  </h3>
                  <p className="text-xs leading-5 text-on-surface-variant">
                    Lab B204 · PGS. TS. Lê Thùy Dung
                  </p>
                  <p className="rounded-lg bg-white p-2 text-xs leading-5 text-tertiary">
                    Lưu ý: Mang theo áo blouse trắng và bản thảo báo cáo thí
                    nghiệm.
                  </p>
                </article>
              </div>
            </section>
            <section className="rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm">
              <h2 className="font-bold text-on-surface">
                Các môn học trong tuần
              </h2>
              <ul className="mt-3 space-y-3">
                {subjects.map((subject) => (
                  <li
                    className="rounded-xl border border-surface-container-high bg-surface-container-low/50 p-3"
                    key={subject.name}
                  >
                    <p className="text-sm font-semibold text-on-surface">
                      {subject.name}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {subject.time}
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-primary">
                      {subject.credits}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>

      {isZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            aria-label="Ảnh thời khóa biểu phóng to"
            aria-modal="true"
            className="flex max-h-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between gap-3 border-b border-surface-container-high px-4 py-3">
              <p className="truncate text-sm font-semibold">{fileName}</p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold"
                  download={fileName}
                  href={imageUrl}
                >
                  Tải xuống
                </a>
                <button
                  aria-label="Đóng ảnh phóng to"
                  className="rounded-lg px-3 py-1.5 text-xl hover:bg-surface-container-low"
                  onClick={() => setIsZoomed(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-auto bg-surface-container-low p-4">
              <Image
                alt={`Thời khóa biểu: ${fileName}`}
                className="mx-auto max-h-[78vh] max-w-full object-contain"
                height={1000}
                unoptimized
                src={imageUrl}
                width={1600}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
