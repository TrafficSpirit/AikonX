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
  { text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.", image: "", name: "Briana Patton", role: "Operations Manager", ...avatar(0, "Briana Patton") },
  { text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.", image: "", name: "Bilal Ahmed", role: "IT Manager", ...avatar(1, "Bilal Ahmed") },
  { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.", image: "", name: "Saman Malik", role: "Customer Support Lead", ...avatar(2, "Saman Malik") },
  { text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.", image: "", name: "Omar Raza", role: "CEO", ...avatar(3, "Omar Raza") },
  { text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.", image: "", name: "Zainab Hussain", role: "Project Manager", ...avatar(4, "Zainab Hussain") },
  { text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.", image: "", name: "Aliza Khan", role: "Business Analyst", ...avatar(5, "Aliza Khan") },
  { text: "Our business functions improved with a user-friendly design and positive customer feedback.", image: "", name: "Farhan Siddiqui", role: "Marketing Director", ...avatar(6, "Farhan Siddiqui") },
  { text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.", image: "", name: "Sana Sheikh", role: "Sales Manager", ...avatar(7, "Sana Sheikh") },
  { text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.", image: "", name: "Hassan Ali", role: "E-commerce Manager", ...avatar(8, "Hassan Ali") },
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
