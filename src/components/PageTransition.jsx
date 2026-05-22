import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.3,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

/**
 * PageTransition component wraps page content and uses Framer Motion variants
 * to create a premium fade-in/slide-up page transition.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}
