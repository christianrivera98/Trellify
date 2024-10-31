import VideoSlider from "./components/VideoSlider";
import { motion } from "framer-motion";

export const Features2 = () => {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-blue-800 via-slate-900 to-blue-900 text-white py-10">
      <img
        alt=""
        src="https://res.cloudinary.com/ma-cloud/image/upload/v1729813629/findy/fetures_r70phu.jpg"
        className="absolute inset-0 -z-50 w-full h-full object-cover object-center opacity-30"
      />
      <motion.div
        className="px-4 sm:px-8 lg:mx-0 text-center lg:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium italic tracking-tight leading-tight text-white mb-8 lg:ml-20">
          Características principales:
        </h2>
      </motion.div>
      <motion.div className="mt-5 px-4 sm:px-8">
        <VideoSlider />
      </motion.div>
    </div>
  );
};
