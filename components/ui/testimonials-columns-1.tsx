"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

type TestimonialsColumnProps = {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
};

export const TestimonialsColumn = ({ className = "", testimonials, duration = 10 }: TestimonialsColumnProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className}>
      <motion.div
        animate={reduceMotion ? undefined : { translateY: "-50%" }}
        transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {(reduceMotion ? [0] : [0, 1]).map((copy) => (
          <React.Fragment key={copy}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-10 rounded-3xl border border-neutral-200 shadow-lg shadow-primary/10 w-full"
                key={`${copy}-${i}`}
                aria-hidden={copy === 1 ? true : undefined}
              >
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img width={40} height={40} src={image} alt={name} className="h-10 w-10 rounded-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
