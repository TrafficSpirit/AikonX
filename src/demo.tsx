import { motion } from "motion/react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";

const photos = [
  "photo-1534528741775-53994a69daeb",
  "photo-1500648767791-00dcc994a43e",
  "photo-1494790108377-be9c29b29330",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1531123897727-8f129e1688ce",
  "photo-1552058544-f2b08422138a",
  "photo-1544005313-94ddf0286df2",
  "photo-1527980965255-d3b416303d12",
  "photo-1535713875002-d1d0cf377fde",
];

const image = (index: number) => `https://images.unsplash.com/${photos[index]}?auto=format&fit=crop&w=96&h=96&q=80`;

const testimonials: Testimonial[] = [
  { text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.", image: image(0), name: "Briana Patton", role: "Operations Manager" },
  { text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.", image: image(1), name: "Bilal Ahmed", role: "IT Manager" },
  { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.", image: image(2), name: "Saman Malik", role: "Customer Support Lead" },
  { text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.", image: image(3), name: "Omar Raza", role: "CEO" },
  { text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.", image: image(4), name: "Zainab Hussain", role: "Project Manager" },
  { text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.", image: image(5), name: "Aliza Khan", role: "Business Analyst" },
  { text: "Our business functions improved with a user-friendly design and positive customer feedback.", image: image(6), name: "Farhan Siddiqui", role: "Marketing Director" },
  { text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.", image: image(7), name: "Sana Sheikh", role: "Sales Manager" },
  { text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.", image: image(8), name: "Hassan Ali", role: "E-commerce Manager" },
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
