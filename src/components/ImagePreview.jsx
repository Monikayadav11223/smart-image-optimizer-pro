import { motion } from "framer-motion";
import { formatBytes } from "../utils/imageTools";

export default function ImagePreview({ title, imageUrl, size, meta, muted }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-slate-200/70 backdrop-blur-xl transition duration-300 hover:shadow-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
    >
      <div className="mb-4 flex items-start justify-between gap-3 px-1">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">{title}</h3>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{formatBytes(size)}</p>
        </div>
        {meta ? (
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            {meta}
          </span>
        ) : null}
      </div>
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-cyan-50 dark:from-slate-950 dark:to-teal-950/40">
        {imageUrl ? (
          <img className="h-full w-full object-contain" src={imageUrl} alt={`${title} preview`} />
        ) : (
          <p className="px-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {muted || "Preview appears after compression"}
          </p>
        )}
      </div>
    </motion.article>
  );
}
