declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
  }

  export interface CashfreeInstance {
    checkout(options: CashfreeCheckoutOptions): Promise<any>;
  }

  export function load(options: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
}
