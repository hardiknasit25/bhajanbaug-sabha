import { useEffect, useRef, useState } from "react";

// Stable DOM id for the camera region. Only one scanner is mounted at a time
// (inside a dialog), so a fixed id is safe.
const SCANNER_REGION_ID = "qr-scanner-region";

interface QrScannerProps {
  // Called with the decoded QR text. The scanner suppresses repeated decodes of
  // the SAME text within `cooldownMs` so a card held in view isn't fired 10x/sec.
  onScan: (decodedText: string) => void;
  cooldownMs?: number;
}

/**
 * Camera-based QR scanner built on `html5-qrcode`. The library touches browser-only
 * APIs (navigator.mediaDevices, document), so it is imported dynamically inside an
 * effect to stay SSR-safe. Camera access requires a secure context (https or localhost).
 */
export default function QrScanner({ onScan, cooldownMs = 2500 }: QrScannerProps) {
  const scannerRef = useRef<any>(null);
  const lastScanRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });
  // Keep the latest onScan without re-running the start/stop effect.
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const instance = new Html5Qrcode(SCANNER_REGION_ID);
        scannerRef.current = instance;

        await instance.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const min = Math.min(viewfinderWidth, viewfinderHeight);
              const size = Math.max(150, Math.floor(min * 0.7));
              return { width: size, height: size };
            },
          },
          (decodedText: string) => {
            const now = Date.now();
            const last = lastScanRef.current;
            // Debounce repeated reads of the same code.
            if (decodedText === last.text && now - last.time < cooldownMs) return;
            lastScanRef.current = { text: decodedText, time: now };
            onScanRef.current(decodedText);
          },
          () => {
            // Per-frame "no QR found" callback — noisy, intentionally ignored.
          },
        );
        // Unmounted while the camera was starting — shut it back down.
        if (cancelled) {
          instance
            .stop()
            .then(() => instance.clear())
            .catch(() => {});
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.message ||
              "Unable to access the camera. Please allow camera permission and use HTTPS.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      const instance = scannerRef.current;
      scannerRef.current = null;
      if (instance) {
        // stop() rejects if the camera never started; swallow either way.
        instance
          .stop()
          .then(() => instance.clear())
          .catch(() => {});
      }
    };
  }, [cooldownMs]);

  return (
    <div className="w-full">
      <div
        id={SCANNER_REGION_ID}
        className="w-full overflow-hidden rounded-md bg-black"
      />
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-center text-xs text-textLightColor">
          Point the camera at a member&apos;s QR code
        </p>
      )}
    </div>
  );
}
