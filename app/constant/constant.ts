export const FALLBACK_AVATAR_PLACEHOLDER = "/images/avatar-placeholder.webp";
export const AUTH_TOKEN = "bhajanbaug_auth_token";
export const PRESENT_MEMBER = "presentMember";
export const ABSENT_MEMBER = "absentMember";

// Prefix encoded in member QR codes. Must match the backend (qrPdfUtil.ts QR_MEMBER_PREFIX).
// A scanned code like "BB-MEMBER:42" maps to member id 42.
export const MEMBER_QR_PREFIX = "BB-MEMBER:";
