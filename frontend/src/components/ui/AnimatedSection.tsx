import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function AnimatedSection({
  children,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
      }}
      viewport={{
        once: true,
      }}
    >
      {children}
    </motion.div>
  );
}