// Triggers a browser download for an in-memory Blob (used for QR/Excel exports).
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

// Sanitizes a name for use as a filename (strips path-illegal chars, collapses spaces).
export function safeFileName(name: string, fallback: string) {
  const cleaned = (name || "")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}
