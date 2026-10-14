import { TrackedProduct, TrackedCartItem } from "./visitorTracking";

const SITE_URL = "https://stageandsteel.in";
const WHATSAPP_NUMBER = "919779159169";

interface ReminderEmailProps {
  customerName?: string;
  customerEmail?: string;
  viewedProducts?: TrackedProduct[];
  cartItems?: TrackedCartItem[];
  cartSubtotal?: number;
  siteUrl?: string;
}

/**
 * Normalizes image paths to absolute public URLs so email clients (Gmail, Outlook, Apple Mail) render them.
 */
function toAbsoluteImageUrl(url: string | undefined, siteUrl: string): string {
  if (!url) return `${siteUrl}/belgium-chocolate-cutout.png`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${siteUrl}${encodeURI(cleanPath)}`;
}

/**
 * Builds the responsive dark-aesthetic HTML email for the Visitor Reminder Feature.
 */
export function generateVisitorReminderEmailHtml({
  customerName,
  viewedProducts = [],
  cartItems = [],
  cartSubtotal = 0,
  siteUrl = SITE_URL,
}: ReminderEmailProps): { html: string; subject: string } {
  const firstName = customerName ? customerName.trim().split(" ")[0] : "Athlete";
  const hasCart = cartItems && cartItems.length > 0;
  const hasViews = viewedProducts && viewedProducts.length > 0;

  // Personalized dynamic subject line
  const subject = hasCart
    ? `Still thinking it over, ${firstName}? Your cart is waiting | Stage & Steel`
    : `Still looking for something, ${firstName}? | Stage & Steel`;

  // Render Cart section (if user added items to cart before leaving)
  const cartRowsHtml = hasCart
    ? cartItems
        .map(
          (item) => `
      <tr>
        <td style="padding:12px 14px;border-bottom:1px solid #262824;vertical-align:middle;width:54px;">
          <img src="${toAbsoluteImageUrl(item.thumbnail, siteUrl)}" alt="${item.name}" width="48" height="48" style="display:block;border-radius:4px;object-fit:contain;background:#1a1b18;padding:2px;border:1px solid #333530;"/>
        </td>
        <td style="padding:12px 14px;border-bottom:1px solid #262824;vertical-align:middle;">
          <div style="color:#F4F4F1;font-size:13px;font-weight:700;line-height:1.4;">${item.name}</div>
          ${
            item.flavor
              ? `<div style="color:#9c9e99;font-size:11px;margin-top:2px;">Flavor: ${item.flavor}</div>`
              : ""
          }
          <div style="color:#75804c;font-size:11px;margin-top:2px;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding:12px 14px;border-bottom:1px solid #262824;vertical-align:middle;text-align:right;">
          <div style="color:#9DB25E;font-size:14px;font-weight:800;letter-spacing:0.5px;">₹${(
            item.numericPrice * item.quantity
          ).toLocaleString("en-IN")}</div>
        </td>
      </tr>`
        )
        .join("")
    : "";

  // Render Viewed Products (up to 3 items in a clean responsive grid)
  const topViewed = viewedProducts.slice(0, 3);
  const viewedProductsHtml = hasViews
    ? topViewed
        .map((prod) => {
          const directUrl = `${siteUrl}/#products`;
          const imgUrl = toAbsoluteImageUrl(prod.thumbnail, siteUrl);

          return `
      <div style="margin-bottom:14px;background:#111210;border:1px solid #262824;border-radius:6px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="padding:16px;width:76px;vertical-align:middle;text-align:center;background:#141613;">
              <img src="${imgUrl}" alt="${prod.name}" width="68" height="68" style="display:block;margin:0 auto;object-fit:contain;"/>
            </td>
            <td style="padding:14px 16px;vertical-align:middle;">
              <div style="color:#75804c;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">${
                prod.category || "PERFORMANCE"
              }</div>
              <div style="color:#F4F4F1;font-size:14px;font-weight:700;margin:3px 0 6px 0;line-height:1.3;">${
                prod.name
              }</div>
              <div style="color:#9DB25E;font-size:15px;font-weight:800;letter-spacing:0.5px;">${
                prod.price || "₹" + (prod.numericPrice?.toLocaleString("en-IN") || "2,499")
              }</div>
            </td>
            <td style="padding:14px 16px;vertical-align:middle;text-align:right;width:120px;">
              <a href="${directUrl}" style="display:inline-block;padding:8px 14px;background:#596238;color:#F4F4F1;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:1px;border-radius:3px;text-align:center;">VIEW &rarr;</a>
            </td>
          </tr>
        </table>
      </div>`;
        })
        .join("")
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Still looking for something? | Stage & Steel</title>
</head>
<body style="margin:0;padding:0;background:#0c0d0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Container -->
  <div style="max-width:600px;margin:24px auto;background:#161715;border:1px solid #333530;border-radius:6px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.6);">
    
    <!-- Top Accent Bar -->
    <div style="background:linear-gradient(90deg,#596238,#9DB25E,#596238);height:4px;"></div>
    
    <!-- Brand Header -->
    <div style="padding:26px 24px;text-align:center;border-bottom:1px solid #262824;background:#141513;">
      <div style="color:#F4F4F1;font-size:22px;font-weight:900;letter-spacing:5px;margin:0;font-family:'Arial Black',sans-serif;">STAGE &amp; STEEL</div>
      <div style="color:#75804c;font-size:10px;font-weight:700;letter-spacing:3px;margin:6px 0 0 0;">FUEL &bull; DISCIPLINE &bull; PROGRESS</div>
    </div>

    <!-- Hero Card -->
    <div style="padding:28px 24px 20px 24px;">
      
      <!-- Greeting -->
      <div style="margin-bottom:20px;">
        <h2 style="color:#F4F4F1;font-size:20px;font-weight:800;margin:0 0 8px 0;letter-spacing:0.5px;">
          Hey ${firstName} 👋
        </h2>
        <p style="color:#A8A7A3;font-size:14px;line-height:1.6;margin:0;">
          You were checking out our collection earlier. Found something you liked? Don't leave your progress on hold — take the next step towards your goals.
        </p>
      </div>

      <!-- Main Action Button -->
      <div style="text-align:center;margin:24px 0 28px 0;">
        <a href="${siteUrl}/#products" style="display:inline-block;padding:14px 34px;background:#596238;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:2px;border-radius:4px;box-shadow:0 4px 14px rgba(89,98,56,0.35);">
          CONTINUE SHOPPING &rarr;
        </a>
      </div>

      ${
        hasCart
          ? `
      <!-- Active Cart Section -->
      <div style="margin-bottom:26px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <span style="color:#9DB25E;font-size:11px;font-weight:800;letter-spacing:2px;">🛒 ITEMS IN YOUR CART</span>
          <span style="color:#777873;font-size:11px;">Subtotal: ₹${cartSubtotal.toLocaleString(
            "en-IN"
          )}</span>
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#111210;border:1px solid #262824;border-radius:6px;border-collapse:collapse;">
          <tbody>
            ${cartRowsHtml}
          </tbody>
        </table>
        <div style="text-align:right;margin-top:10px;">
          <a href="${siteUrl}/#products" style="color:#9DB25E;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">Checkout Now &rarr;</a>
        </div>
      </div>`
          : ""
      }

      ${
        hasViews
          ? `
      <!-- Recently Viewed Items -->
      <div style="margin-top:20px;margin-bottom:24px;">
        <div style="color:#9DB25E;font-size:11px;font-weight:800;letter-spacing:2px;margin-bottom:12px;">
          👀 YOU VIEWED THESE ITEMS:
        </div>
        ${viewedProductsHtml}
      </div>`
          : ""
      }

      <!-- Trust Badges -->
      <div style="background:#111210;border:1px solid #262824;border-radius:6px;padding:16px 14px;margin-top:28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align:center;">
          <tr>
            <td style="width:33%;padding:6px;border-right:1px solid #262824;">
              <div style="color:#9DB25E;font-size:16px;margin-bottom:4px;">✓</div>
              <div style="color:#F4F4F1;font-size:11px;font-weight:700;">HPLC LAB TESTED</div>
              <div style="color:#777873;font-size:9px;margin-top:2px;">100% Verified Purity</div>
            </td>
            <td style="width:33%;padding:6px;border-right:1px solid #262824;">
              <div style="color:#9DB25E;font-size:16px;margin-bottom:4px;">★</div>
              <div style="color:#F4F4F1;font-size:11px;font-weight:700;">ZERO SPIKING</div>
              <div style="color:#777873;font-size:9px;margin-top:2px;">100% Genuine Whey</div>
            </td>
            <td style="width:33%;padding:6px;">
              <div style="color:#9DB25E;font-size:16px;margin-bottom:4px;">🚚</div>
              <div style="color:#F4F4F1;font-size:11px;font-weight:700;">FAST DISPATCH</div>
              <div style="color:#777873;font-size:9px;margin-top:2px;">Pan-India Delivery</div>
            </td>
          </tr>
        </table>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:24px 20px;background:#111210;border-top:1px solid #262824;text-align:center;">
      <p style="color:#8E8D88;font-size:12px;margin:0 0 6px 0;">
        Have questions about dosage or ingredients?
      </p>
      <p style="margin:0 0 16px 0;">
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Stage & Steel team, I was exploring your products and had a question!"
  )}" style="color:#9DB25E;font-size:12px;font-weight:700;text-decoration:none;">
          Chat with us on WhatsApp (+91 97791 59169) &rarr;
        </a>
      </p>
      <div style="border-top:1px solid #20221E;padding-top:14px;margin-top:14px;">
        <p style="color:#596238;font-size:10px;letter-spacing:2px;font-weight:700;margin:0 0 8px 0;">
          STAGE &amp; STEEL &bull; ENGINEERED FOR PERFORMANCE
        </p>
        <p style="color:#555652;font-size:10px;line-height:1.5;margin:0;">
          You received this email because you signed in to Stage &amp; Steel (Sands Nutrition).<br/>
          D-74 Shubham Enclave, Paschim Vihar, Delhi 110063
        </p>
      </div>
    </div>

  </div>
</body>
</html>`;

  return { html, subject };
}
