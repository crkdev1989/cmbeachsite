"use client";

import { useRef, useState } from "react";
import {
  requestMediaUploadUrl,
  finalizeMediaUpload,
  updateMediaCaption,
  deleteMedia,
  moveMedia,
  type MediaItem,
} from "../actions";

function byOrder(a: MediaItem, b: MediaItem) {
  return a.displayOrder - b.displayOrder;
}

function VideoPlaceholderIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      <polygon points="19,15 34,24 19,33" fill="#0A0A0A" />
    </svg>
  );
}

export default function MediaManager({
  jobId,
  initialMedia,
}: {
  jobId: string;
  initialMedia: MediaItem[];
}) {
  const [items, setItems] = useState<MediaItem[]>(
    [...initialMedia].sort(byOrder),
  );
  const [uploadingCount, setUploadingCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File) {
    const urlResult = await requestMediaUploadUrl(jobId, file.name, file.type);
    if (!urlResult.ok) {
      setErrors((prev) => [...prev, urlResult.message]);
      return;
    }

    const putResponse = await fetch(urlResult.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": urlResult.contentType },
      body: file,
    });
    if (!putResponse.ok) {
      setErrors((prev) => [...prev, `${file.name}: upload to storage failed.`]);
      return;
    }

    const finalizeResult = await finalizeMediaUpload(
      jobId,
      urlResult.key,
      file.name,
      urlResult.contentType,
    );
    if (!finalizeResult.ok) {
      setErrors((prev) => [...prev, finalizeResult.message]);
      return;
    }

    setItems((prev) => [...prev, finalizeResult.media].sort(byOrder));
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setErrors([]);
    const files = Array.from(fileList);
    setUploadingCount(files.length);
    await Promise.all(files.map((file) => uploadOne(file)));
    setUploadingCount(0);
  }

  async function handleCaptionBlur(mediaId: string, caption: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === mediaId ? { ...item, caption } : item)),
    );
    await updateMediaCaption(mediaId, caption);
  }

  async function handleMove(mediaId: string, direction: "up" | "down") {
    setItems((prev) => {
      const sorted = [...prev].sort(byOrder);
      const index = sorted.findIndex((item) => item.id === mediaId);
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) {
        return prev;
      }
      const a = sorted[index];
      const b = sorted[swapIndex];
      const aOrder = a.displayOrder;
      a.displayOrder = b.displayOrder;
      b.displayOrder = aOrder;
      return [...sorted];
    });
    await moveMedia(jobId, mediaId, direction);
  }

  async function handleDelete(mediaId: string) {
    if (!window.confirm("Delete this file? This can't be undone.")) return;
    setItems((prev) => prev.filter((item) => item.id !== mediaId));
    await deleteMedia(mediaId);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive
            ? "border-gold bg-gold/10"
            : "border-foreground/30 bg-foreground/5 hover:border-gold"
        }`}
      >
        <p className="font-heading text-sm font-bold uppercase tracking-wide">
          Drop photos or videos here, or click to choose files
        </p>
        <p className="mt-1 text-xs text-foreground/60">
          JPG, PNG, HEIC, MP4, MOV
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/quicktime,.heic,.heif,.mp4,.mov"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploadingCount > 0 && (
        <p className="mt-3 text-sm font-semibold text-sage">
          Uploading {uploadingCount} file{uploadingCount === 1 ? "" : "s"}...
        </p>
      )}

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1">
          {errors.map((error, i) => (
            <li key={i} className="text-sm font-semibold text-red-800">
              {error}
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">
          No photos or videos uploaded yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border-2 border-foreground/15 bg-[#F5F4F0] p-3"
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-foreground/10">
                {item.type === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.storageUrl}
                    alt={item.caption ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnailUrl}
                    alt={item.caption ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <VideoPlaceholderIcon />
                )}
              </div>

              <input
                type="text"
                defaultValue={item.caption ?? ""}
                placeholder="Caption (optional)"
                onBlur={(e) => handleCaptionBlur(item.id, e.target.value)}
                className="mt-2 w-full border border-foreground/20 bg-white px-2 py-1 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
              />

              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(item.id, "up")}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="border border-foreground/20 px-2 py-1 text-xs font-bold disabled:opacity-30"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(item.id, "down")}
                    disabled={index === items.length - 1}
                    aria-label="Move later"
                    className="border border-foreground/20 px-2 py-1 text-xs font-bold disabled:opacity-30"
                  >
                    &darr;
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs font-semibold uppercase tracking-wide text-red-800 hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
