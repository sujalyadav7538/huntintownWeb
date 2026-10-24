import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

const ANIMATION_CLASSES = {
  "fade-up": "hero-animate",
  fade: "hero-fade",
  reveal: "hero-reveal-left-to-right",
} as const;

export interface AnimatedContentProps extends ComponentPropsWithoutRef<"div"> {
  variant?: keyof typeof ANIMATION_CLASSES;
  delay?: number;
  duration?: number;
  revealOnScroll?: boolean;
}

export default function AnimatedContent({
  children,
  variant = "fade-up",
  delay = 0,
  duration,
  revealOnScroll = false,
  className = "",
  style,
  onAnimationEnd,
  ...props
}: AnimatedContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(!revealOnScroll);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (hasEntered) return;
    if (!revealOnScroll || typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasEntered, revealOnScroll]);

  return (
    <div
      {...props}
      ref={containerRef}
      className={`${hasEntered && !hasFinished ? ANIMATION_CLASSES[variant] : ""} ${className}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setHasFinished(true);
        onAnimationEnd?.(event);
      }}
      style={{
        ...style,
        animationDelay: `${Math.max(0, delay)}s`,
        ...(duration === undefined
          ? {}
          : { animationDuration: `${Math.max(0, duration)}s` }),
      }}
    >
      {children}
    </div>
  );
}