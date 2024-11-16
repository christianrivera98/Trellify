// motionConfig.ts

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  transition: { duration: 1, ease: "easeOut" },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
  transition: { duration: 1.2, ease: "easeOut" },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  transition: { duration: 1.2, ease: "easeOut" },
};

export const slideInUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: "easeOut" },
};
