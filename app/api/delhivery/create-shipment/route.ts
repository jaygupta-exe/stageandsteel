import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, customer, shippingAddress, items } = body;

    const token = process.env.DELHIVERY_API_TOKEN;
    const clientName = process.env.DELHIVERY_CLIENT_NAME || "SANDS NUTRITION SURFACE";

    if (!token) {
      return NextResponse.json(
        { error: "Delhivery API Token not configured" },
        { status: 500 }
      );
    }

    if (!orderId || !customer || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required order/customer details" },
        { status: 400 }
      );
    }

    // Prepare Delhivery Express Shipment Format
    const shipmentData = {
      shipments: [
        {
          name: customer.name || "Valued Athlete",
          add: shippingAddress.address || "",
          pin: shippingAddress.pincode || "",
          city: shippingAddress.city || "",
          state: shippingAddress.state || "",
          country: "India",
          phone: customer.phone?.replace(/[^0-9]/g, "") || "",
          order: orderId,
          payment_mode: "Prepaid",
          return_pin: "",
          return_city: "",
          return_phone: "",
          return_add: "",
          return_state: "",
          return_country: "",
          products_desc: items?.map((i: any) => `${i.name} (${i.flavor || ""})`).join(", ") || "Stage & Steel Sports Nutrition Stack",
          hsn_code: "",
          cod_amount: "0",
          order_date: new Date().toISOString(),
          total_amount: String(amount || 0),
          seller_add: "",
          seller_name: "STAGE & STEEL LABS",
          seller_inv: "",
          quantity: String(items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0) || 1),
          waybill: "",
          shipment_width: "15",
          shipment_height: "22",
          shipment_length: "15",
          weight: String(1.2 * (items?.length || 1)),
          seller_gst_tin: "",
          shipping_mode: "Surface",
          address_type: "home",
        },
      ],
      pickup_location: {
        name: clientName,
      },
    };

    const formData = new URLSearchParams();
    formData.append("format", "json");
    formData.append("data", JSON.stringify(shipmentData));

    const response = await fetch("https://track.delhivery.com/api/cmu/create.json", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      console.warn("Delhivery shipment creation response:", data);
      return NextResponse.json({
        success: false,
        error: data.rmk || data.error || "Shipment creation issue",
        details: data,
        fallbackWaybill: `DELHIVERY_EXP_${orderId}`,
      });
    }

    const packages = data?.packages || [];
    const waybill = packages[0]?.waybill || `AWB_${Date.now()}`;

    return NextResponse.json({
      success: true,
      waybill,
      orderId,
      status: "MANIFESTED",
      details: data,
    });
  } catch (error: any) {
    console.error("Delhivery create shipment error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
