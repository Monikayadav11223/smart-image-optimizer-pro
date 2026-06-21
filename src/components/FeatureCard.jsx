import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl transition duration-300 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/80 dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 dark:hover:border-teal-300/40 dark:hover:shadow-teal-950/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25 transition duration-300 group-hover:scale-105">
        <Icon size={23} />
      </div>
      <h3 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </motion.article>
  );
}
