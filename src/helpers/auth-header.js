import { getAuthHeader } from "../services/auth-header";

export function authHeader() {
  // return authorization header with jwt token
  return getAuthHeader();
}
