export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number; // 10 for 10% or 200 for ₹200
  minOrderAmount?: number;
  maxDiscount?: number; // Cap for percentage discounts
  description: string;
  isActive: boolean;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "LAUNCH10",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    description: "Launch Special: 10% OFF on all Stage & Steel products",
    isActive: true,
  },
  {
    code: "STAGE10",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    description: "Official 10% Member Stack Discount",
    isActive: true,
  },
  {
    code: "DIVESH10",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    description: "Divesh Mehan Elite Athlete 10% Referral Discount",
    isActive: true,
  },
  {
    code: "ASHISH10",
    type: "percentage",
    value: 10,
    minOrderAmount: 0,
    description: "Ashish Yadav 5 AM Club 10% Referral Discount",
    isActive: true,
  },
  {
    code: "LAUNCH200",
    type: "flat",
    value: 200,
    minOrderAmount: 1500,
    description: "Flat ₹200 OFF on orders above ₹1,500",
    isActive: true,
  },
];

export interface ValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

export function validateCoupon(inputCode: string, subtotal: number): ValidationResult {
  if (!inputCode || !inputCode.trim()) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: "Please enter a valid coupon code.",
    };
  }

  const cleanCode = inputCode.trim().toUpperCase();

  // Hidden internal test code for ₹1 live PG testing (Not shown on website)
  if (cleanCode === "STAGE1TEST") {
    if (subtotal <= 1) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Subtotal is already ₹1.",
      };
    }
    const discount = subtotal - 1;
    return {
      isValid: true,
      coupon: {
        code: "STAGE1TEST",
        type: "flat",
        value: discount,
        description: "Internal Verification Stack",
        isActive: true,
      },
      discountAmount: discount,
      finalAmount: 1,
      message: "Verification Code Applied! Total Payable: ₹1.",
    };
  }

  const coupon = AVAILABLE_COUPONS.find(
    (c) => c.code.toUpperCase() === cleanCode && c.isActive
  );

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon code "${cleanCode}" is invalid or expired.`,
    };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: subtotal,
      message: `Coupon requires a minimum order of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === "flat") {
    discount = Math.min(coupon.value, subtotal);
  }

  const finalAmount = Math.max(0, subtotal - discount);

  return {
    isValid: true,
    coupon,
    discountAmount: discount,
    finalAmount,
    message: `Coupon "${coupon.code}" applied! You saved ₹${discount.toLocaleString("en-IN")}.`,
  };
}
