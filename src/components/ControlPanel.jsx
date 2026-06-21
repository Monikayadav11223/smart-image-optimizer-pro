import { motion } from "framer-motion";
import { Download, Loader2, SlidersHorizontal } from "lucide-react";
import { FORMAT_OPTIONS, getConversionHint } from "../utils/imageTools";

export default function ControlPanel({
  file,
  quality,
  outputType,
  isProcessing,
  canDownload,
  onQualityChange,
  onOutputTypeChange,
  onDownload
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 lg:sticky lg:top-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-950 dark:text-white">Optimization Studio</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {file ? getConversionHint(file.type, outputType) : "Select an image to begin"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="quality">
            Quality
          </label>
          <span className="text-sm font-bold text-slate-950 dark:text-white">{quality}%</span>
        </div>
        <input
          id="quality"
          className="w-full"
          type="range"
          min="10"
          max="100"
          step="1"
          value={quality}
          disabled={!file || isProcessing}
          onChange={(event) => onQualityChange(Number(event.target.value))}
        />
      </div>

      <div className="mt-6">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="format">
          Output format
        </label>
        <select
          id="format"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
          value={outputType}
          disabled={!file || isProcessing}
          onChange={(event) => onOutputTypeChange(event.target.value)}
        >
          {FORMAT_OPTIONS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-teal-500/40 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none dark:from-teal-400 dark:to-cyan-400 dark:text-slate-950"
        disabled={!canDownload || isProcessing}
        onClick={onDownload}
      >
        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
        {isProcessing ? "Processing" : "Download compressed image"}
      </button>
    </motion.aside>
  );
}
