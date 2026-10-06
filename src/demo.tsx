import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

// Avatar colours — distinct hues for each testimonial person.
const avatarColors: [string, string][] = [
  ["#006cd2","#bfe0ff"], ["#0a7d3a","#bbf0d4"], ["#8b2fc9","#e9d5ff"],
  ["#c94f0a","#fde4cc"], ["#0a6b7d","#c8f0f8"], ["#7d0a44","#fdd5e8"],
  ["#3d7d0a","#d8f5bb"], ["#7d4f0a","#fdeacc"], ["#0a3d7d","#c8d8f8"],
];

const image = (index: number, name: string) => {
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const [bg, fg] = avatarColors[index % avatarColors.length];
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' rx='40' fill='${encodeURIComponent(bg)}'/%3E%3Ctext x='40' y='40' dominant-baseline='central' text-anchor='middle' font-family='Inter%2CHelvetica%2CArial%2Csans-serif' font-size='28' font-weight='600' fill='${encodeURIComponent(fg)}'%3E${initials}%3C/text%3E%3C/svg%3E`;
};

const testimonials: Testimonial[] = [
  { text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.", image: image(0, "Briana Patton"), name: "Briana Patton", role: "Operations Manager" },
  { text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.", image: image(1, "Bilal Ahmed"), name: "Bilal Ahmed", role: "IT Manager" },
  { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.", image: image(2, "Saman Malik"), name: "Saman Malik", role: "Customer Support Lead" },
  { text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.", image: image(3, "Omar Raza"), name: "Omar Raza", role: "CEO" },
  { text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.", image: image(4, "Zainab Hussain"), name: "Zainab Hussain", role: "Project Manager" },
  { text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.", image: image(5, "Aliza Khan"), name: "Aliza Khan", role: "Business Analyst" },
  { text: "Our business functions improved with a user-friendly design and positive customer feedback.", image: image(6, "Farhan Siddiqui"), name: "Farhan Siddiqui", role: "Marketing Director" },
  { text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.", image: image(7, "Sana Sheikh"), name: "Sana Sheikh", role: "Sales Manager" },
  { text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.", image: image(8, "Hassan Ali"), name: "Hassan Ali", role: "E-commerce Manager" },
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
