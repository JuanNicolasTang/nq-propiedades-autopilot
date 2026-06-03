export const ADMIN_SESSION_COOKIE = "nq_admin_session";

const SESSION_PREFIX = "nq-admin-session-v1";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(password: string) {
  const encoded = new TextEncoder().encode(`${SESSION_PREFIX}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return toHex(digest);
}

export async function getExpectedAdminSessionToken() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return null;
  }

  return createAdminSessionToken(password);
}

export async function isAdminSessionTokenValid(token?: string) {
  const expectedToken = await getExpectedAdminSessionToken();

  return Boolean(token && expectedToken && token === expectedToken);
}
