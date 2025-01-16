import { motion } from "framer-motion";
import { testimonials } from "./data/testimonials";

export const Testimonials = () => {
  return (
    <section className="py-16  text-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium italic mb-10">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-xl flex items-center text-gray-900 border border-gray-200"
            >
              <img
                className="w-20 h-20 rounded-full mr-4"
                src={testimonial.photo}
                alt={testimonial.alt}
              />
              <div>
                <p className="text-sm sm:text-base">{testimonial.quote}</p>
                <p className="mt-4 text-xs sm:text-sm font-medium">
                  {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// bg-gradient-to-b from-slate-900 to-blue-950