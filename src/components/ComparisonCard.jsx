import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck } from "lucide-react";
import { formatBytes } from "../utils/imageTools";

export default function ComparisonCard({ originalSize, compressedSize }) {
  const savedBytes = Math.max(originalSize - compressedSize, 0);
  const savedPercent = originalSize ? Math.max(0, Math.round((savedBytes / originalSize) * 100)) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
          <BadgeCheck size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Before vs After</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Instant browser-side optimization</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Original</p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{formatBytes(originalSize)}</p>
        </div>
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
          <ArrowDown className="sm:-rotate-90" size={18} />
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/90 p-5 dark:border-teal-300/20 dark:bg-teal-400/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-200">Compressed</p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{formatBytes(compressedSize)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 dark:from-white dark:to-slate-200 dark:text-slate-950">
        {compressedSize ? `${savedPercent}% smaller, saving ${formatBytes(savedBytes)}` : "Compression summary will appear here"}
      </div>
    </motion.section>
  );
}
