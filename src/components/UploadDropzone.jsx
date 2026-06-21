import { motion } from "framer-motion";
import { ImagePlus, UploadCloud } from "lucide-react";

export default function UploadDropzone({ isDragging, onBrowse, onDrop, onDragChange, error }) {
  const handleDragOver = (event) => {
    event.preventDefault();
    onDragChange(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    onDragChange(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      animate={{ scale: isDragging ? 1.01 : 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`group relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed px-6 py-12 text-center shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-teal-500/20 ${
        isDragging
          ? "border-teal-400 bg-teal-50/90 shadow-teal-300/30 dark:border-teal-300 dark:bg-teal-400/15"
          : "border-white/80 bg-white/70 shadow-slate-200/80 hover:border-teal-300 dark:border-white/10 dark:bg-white/10 dark:shadow-black/30 dark:hover:border-teal-300/60"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-teal-100/70 opacity-80 transition duration-300 group-hover:opacity-100 dark:from-white/10 dark:to-teal-400/10" />
      <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 ring-2 ring-teal-300/70 transition duration-300 group-hover:opacity-100" />
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-2xl shadow-teal-500/30 transition duration-300 group-hover:scale-105">
        {isDragging ? <UploadCloud size={28} /> : <ImagePlus size={28} />}
      </div>
      <h2 className="relative text-3xl font-black tracking-tight text-slate-950 dark:text-white">Drop your image here</h2>
      <p className="relative mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
        Upload a JPG, PNG, or WEBP image to compress, preview, convert, and download it from your browser.
      </p>
      <label className="relative mt-8 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
        Choose image
        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={onBrowse} />
      </label>
      {error ? <p className="relative mt-4 text-sm font-semibold text-red-600 dark:text-red-300">{error}</p> : null}
    </motion.section>
  );
}
