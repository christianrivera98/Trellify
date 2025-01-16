import { useState, useEffect } from "react";
import { Features2 } from "./homeComponents/body/Features2";
import { Hero } from "./homeComponents/body/Hero";
import { Testimonials } from "./homeComponents/body/Testimonials";
import { Footer } from "./homeComponents/footer/Footer";
import { NavBar } from "./homeComponents/nav/NavBar";
import { motion } from "framer-motion";

export const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: scrollY > 0 ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <NavBar />
      </motion.div>

      <div className="bg-fixed bg-[url('/assets/image/fondoHome_optimized.webp')] bg-cover bg-center">
        <Hero />
        <Features2 />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};
