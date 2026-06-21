import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Globe2, Lock, Moon, RefreshCcw, Smartphone, Sun, Zap } from "lucide-react";
import ComparisonCard from "./components/ComparisonCard.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import FeatureCard from "./components/FeatureCard.jsx";
import ImagePreview from "./components/ImagePreview.jsx";
import StatCard from "./components/StatCard.jsx";
import UploadDropzone from "./components/UploadDropzone.jsx";
import {
  compressImage,
  formatBytes,
  getDefaultOutputType,
  getOutputName,
  isValidImage
} from "./utils/imageTools.js";

const DEBOUNCE_MS = 250;
const OWNER_EMAIL = "monikayadav11223@gmail.com";
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 }
};
const staggerGroup = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};
const FEATURES = [
  {
    icon: Zap,
    title: "Fast Compression",
    description: "Compress images in seconds"
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Everything happens in your browser"
  },
  {
    icon: Globe2,
    title: "Format Conversion",
    description: "Convert JPG, PNG and WEBP"
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Works on all devices"
  }
];
const STATS = [
  {
    label: "Images Optimized",
    value: 1280,
    suffix: "+",
    description: "A polished portfolio metric for fast client-side workflows."
  },
  {
    label: "Average Size Saved",
    value: 68,
    suffix: "%",
    description: "Clear savings feedback helps users trust every optimization."
  },
  {
    label: "Supported Formats",
    value: 3,
    description: "JPG, PNG, and WEBP are supported for compression and conversion."
  }
];

