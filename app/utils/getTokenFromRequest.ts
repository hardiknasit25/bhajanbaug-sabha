import { parse } from "cookie";
import { AUTH_TOKEN } from "~/constant/constant";
import { getExpiryFromToken } from "~/utils/jwt";

export function getTokenFromRequest(request: Request, key?: string) {
  const raw = request.headers.get("Cookie") || "";
  const cookies = parse(raw);
  const value = cookies[key || AUTH_TOKEN];

  // For the auth token, treat a malformed or expired JWT as "no token" so route
  // guards redirect to /login instead of trusting the mere presence of a cookie.
  // (Signature verification still happens on the backend — this is a UX gate.)
  if ((!key || key === AUTH_TOKEN) && value) {
    const expiry = getExpiryFromToken(value);
    if (expiry === null || expiry <= Date.now()) {
      return undefined;
    }
  }

  return value;
}
