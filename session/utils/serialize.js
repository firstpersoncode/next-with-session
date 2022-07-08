import { serialize } from "cookie";

export default function serializeToken(name, token, maxAge, expires) {
  return serialize(name, token, {
    secure:
      process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
    ...(expires ? { expires } : {}),
    path: "/",
  });
}
