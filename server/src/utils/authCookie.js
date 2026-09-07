import { env } from "../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.isProduction,
  maxAge: durationToMs(env.jwtExpiresIn),
};

function durationToMs(value) {
  const match = String(value).match(/^(\d+)\s*(s|m|h|d)$/i);
  if (!match) return 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return amount * multipliers[match[2].toLowerCase()];
}

export function setAuthCookie(res, token) {
  res.cookie("medikiosk_token", token, cookieOptions);
}

export function clearAuthCookie(res) {
  res.clearCookie("medikiosk_token", cookieOptions);
}
