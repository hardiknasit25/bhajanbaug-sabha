import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number; // expiry in seconds
  iat?: number;
  [key: string]: any;
};

export function getExpiryFromToken(token: string): number | null {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to ms
  } catch {
    return null;
  }
}
