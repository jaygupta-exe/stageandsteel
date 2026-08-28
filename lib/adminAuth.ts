import { User } from "firebase/auth";

// Default admin emails list. Can be extended via NEXT_PUBLIC_ADMIN_EMAILS env variable.
export const DEFAULT_ADMIN_EMAILS = [
  "jaynirala82@gmail.com",
];

export function getAdminEmails(): string[] {
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];
  
  const allEmails = [...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...envEmails];
  return Array.from(new Set(allEmails));
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(user.email.toLowerCase());
}
