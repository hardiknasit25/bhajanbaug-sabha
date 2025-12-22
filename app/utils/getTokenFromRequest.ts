import { parse } from "cookie";
import { AUTH_TOKEN } from "~/constant/constant";

export function getTokenFromRequest(request: Request, key?: string) {
  const raw = request.headers.get("Cookie") || "";
  const cookies = parse(raw);
  return cookies[key || AUTH_TOKEN];
}
