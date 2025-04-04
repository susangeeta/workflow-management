import { motion } from "framer-motion";
import type React from "react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut"
    }
  }
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-52 h-52 rounded-full bg-primary/80 blur-3xl"
          variants={pulseVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />

        <motion.div
          className="relative"
          variants={floatVariants}
          animate="animate"
        >
          <h1 className="text-9xl font-extrabold text-foreground tracking-widest">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-error-600 to-warning-500">
              404
            </span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute -top-10 -right-10 w-20 h-20">
            <motion.div
              className="w-full h-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              }}
            >
              <div className="w-2 h-2 bg-primary/70 rounded-full absolute top-0 left-1/2" />
              <div className="w-2 h-2 bg-primary rounded-full absolute bottom-0 left-1/2" />
              <div className="w-2 h-2 bg-primary/40 rounded-full absolute left-0 top-1/2" />
              <div className="w-2 h-2 bg-primary rounded-full absolute right-0 top-1/2" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-2">
            Oops! This page has gone exploring.
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-gray-300 mb-10 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved to another
          universe.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link to="/">
            <motion.button
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-primary to-primary/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0 text-white">
                Back to Home
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
