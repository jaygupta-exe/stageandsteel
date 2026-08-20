import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");

    if (!pincode || pincode.length !== 6) {
      return NextResponse.json(
        { error: "Invalid 6-digit PIN code" },
        { status: 400 }
      );
    }

    const token = process.env.DELHIVERY_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Delhivery API Token not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to verify pincode with Delhivery" },
        { status: response.status }
      );
    }

    const deliveryCodes = data?.delivery_codes;
    const isServiceable =
      Array.isArray(deliveryCodes) &&
      deliveryCodes.length > 0 &&
      deliveryCodes[0]?.postal_code?.pre_paid === "Y";

    const info = deliveryCodes?.[0]?.postal_code;

    return NextResponse.json({
      serviceable: Boolean(isServiceable),
      city: info?.district || info?.city || "",
      state: info?.state || "",
      prepaid: info?.pre_paid === "Y",
      cod: info?.cod === "Y",
    });
  } catch (error: any) {
    console.error("Delhivery pincode check error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
