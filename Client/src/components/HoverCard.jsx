import { motion } from "framer-motion";

export default function HoverCard({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}