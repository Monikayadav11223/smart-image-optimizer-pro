export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const FORMAT_OPTIONS = [
  { label: "JPEG", value: "image/jpeg", extension: "jpg" },
  { label: "PNG", value: "image/png", extension: "png" },
  { label: "WEBP", value: "image/webp", extension: "webp" }
];

export function isValidImage(file) {
  return Boolean(file && ACCEPTED_TYPES.includes(file.type));
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function getExtensionFromMime(mimeType) {
  return FORMAT_OPTIONS.find((format) => format.value === mimeType)?.extension || "jpg";
}

export function getOutputName(fileName, mimeType) {
  const extension = getExtensionFromMime(mimeType);
  const baseName = fileName.replace(/\.[^/.]+$/, "") || "compressed-image";
  return `${baseName}-optimized.${extension}`;
}

export function getDefaultOutputType(inputType) {
  if (inputType === "image/webp") return "image/jpeg";
  return inputType;
}

export function getConversionHint(inputType, outputType) {
  if (inputType === outputType) return "Compress without changing format";
  if (inputType === "image/jpeg" && outputType === "image/png") return "JPG to PNG";
  if (inputType === "image/png" && outputType === "image/jpeg") return "PNG to JPG";
  if (inputType === "image/webp" && outputType === "image/jpeg") return "WEBP to JPG";
  return "Format conversion";
}

export async function loadBitmap(file) {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the selected image."));
    image.src = URL.createObjectURL(file);
  });
}

export async function compressImage(file, outputType, quality) {
  const bitmap = await loadBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: outputType !== "image/jpeg" });

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  if (!ctx) {
    throw new Error("Your browser could not start the image compressor.");
  }

  if (outputType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(bitmap, 0, 0);

  if ("close" in bitmap) {
    bitmap.close();
  }

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, outputType, quality / 100);
  });

  if (!blob) {
    throw new Error("The browser could not export this image format.");
  }

  return blob;
}
