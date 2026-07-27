import type { User } from '../types';

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'Admin' | 'Recruiter' | 'Manager';
  iat: number;
  exp: number;
}

const base64UrlEncode = (str: string): string => {
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const decoded = atob(base64);
  return decodeURIComponent(
    Array.from(decoded)
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
};

export const createJwtToken = (user: User, expiresInHours = 24): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInHours * 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(`sig_bh_${user.id}_${now}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decodeJwtToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JWTPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string): boolean => {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
};
