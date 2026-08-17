import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface PostImageGalleryProps {
  images: string[];
}

export default function PostImageGallery({ images }: PostImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) return null;

  const activeImage = images[activeIndex];

  return (
    <>
      {/* Mobile Carousel with Swiper */}
      <div className="sm:hidden">
        <div className="overflow-hidden rounded-2xl border border-[#25252b] bg-[#111113]">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            loop={images.length > 1}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="post-image-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`${image}-${index}`}>
                <div className="relative aspect-[16/8] w-full bg-[#0c0c0e]">
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* Subtle bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Counter */}
        {images.length > 1 && (
          <div className="mt-2 flex justify-end">
            <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[9px] font-medium text-zinc-500">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Desktop with Thumbnails */}
      <div className="hidden sm:block space-y-2.5">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl border border-[#25252b] bg-[#111113]">
          <img
            src={activeImage}
            alt={`Post image ${activeIndex + 1}`}
            className="aspect-[16/7] w-full object-cover sm:aspect-[16/6]"
          />

          {/* Counter */}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {images.map((image, index) => {
              const selected = index === activeIndex;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`
                    relative
                    h-14 w-20
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border
                    transition
                    ${
                      selected
                        ? "border-[#FF3F3F]"
                        : "border-[#25252b] opacity-60 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  {selected && (
                    <span className="absolute inset-0 bg-[#FF3F3F]/10" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
