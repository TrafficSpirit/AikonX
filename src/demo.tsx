import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

// Avatar colours — distinct hues for each testimonial person.
const avatarColors: [string, string][] = [
  ["#006cd2","#bfe0ff"], ["#0a7d3a","#bbf0d4"], ["#8b2fc9","#e9d5ff"],
  ["#c94f0a","#fde4cc"], ["#0a6b7d","#c8f0f8"], ["#7d0a44","#fdd5e8"],
  ["#3d7d0a","#d8f5bb"], ["#7d4f0a","#fdeacc"], ["#0a3d7d","#c8d8f8"],
];

const avatar = (index: number, name: string) => {
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const [bg, fg] = avatarColors[index % avatarColors.length];
  return { initials, avatarBg: bg, avatarFg: fg };
};

const testimonials: Testimonial[] = [
  { text: "Our cost per lead dropped by a third within two months. For the first time, we actually know which ads are paying for themselves.", image: "", name: "Lachlan Mitchell", role: "Marketing Manager", ...avatar(0, "Lachlan Mitchell") },
  { text: "Onboarding was quick and painless. They had our tracking cleaned up and campaigns live in under three weeks.", image: "", name: "Chloe Henderson", role: "Operations Manager", ...avatar(1, "Chloe Henderson") },
  { text: "The monthly reviews are in plain English. No jargon, just what's working, what isn't, and what's next.", image: "", name: "Jack O'Brien", role: "Managing Director", ...avatar(2, "Jack O'Brien") },
  { text: "Our Google Ads were bleeding money before AIkonX took over. Now every dollar is accountable.", image: "", name: "Matilda Nguyen", role: "Founder", ...avatar(3, "Matilda Nguyen") },
  { text: "They rebuilt our Meta campaigns from scratch and doubled qualified enquiries without increasing spend.", image: "", name: "Riley Thompson", role: "Head of Growth", ...avatar(4, "Riley Thompson") },
  { text: "Our organic traffic has grown steadily every month since they took on our SEO. It's compounding exactly like they said it would.", image: "", name: "Sophie Walker", role: "Digital Marketing Lead", ...avatar(5, "Sophie Walker") },
  { text: "Having one live dashboard for every channel has changed how our leadership team makes decisions.", image: "", name: "Harrison Kelly", role: "CEO", ...avatar(6, "Harrison Kelly") },
  { text: "A genuinely senior team. We deal directly with the specialists running our account, not a junior account manager.", image: "", name: "Isla Campbell", role: "Brand Manager", ...avatar(7, "Isla Campbell") },
  { text: "Our online sales jumped after they restructured our Shopping campaigns. ROAS has never been healthier.", image: "", name: "Cooper Davies", role: "E-commerce Manager", ...avatar(8, "Cooper Davies") },
];

export function Testimonials() {
  return (
    <div className="relative mx-auto w-full max-w-[1680px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="testimonials-heading flex flex-col items-center justify-center mx-auto text-center"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">What our users say</h2>
        <p className="mt-5 opacity-75">See what our customers have to say about us.</p>
      </motion.div>
      <div className="testimonials-stream flex justify-center gap-6 mt-10 max-h-[740px] overflow-hidden">
        <TestimonialsColumn testimonials={testimonials.slice(0, 3)} className="min-w-0 flex-1" duration={15} />
        <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="min-w-0 flex-1 hidden md:block" duration={19} />
        <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="min-w-0 flex-1 hidden lg:block" duration={17} />
      </div>
    </div>
  );
}
