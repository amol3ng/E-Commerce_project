// Backend/config/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ── Order confirmation email ──────────────────────────────────────────────────
export async function sendOrderConfirmation({ to, full_name, order_number, items, total_amount, shipping_address, payment_method }) {
  const firstName = full_name?.split(' ')[0] || 'there';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const trackUrl = `${frontendUrl}/track/${order_number}`;

  // Build items table rows
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-family:'Courier New',monospace;font-size:13px;color:#2d1f14;">${item.product_name || item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-family:'Courier New',monospace;font-size:13px;color:#2d1f14;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-family:'Courier New',monospace;font-size:13px;color:#2d1f14;text-align:right;">R ${Number(item.unit_price || item.price).toFixed(2)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-family:'Courier New',monospace;font-size:13px;color:#c4784a;text-align:right;font-weight:bold;">R ${(Number(item.unit_price || item.price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const shippingLine = shipping_address
    ? `${shipping_address.street}, ${shipping_address.city}, ${shipping_address.postal_code}, ${shipping_address.country}`
    : 'See order details';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#fdf8f3;font-family:'Courier New',monospace;">

  <div style="max-width:600px;margin:40px auto;background:#fff;border:1px solid rgba(196,120,74,0.2);border-radius:8px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#c4784a;padding:36px 40px;text-align:center;">
      <div style="font-size:22px;letter-spacing:0.1em;margin-bottom:6px;">✿ FACE.IT</div>
      <div style="color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Order Confirmation</div>
    </div>

    <!-- Body -->
    <div style="padding:40px;">

      <p style="font-size:15px;color:#2d1f14;margin:0 0 8px;">Hi <strong>${firstName}</strong>,</p>
      <p style="font-size:13px;color:rgba(45,31,20,0.6);line-height:1.8;margin:0 0 32px;">
        Your order has been placed successfully. We'll get it packed and on its way to you soon.
        You can track your order status at any time using the button below.
      </p>

      <!-- Order ref -->
      <div style="background:rgba(196,120,74,0.06);border:1px solid rgba(196,120,74,0.2);border-radius:6px;padding:20px 24px;margin-bottom:32px;">
        <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c4784a;margin-bottom:6px;">Order Reference</div>
        <div style="font-size:22px;letter-spacing:0.1em;color:#2d1f14;font-weight:bold;">${order_number}</div>
      </div>

      <!-- Items table -->
      <div style="margin-bottom:32px;">
        <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c4784a;margin-bottom:12px;">Items Ordered</div>
        <table style="width:100%;border-collapse:collapse;border:1px solid rgba(196,120,74,0.15);border-radius:4px;overflow:hidden;">
          <thead>
            <tr style="background:rgba(196,120,74,0.06);">
              <th style="padding:10px 12px;text-align:left;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(45,31,20,0.4);">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(45,31,20,0.4);">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(45,31,20,0.4);">Unit</th>
              <th style="padding:10px 12px;text-align:right;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(45,31,20,0.4);">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>

      <!-- Total -->
      <div style="text-align:right;margin-bottom:32px;">
        <span style="font-size:13px;color:rgba(45,31,20,0.5);margin-right:16px;">Order Total</span>
        <span style="font-size:24px;color:#c4784a;font-weight:bold;letter-spacing:0.06em;">R ${Number(total_amount).toFixed(2)}</span>
      </div>

      <!-- Shipping + Payment -->
      <div style="display:flex;gap:24px;margin-bottom:36px;">
        <div style="flex:1;background:#fdf8f3;border-radius:6px;padding:16px 18px;">
          <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#c4784a;margin-bottom:8px;">Shipping To</div>
          <div style="font-size:12px;color:rgba(45,31,20,0.6);line-height:1.7;">${shippingLine}</div>
        </div>
        <div style="flex:1;background:#fdf8f3;border-radius:6px;padding:16px 18px;">
          <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#c4784a;margin-bottom:8px;">Payment Method</div>
          <div style="font-size:12px;color:rgba(45,31,20,0.6);text-transform:uppercase;letter-spacing:0.06em;">${payment_method}</div>
        </div>
      </div>

      <!-- Track button -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${trackUrl}" style="display:inline-block;background:#c4784a;color:#fff;text-decoration:none;padding:15px 44px;border-radius:4px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;">
          Track My Order
        </a>
      </div>

      <p style="font-size:11px;color:rgba(45,31,20,0.35);text-align:center;line-height:1.8;margin:0;">
        Questions? Reply to this email or visit <a href="${frontendUrl}" style="color:#c4784a;">${frontendUrl}</a><br/>
        Your skin journey is in good hands. ✿
      </p>
    </div>

    <!-- Footer -->
    <div style="background:rgba(196,120,74,0.04);border-top:1px solid rgba(196,120,74,0.12);padding:20px 40px;text-align:center;">
      <div style="font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(45,31,20,0.3);">
        Face.IT · Precision Skincare Technology · South Africa
      </div>
    </div>
  </div>

</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Face.IT Orders" <${process.env.MAIL_USER}>`,
    to,
    subject: `✿ Order Confirmed — ${order_number}`,
    html,
  });
}