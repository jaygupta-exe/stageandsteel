import { NextResponse } from "next/server";
import { getAllCoupons, validateCoupon } from "@/lib/coupons";
import { checkCouponUsage, normalizeCouponCode } from "@/lib/couponUsage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, subtotal, items, phone, email, userId } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { isValid: false, message: "Please enter a valid coupon code." },
        { status: 400 }
      );
    }

    const coupons = await getAllCoupons();
    const validation = validateCoupon(code, Number(subtotal) || 0, coupons, items || []);

    if (!validation.isValid || !validation.coupon) {
      return NextResponse.json(
        {
          isValid: false,
          discountAmount: 0,
          finalAmount: Number(subtotal) || 0,
          message: validation.message,
        },
        { status: 200 }
      );
    }

    const coupon = validation.coupon;

    // High Priority: Check Single Use Limit per User
    if (coupon.onePerUser !== false && (phone || email || userId)) {
      const usage = await checkCouponUsage(coupon.code, {
        phone: phone || null,
        email: email || null,
        userId: userId || null,
      });

      if (usage.alreadyUsed) {
        return NextResponse.json(
          {
            isValid: false,
            isAlreadyUsed: true,
            discountAmount: 0,
            finalAmount: Number(subtotal) || 0,
            message:
              usage.reason ||
              `Coupon "${coupon.code}" has already been redeemed on a previous order. This offer is valid only once per customer.`,
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({
      isValid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        onePerUser: coupon.onePerUser ?? true,
        description: coupon.description,
      },
      discountAmount: validation.discountAmount,
      finalAmount: validation.finalAmount,
      message: validation.message,
    });
  } catch (error: any) {
    console.error("[API Coupons Validate] Internal Error:", error);
    return NextResponse.json(
      { isValid: false, message: "Failed to validate coupon code." },
      { status: 500 }
    );
  }
}

