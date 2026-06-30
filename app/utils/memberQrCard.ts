import { MEMBER_QR_PREFIX } from "~/constant/constant";

// Default header (hall / community name) printed at the top of every card.
export const DEFAULT_QR_HEADER = "સ્વામિનારાયણ સંતસંગ હોલ ભજનબાગ";

// Theme colors (from tailwind.config.js).
const COLOR_PRIMARY = "#1D1D27";
const COLOR_LIGHT = "#738091";
const COLOR_BORDER = "#C5CBD3";

export interface MemberQrCardInput {
  memberId: number;
  // Raw "first middle last" name; normalized/title-cased internally.
  name?: string | null;
  smk?: string | null;
  mobile?: string | null;
  header?: string;
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Public, normalized display name (used for alt text / file names too).
export function displayMemberName(name: string | null | undefined, id: number) {
  const cleaned = (name || "").replace(/\s+/g, " ").trim();
  return titleCase(cleaned || `Member #${id}`);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (typeof (ctx as any).roundRect === "function") {
    ctx.beginPath();
    (ctx as any).roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Greedy word-wrap on whitespace, constrained to maxWidth using the ctx font.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let line = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${line} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
}

/**
 * Renders a GPay-style member QR card to a canvas and returns it as a PNG data
 * URL. The card has a dark header band (hall name), the QR in the middle, and
 * the member's name, mobile no. (if any), then SMK no. + ID on one row below.
 * `qrcode` is imported dynamically so this only ever runs in the browser
 * (SSR-safe).
 *
 * Used by both the single-member preview dialog and the bulk group download so
 * every card looks identical.
 */
export async function buildMemberQrCard(
  input: MemberQrCardInput,
): Promise<string> {
  const header = input.header ?? DEFAULT_QR_HEADER;
  const name = displayMemberName(input.name, input.memberId);
  // Always show an SMK value; fall back to "No SMK" when missing (matches the
  // rest of the app, e.g. MemberDetailInfo).
  const smk = input.smk && input.smk !== "NA" ? input.smk : "No SMK";
  // Mobile is optional — only shown when present.
  const mobile =
    input.mobile && String(input.mobile).trim()
      ? String(input.mobile).trim()
      : null;
  const id = input.memberId;
  const qrText = `${MEMBER_QR_PREFIX}${id}`;

  // Layout constants (device pixels; the card is scaled down for display).
  const W = 720;
  const PAD = 48;
  const INNER = W - PAD * 2;
  const RADIUS = 28;
  const TITLE_SIZE = 34;
  const TITLE_LH = 46;
  const HEADER_PAD_V = 40;
  const QR_SIZE = INNER;
  const GAP_HEADER_QR = 44;
  const GAP_QR_NAME = 40;
  const NAME_SIZE = 38;
  const NAME_LH = 50;
  const SUB_SIZE = 28;
  const SUB_LH = 42;
  const GAP_NAME_SUB = 18;
  const BOTTOM_PAD = 48;

  const titleFont = `700 ${TITLE_SIZE}px "Baloo Bhai 2", "Noto Sans Gujarati", sans-serif`;
  const nameFont = `600 ${NAME_SIZE}px Poppins, Inter, sans-serif`;
  const subFont = `500 ${SUB_SIZE}px Poppins, Inter, sans-serif`;

  // Generate the QR image (same BB-MEMBER:<id> payload the scanner expects).
  const mod = await import("qrcode");
  const QRCode = (mod as any).default ?? mod;
  const qrUrl: string = await QRCode.toDataURL(qrText, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: QR_SIZE,
    color: { dark: "#000000", light: "#ffffff" },
  });

  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Make sure the web fonts are ready so measuring + drawing are accurate.
  if (typeof document !== "undefined" && (document as any).fonts?.load) {
    try {
      await Promise.all([
        (document as any).fonts.load(titleFont, header),
        (document as any).fonts.load(nameFont, name),
        (document as any).fonts.load(subFont, "0123456789"),
      ]);
    } catch {
      /* fall back to whatever is available */
    }
  }

  // Measure wrapped lines, then compute the canvas height.
  ctx.font = titleFont;
  const titleLines = wrapText(ctx, header, INNER);
  ctx.font = nameFont;
  const nameLines = wrapText(ctx, name, INNER);

  const headerH = HEADER_PAD_V * 2 + titleLines.length * TITLE_LH;
  const qrTop = headerH + GAP_HEADER_QR;
  const qrBottom = qrTop + QR_SIZE;
  const nameTop = qrBottom + GAP_QR_NAME;
  const afterName = nameTop + nameLines.length * NAME_LH;
  const subTop = afterName + GAP_NAME_SUB;
  const subCount = 1 + (mobile ? 1 : 0); // (Mobile?) + (SMK | ID) row
  const H = subTop + subCount * SUB_LH + BOTTOM_PAD;

  canvas.width = W;
  canvas.height = H;

  // Card background (rounded, clipped).
  roundRectPath(ctx, 0, 0, W, H, RADIUS);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  // Header band + title.
  ctx.fillStyle = COLOR_PRIMARY;
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = titleFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let ty = HEADER_PAD_V;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, ty);
    ty += TITLE_LH;
  }

  // QR code with a thin frame.
  ctx.drawImage(qrImg, PAD, qrTop, QR_SIZE, QR_SIZE);
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, qrTop, QR_SIZE, QR_SIZE);

  // Name.
  ctx.fillStyle = COLOR_PRIMARY;
  ctx.font = nameFont;
  let ny = nameTop;
  for (const line of nameLines) {
    ctx.fillText(line, W / 2, ny);
    ny += NAME_LH;
  }

  // Mobile (if any) above, then SMK no. + Hajri no. (member id) on one row.
  ctx.fillStyle = COLOR_LIGHT;
  ctx.font = subFont;
  let sy = subTop;
  if (mobile) {
    ctx.fillText(`Mobile No: ${mobile}`, W / 2, sy);
    sy += SUB_LH;
  }
  ctx.fillText(`SMK No: ${smk}   |   Hajri No: ${id}`, W / 2, sy);

  ctx.restore();

  // Outer border.
  roundRectPath(ctx, 1, 1, W - 2, H - 2, RADIUS);
  ctx.strokeStyle = COLOR_BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  return canvas.toDataURL("image/png");
}

// Convenience: build the card and return it as a PNG Blob (for downloads).
export async function memberQrCardBlob(
  input: MemberQrCardInput,
): Promise<Blob> {
  const url = await buildMemberQrCard(input);
  return await (await fetch(url)).blob();
}
