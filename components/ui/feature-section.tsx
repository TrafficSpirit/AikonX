"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
}

export function FeatureSteps({
  features,
  className,
  eyebrow,
  title = "How to get Started",
  description,
  autoPlayInterval = 3000,
  imageHeight = "h-[240px] md:h-[360px] lg:h-[500px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || features.length < 2 || autoPlayInterval <= 0) return;

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      if (elapsed >= autoPlayInterval) {
        setCurrentFeature((current) => (current + 1) % features.length);
        setProgress(0);
      } else {
        setProgress((elapsed / autoPlayInterval) * 100);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [currentFeature, features.length, autoPlayInterval, reduceMotion]);

  if (!features.length) return null;

  return (
    <div className={cn("py-8 md:py-12", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">{title}</h2>
          {description && <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground">{description}</p>}
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="order-2 md:order-1 w-full space-y-4">
            {features.map((feature, index) => (
              <motion.button
                type="button"
                key={feature.step}
                className="block w-full rounded-2xl px-3 py-3 text-left transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => { setCurrentFeature(index); setProgress(0); }}
                aria-pressed={index === currentFeature}
                initial={false}
                animate={{ opacity: index === currentFeature ? 1 : 0.5 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
              >
                <span className="flex items-start gap-5 md:gap-6">
                  <span className={cn(
                    "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    index === currentFeature
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-neutral-300 bg-white text-neutral-500",
                  )}>
                    {index < currentFeature ? "✓" : index + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-xl md:text-2xl font-semibold tracking-tight text-neutral-950">{feature.title || feature.step}</span>
                    <span className="mt-1 block text-sm md:text-base leading-relaxed text-muted-foreground">{feature.content}</span>
                    {index === currentFeature && !reduceMotion && autoPlayInterval > 0 && (
                      <span className="mt-4 block h-0.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
                        <span className="block h-full bg-primary" style={{ width: `${progress}%` }} />
                      </span>
                    )}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          <div className={cn("order-1 md:order-2 relative w-full overflow-hidden rounded-2xl bg-[#f5f8fc]", imageHeight)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                initial={reduceMotion ? false : { y: 60, opacity: 0, rotateX: -12 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: -60, opacity: 0, rotateX: 12 }}
                transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeInOut" }}
              >
                <img
                  src={features[currentFeature].image}
                  alt={`${features[currentFeature].title || features[currentFeature].step} abstract illustration`}
                  className="h-full w-full object-cover"
                  width={1536}
                  height={1024}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/40 to-transparent" aria-hidden="true" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
