import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get("waybill");
    const orderId = searchParams.get("orderId");

    const query = waybill ? `waybill=${waybill}` : orderId ? `ref_ids=${orderId}` : null;

    if (!query) {
      return NextResponse.json(
        { error: "Please provide a waybill number or order ID" },
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
      `https://track.delhivery.com/api/v1/packages/json/?${query}`,
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
        { error: "Failed to fetch tracking details" },
        { status: response.status }
      );
    }

    const shipment = data?.ShipmentData?.[0]?.Shipment;

    if (!shipment) {
      return NextResponse.json({
        found: false,
        message: "Shipment record is being processed at Delhivery hub.",
        status: "MANIFESTED",
      });
    }

    return NextResponse.json({
      found: true,
      status: shipment.Status?.Status || "IN_TRANSIT",
      statusLocation: shipment.Status?.StatusLocation || "Dispatched from Sands Nutrition Warehouse",
      statusDateTime: shipment.Status?.StatusDateTime,
      expectedDelivery: shipment.ExpectedDeliveryDate,
      destination: shipment.Destination,
      origin: shipment.Origin,
      scans: shipment.Scans || [],
    });
  } catch (error: any) {
    console.error("Delhivery tracking error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
