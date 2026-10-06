import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
  { text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.", name: "Briana Patton", role: "Operations Manager", initials: "BP", avatarBg: "#006cd2", avatarFg: "#ffffff" },
  { text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.", name: "Bilal Ahmed", role: "IT Manager", initials: "BA", avatarBg: "#0a7d3a", avatarFg: "#ffffff" },
  { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.", name: "Saman Malik", role: "Customer Support Lead", initials: "SM", avatarBg: "#7c3aed", avatarFg: "#ffffff" },
  { text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.", name: "Omar Raza", role: "CEO", initials: "OR", avatarBg: "#b45309", avatarFg: "#ffffff" },
  { text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.", name: "Zainab Hussain", role: "Project Manager", initials: "ZH", avatarBg: "#0e7490", avatarFg: "#ffffff" },
  { text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.", name: "Aliza Khan", role: "Business Analyst", initials: "AK", avatarBg: "#be185d", avatarFg: "#ffffff" },
  { text: "Our business functions improved with a user-friendly design and positive customer feedback.", name: "Farhan Siddiqui", role: "Marketing Director", initials: "FS", avatarBg: "#1d4ed8", avatarFg: "#ffffff" },
  { text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.", name: "Sana Sheikh", role: "Sales Manager", initials: "SS", avatarBg: "#047857", avatarFg: "#ffffff" },
  { text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.", name: "Hassan Ali", role: "E-commerce Manager", initials: "HA", avatarBg: "#9333ea", avatarFg: "#ffffff" },
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
