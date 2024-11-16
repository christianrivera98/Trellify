import { motion } from "framer-motion";

import VideoSlider from "./components/VideoSlider";
import { fadeIn, slideInUp } from "../../../../../ui/motions/motionsConfig";

export const Features2 = () => {
  return (
    <div className="relative isolate overflow-hidden text-white py-20 lg:py-28">
      <motion.div
        className="px-4 sm:px-8 lg:mx-0 text-center lg:text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeIn}
      >
        <motion.h2
          className="text-3xl xl:ml-10  md:text-4xl lg:text-5xl leading-tight font-semibold text-white italic drop-shadow-lg"
          initial="hidden"
          whileInView={"visible"}
          transition={{ duration: 2 }}
        >
          Características principales:
        </motion.h2>
      </motion.div>

      <div className="flex justify-center items-center w-screen mt-6 ">
        <motion.div
          className="flex justify-center items-center w-fit bg-slate-900 bg-opacity-60 rounded-lg mt-5 px-4 sm:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideInUp}
        >
          <VideoSlider />
        </motion.div>
      </div>
    </div>
  );
};
