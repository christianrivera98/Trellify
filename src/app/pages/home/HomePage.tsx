import { Features2 } from "./homeComponents/body/Features2";
import { Hero } from "./homeComponents/body/Hero";
import { Testimonials } from "./homeComponents/body/Testimonials";
import { Footer } from "./homeComponents/footer/Footer";
import { NavBar } from "./homeComponents/nav/NavBar";

export const HomePage = () => {
  return (
    <>
      <div>
        <NavBar />
        <Hero />
        <Features2/>
        <Testimonials/>
        <Footer/>
      </div>
    </>
  );
};