export default function App() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [quality, setQuality] = useState(76);
  const [outputType, setOutputType] = useState("image/jpeg");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const processId = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  useEffect(() => {
    if (!file) return;

    const currentId = processId.current + 1;
    processId.current = currentId;
    setIsProcessing(true);
    setError("");

    const timer = window.setTimeout(async () => {
      try {
        const blob = await compressImage(file, outputType, quality);
        if (processId.current !== currentId) return;

        setCompressedBlob(blob);
        setCompressedUrl((previousUrl) => {
          if (previousUrl) URL.revokeObjectURL(previousUrl);
          return URL.createObjectURL(blob);
        });
      } catch (caughtError) {
        if (processId.current !== currentId) return;
        setCompressedBlob(null);
        setCompressedUrl("");
        setError(caughtError instanceof Error ? caughtError.message : "Compression failed. Try another image.");
      } finally {
        if (processId.current === currentId) setIsProcessing(false);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [file, outputType, quality]);

  const compressionLabel = useMemo(() => {
    if (!file || !compressedBlob) return "Waiting for image";
    const delta = file.size - compressedBlob.size;
    if (delta <= 0) return "Converted image is larger";
    return `${Math.round((delta / file.size) * 100)}% smaller`;
  }, [file, compressedBlob]);

  const savedPercent = useMemo(() => {
    if (!file || !compressedBlob) return 0;
    return Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100));
  }, [file, compressedBlob]);

  const selectFile = (nextFile) => {
    if (!nextFile) return;

    if (!isValidImage(nextFile)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    setFile(nextFile);
    setOutputType(getDefaultOutputType(nextFile.type));
    setCompressedBlob(null);
    setCompressedUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return "";
    });
    setOriginalUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return URL.createObjectURL(nextFile);
    });
    setError("");
  };

  const handleBrowse = (event) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = getOutputName(file.name, outputType);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetImage = () => {
    setFile(null);
    setCompressedBlob(null);
    setCompressedUrl("");
    setOriginalUrl("");
    setError("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition dark:bg-slate-950 dark:text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#e0f2fe_48%,_#ecfeff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_46%,_#042f2e_100%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/65 px-4 py-3 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-black text-white shadow-lg shadow-teal-500/30">
              SO
            </div>
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">Smart Optimizer</p>
              <p className="hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">Browser image suite</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              className="hidden items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:inline-flex"
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noreferrer"
            >
              Built for Digital Heroes
              <ExternalLink size={16} />
            </a>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <motion.section
          className="grid gap-10 py-2 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
          variants={staggerGroup}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }}>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="inline-flex rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-sm font-bold text-teal-800 shadow-sm backdrop-blur dark:border-teal-300/20 dark:bg-white/10 dark:text-teal-200"
            >
              Premium browser-side image optimization
            </motion.div>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
            >
              Smart Image Optimizer Pro
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300"
            >
              Compress, convert and optimize images instantly without uploading them to any server.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }} className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-500/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-teal-500/40"
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noreferrer"
              >
                Built for Digital Heroes
                <ExternalLink size={16} />
              </a>
              <button
                className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/70 px-6 py-3.5 text-sm font-black text-slate-800 shadow-lg shadow-slate-200/70 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-black/20 dark:hover:bg-white/20"
                type="button"
                onClick={() => document.getElementById("optimizer")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start optimizing
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-300/40 to-cyan-400/30 blur-3xl dark:from-teal-400/15 dark:to-cyan-500/15" />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-2xl shadow-slate-300/60 backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/30"
            >
              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-inner dark:bg-black/40">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-teal-200">Optimization snapshot</p>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-200">LIVE</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Original</p>
                    <p className="mt-2 text-2xl font-black">{file ? formatBytes(file.size) : "2.8 MB"}</p>
                  </div>
                  <div className="rounded-2xl bg-teal-400/15 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-200">Saved</p>
                    <p className="mt-2 text-2xl font-black">{compressedBlob ? `${savedPercent}%` : "68%"}</p>
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-500"
                    style={{ width: `${compressedBlob ? Math.max(savedPercent, 8) : 68}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          variants={staggerGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.section>

        <motion.section
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
          variants={staggerGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-2xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">About Project</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Private image optimization for everyday creators.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              Smart Image Optimizer Pro is a browser-based tool that compresses and converts images instantly without uploading them to any server. This ensures privacy, speed, and convenience.
            </p>
          </motion.div>

          <motion.div variants={staggerGroup} className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        </motion.section>

        <section id="optimizer" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-7">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <UploadDropzone
                    isDragging={isDragging}
                    onBrowse={handleBrowse}
                    onDrop={handleDrop}
                    onDragChange={setIsDragging}
                    error={error}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  className="flex flex-col gap-7"
                  variants={staggerGroup}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                <motion.section
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Results Dashboard</p>
                      <h2 className="mt-2 break-all text-2xl font-black text-slate-950 dark:text-white">{file.name}</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {file.type.replace("image/", "").toUpperCase()} - Original size {formatBytes(file.size)}
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                      type="button"
                      onClick={resetImage}
                    >
                      <RefreshCcw size={16} />
                      Replace
                    </button>
                  </div>
                  {error ? <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
                </motion.section>

                <motion.section className="grid gap-4 sm:grid-cols-3" variants={staggerGroup}>
                  <motion.div
                    variants={fadeUp}
                    className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Original Size</p>
                    <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{formatBytes(file.size)}</p>
                  </motion.div>
                  <motion.div
                    variants={fadeUp}
                    className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Compressed Size</p>
                    <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{formatBytes(compressedBlob?.size || 0)}</p>
                  </motion.div>
                  <motion.div
                    variants={fadeUp}
                    className="rounded-3xl border border-teal-200 bg-teal-50/80 p-5 shadow-xl shadow-teal-100/70 backdrop-blur-xl dark:border-teal-300/20 dark:bg-teal-400/10 dark:shadow-black/20"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Percentage Saved</p>
                    <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{compressedBlob ? `${savedPercent}%` : "0%"}</p>
                  </motion.div>
                </motion.section>

                <motion.section className="grid gap-5 md:grid-cols-2" variants={staggerGroup}>
                  <ImagePreview title="Original" imageUrl={originalUrl} size={file.size} meta={file.type.split("/")[1].toUpperCase()} />
                  <ImagePreview
                    title="Compressed"
                    imageUrl={compressedUrl}
                    size={compressedBlob?.size || 0}
                    meta={isProcessing ? "Working" : compressionLabel}
                    muted={isProcessing ? "Optimizing preview..." : "Adjust quality or format to generate preview"}
                  />
                </motion.section>

                <ComparisonCard originalSize={file.size} compressedSize={compressedBlob?.size || 0} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ControlPanel
            file={file}
            quality={quality}
            outputType={outputType}
            isProcessing={isProcessing}
            canDownload={Boolean(compressedBlob && compressedUrl)}
            onQualityChange={setQuality}
            onOutputTypeChange={setOutputType}
            onDownload={handleDownload}
          />
        </section>

        <motion.section
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-2xl shadow-slate-200/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid gap-0 lg:grid-cols-[1fr_1.25fr]">
            <div className="bg-gradient-to-br from-slate-950 to-teal-950 p-8 text-white sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-200">Developer Section</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Developed by Monika Yadav</h2>
            </div>
            <div className="p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Contact</p>
              <p className="mt-4 text-lg font-bold text-slate-950 dark:text-white">Email: {OWNER_EMAIL}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Built as a professional, portfolio-ready React project with client-side image compression, format conversion, responsive UI, dark mode, and polished motion design.
              </p>
            </div>
          </div>
        </motion.section>

        <footer className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">© 2026 Monika Yadav. Built for Digital Heroes Trial Task.</p>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{OWNER_EMAIL}</p>
          </div>
          <a
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noreferrer"
          >
            Built for Digital Heroes
            <ExternalLink size={16} />
          </a>
        </footer>
      </div>
    </main>
  );
}
