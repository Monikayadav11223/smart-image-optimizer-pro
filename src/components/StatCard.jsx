import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function StatCard({ label, value, suffix = "", description }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frameId;
    const duration = 1200;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <motion.article
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
    >
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">{label}</p>
      <p className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </motion.article>
  );
}
