"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!activeImage) {
    return null;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-8"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => {
            const isActive = image === activeImage;

            return (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={isActive}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition dark:bg-slate-900 ${
                  isActive
                    ? "border-slate-900 ring-1 ring-slate-900 dark:border-white dark:ring-white"
                    : "border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-3"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
