import { NextResponse } from "next/server";
import packageJson from "@/package.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Build timestamp generated when the server starts/builds
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();
const APP_VERSION = packageJson.version || "1.0.0";

export async function GET() {
  return NextResponse.json(
    {
      version: APP_VERSION,
      buildTime: BUILD_TIME,
      timestamp: Date.now(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
