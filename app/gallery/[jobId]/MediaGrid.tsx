"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type GalleryMediaItem = {
  id: string;
  type: "photo" | "video";
  storageUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
};

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryMediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onNavigate((index - 1 + photos.length) % photos.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((index + 1) % photos.length);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, photos.length, onClose, onNavigate]);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-4 top-4 text-3xl font-bold text-white hover:text-gold"
      >
        &times;
      </button>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + photos.length) % photos.length);
          }}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-white hover:text-gold"
        >
          &lsaquo;
        </button>
      )}

      <div
        className="relative h-[75vh] w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.storageUrl}
          alt={photo.caption ?? ""}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {photo.caption && (
        <p className="mt-4 max-w-2xl text-center text-white">{photo.caption}</p>
      )}

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % photos.length);
          }}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-white hover:text-gold"
        >
          &rsaquo;
        </button>
      )}
    </div>
  );
}

export default function MediaGrid({ items }: { items: GalleryMediaItem[] }) {
  const photos = items.filter((item) => item.type === "photo");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          if (item.type === "photo") {
            const photoIndex = photos.findIndex((p) => p.id === item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(photoIndex)}
                className="group block text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-2 border-foreground/15 bg-foreground/10 transition-colors group-hover:border-gold">
                  <Image
                    src={item.storageUrl}
                    alt={item.caption ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {item.caption && (
                  <p className="mt-2 text-sm text-foreground/70">
                    {item.caption}
                  </p>
                )}
              </button>
            );
          }

          return (
            <div key={item.id}>
              <video
                controls
                preload="metadata"
                poster={item.thumbnailUrl ?? undefined}
                className="aspect-[4/3] w-full border-2 border-foreground/15 bg-black object-cover"
              >
                <source src={item.storageUrl} />
              </video>
              {item.caption && (
                <p className="mt-2 text-sm text-foreground/70">
                  {item.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
